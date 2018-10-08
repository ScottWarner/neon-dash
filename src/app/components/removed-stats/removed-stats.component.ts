/*
 * Copyright 2017 Next Century Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Injector,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import { ActiveGridService } from '../../services/active-grid.service';
import { ConnectionService } from '../../services/connection.service';
import { DatasetService } from '../../services/dataset.service';
import { FilterService } from '../../services/filter.service';
import { ExportService } from '../../services/export.service';
import { ThemesService } from '../../services/themes.service';
import { VisualizationService } from '../../services/visualization.service';

import { BaseNeonComponent, BaseNeonOptions } from '../base-neon-component/base-neon.component';
import { EMPTY_FIELD, FieldMetaData } from '../../dataset';
import { neonVariables } from '../../neon-namespaces';
import * as neon from 'neon-framework';

/**
 * Manages configurable options for the specific visualization.
 */
export class RemovedOptions extends BaseNeonOptions {
    public removedField: string;
    public dataField: FieldMetaData;

    /**
     * Initializes all the non-field options for the specific visualization.
     *
     * @override
     */
    onInit() {
        this.removedField = this.injector.get('removedField', 'removed');
    }

    /**
     * Updates all the field options for the specific visualization.  Called on init and whenever the table is changed.
     *
     * @override
     */
    updateFieldsOnTableChanged() {
        this.dataField = this.findFieldObject(this.removedField);
    }
}

@Component({
    selector: 'app-removed-stats',
    templateUrl: './removed-stats.component.html',
    styleUrls: ['./removed-stats.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemovedStatsComponent extends BaseNeonComponent implements OnInit, OnDestroy {
    @ViewChild('visualization', {read: ElementRef}) visualization: ElementRef;
    @ViewChild('headerText') headerText: ElementRef;
    @ViewChild('infoText') infoText: ElementRef;

    public filters: {
        id: string,
        field: string,
        value: string,
        translated: string,
        prettyField: string
    }[] = [];

    public options: RemovedOptions;

    public activeData: any[] = [];
    public termsCount: number = 0;
    public textColor: string = '#111';

    public counts = {
        docs: 0,
        removed: 0,
        reposts: 0,
        repostsRemoved: 0,
        removedPercent: 0
    };

    public foregroundColor = '#27607e';
    public backgroundColor = '#c5bfbf';

    public isLoading = false;
    private loaded = {
        docCount: false,
        removedCount: false,
        repostCount: false,
        repostRemoved: false
    };

    constructor(
        activeGridService: ActiveGridService,
        connectionService: ConnectionService,
        datasetService: DatasetService,
        filterService: FilterService,
        exportService: ExportService,
        injector: Injector,
        themesService: ThemesService,
        ref: ChangeDetectorRef,
        visualizationService: VisualizationService
    ) {
        super(
            activeGridService,
            connectionService,
            datasetService,
            filterService,
            exportService,
            injector,
            themesService,
            ref,
            visualizationService
        );

        this.options = new RemovedOptions(this.injector, this.datasetService, 'Removed Stats', 40);
    }

    subNgOnInit() {
        // Do nothing
    }

    postInit() {
        this.textColor = this.getPrimaryThemeColor().toHexString();

        this.startLoading();
    }

    subNgOnDestroy() {
        // Do nothing
    }

    subGetBindings(bindings: any) {
        bindings.dataField = this.options.dataField.columnName;
        bindings.removedField = this.options.removedField;
    }

    getExportFields() {
        return [{
            columnName: this.options.dataField.columnName,
            prettyName: this.options.dataField.prettyName
        }, {
            columnName: 'value',
            prettyName: 'Count'
        }];
    }

    refreshVisualization() {
        this.startLoading();
    }

    getFilterText(filter) {
        return filter.prettyField + ' = ' + filter.value;
    }

    getFilterDetail(filter) {
        return filter.translated ? (' (' + filter.translated + ')') : '';
    }

    isValidQuery() {
        let valid = true;
        valid = (this.options.database && this.options.database.name && valid);
        valid = (this.options.table && this.options.table.name && valid);
        valid = (this.options.removedField && valid);
        return valid;
    }

    getDocCount() {
        // console.log('Running document count');

        let countQuery = new neon.query.Query()
            .selectFrom(this.options.database.name, this.options.table.name).where(this.createClause())
            .aggregate(neonVariables.COUNT, '*', '_docCount');

        this.executeQuery(countQuery);
    }

    getRepostCount() {
        // console.log('Running repost count');

        let countQuery = new neon.query.Query()
            .selectFrom(this.options.database.name, this.options.table.name).where(this.createClause())
            .aggregate(neonVariables.SUM, 'reposts_count', '_repostsCount');

        this.executeQuery(countQuery);
    }

    getRepostRemovedCount() {
        // console.log('Running repost removed count');
        let clause = this.createClause(neon.query.where(this.options.removedField, '>', 0));

        let countQuery = new neon.query.Query()
            .selectFrom(this.options.database.name, this.options.table.name).where(clause)
            .aggregate(neonVariables.SUM, 'reposts_count', '_repostsRemovedCount');

        this.executeQuery(countQuery);
    }

    /**
     * Creates and returns the Neon where clause for the visualization.
     *
     * @return {any}
     */
    createClause(additionalClause?: any): any {
        // console.log('Creating clauses');
        let clauses = [];

        // Apply the additional clause, if needed
        if (additionalClause) {
            clauses.push(additionalClause);
        }

        let filters = this.filterService.getFiltersForFields(this.options.database.name, this.options.table.name);

        if (filters && filters.length > 0) {
            for (let filter of filters) {
                if (filter.filter.whereClause) {
                    clauses.push(filter.filter.whereClause);
                }
            }
        }

        if (clauses.length === 0) {
            return null;
        }

        return clauses.length > 1 ? neon.query.and.apply(neon.query, clauses) : clauses[0];
    }

    getRemovedCount() {
        this.executeQuery(this.createQuery());
    }

    createQuery(): neon.query.Query {
        // console.log('Running removed query');

        let clauses = this.createClause(neon.query.where(this.options.removedField, '>', 0));
        // Add a clause to query for only removed docs

        let countQuery = new neon.query.Query()
            .selectFrom(this.options.database.name, this.options.table.name).where(clauses)
            .aggregate(neonVariables.COUNT, '*', '_removedCount');

        return countQuery;
    }

    /**
     * Returns the list of filters for the visualization to ignore.
     *
     * @return {any[]}
     * @override
     */
    getFiltersToIgnore() {
        return null;
    }

    onQuerySuccess(response): void {
        if (response.data.length === 1 && response.data[0]._docCount !== undefined) {
            this.counts.docs = response.data[0]._docCount;
            this.loaded.docCount = true;

            // console.log('Got doc count: ' + this.docCount);
        } else if (response.data.length === 1 && response.data[0]._removedCount !== undefined) {
            this.counts.removed = response.data[0]._removedCount;
            this.loaded.removedCount = true;

            // console.log('Got removed count: ' + this.removedCount);
        } else if (response.data.length === 1 && response.data[0]._repostsCount !== undefined) {
            this.counts.reposts = response.data[0]._repostsCount;
            this.loaded.repostCount = true;

            // console.log('Got repost count: ' + this.repostsCount);
        } else if (response.data.length === 1 && response.data[0]._repostsRemovedCount !== undefined) {
            this.counts.repostsRemoved = response.data[0]._repostsRemovedCount;
            this.loaded.repostRemoved = true;

            // console.log('Got repost removed count: ' + this.repostsRemovedCount);
        }

        this.checkIfLoading();

        if (this.isLoading) {
            // Check what else we need to load
            if (!this.loaded.docCount) {
                this.getDocCount();
            } else if (!this.loaded.removedCount) {
                this.getRemovedCount();
            } else if (!this.loaded.repostCount) {
                this.getRepostCount();
            } else if (!this.loaded.repostRemoved) {
                this.getRepostRemovedCount();
            }
        }

        // Calculate removed percent
        if (this.counts.docs > 0) {
            if (this.counts.removed === 0) {
                this.counts.removedPercent = 0;
            } else {
                this.counts.removedPercent =
                Math.floor(this.counts.removed / this.counts.docs * 100);
            }
        }
    }

    private startLoading() {
        this.isLoading = true;
        for (let key in this.loaded) {
            if (this.loaded[key]) {
                this.loaded[key] = false;
            }
        }
        for (let key in this.counts) {
            if (this.counts[key]) {
                this.counts[key] = 0;
            }
        }

        // Start the process
        this.getDocCount();
    }

    private checkIfLoading() {
        let stillLoading = false;
        // tslint:disable-next-line:forin
        for (let key in this.loaded) {
            stillLoading = stillLoading || this.loaded[key];
        }

        this.isLoading = stillLoading;
    }

    handleFiltersChangedEvent() {
        // Reload everything on filters changed
        this.startLoading();
    }

    setupFilters() {
        // Get neon filters
        // See if any neon filters are local filters and set/clear appropriately
        let neonFilters = this.filterService.getFiltersForFields(this.options.database.name, this.options.table.name,
            [this.options.dataField.columnName]);
        this.filters = [];

        for (let neonFilter of neonFilters) {
            if (!neonFilter.filter.whereClause.whereClauses) {
                let field = this.options.findField(neonFilter.filter.whereClause.lhs);
                if (!field) {
                    field = {
                        columnName: neonFilter.filter.whereClause.lhs,
                        prettyName: neonFilter.filter.whereClause.lhs,
                        hide: false,
                        type: ''
                    };
                }
                let value = neonFilter.filter.whereClause.rhs;
                let filter = {
                    id: neonFilter.id,
                    field: field.columnName,
                    prettyField: field.prettyName,
                    translated: '',
                    value: value
                };
                if (this.filterIsUnique(filter)) {
                    this.filters.push(filter);
                }
            }
        }
    }

    isFiltered(text: string): boolean {
        return this.filters.some((filter) => {
            return filter.value === text;
        });
    }

    filterIsUnique(filter) {
        for (let existingFilter of this.filters) {
            if (existingFilter.value === filter.value && existingFilter.field === filter.field) {
                return false;
            }
        }
        return true;
    }

    /**
     * Creates and returns the text for the settings button.
     *
     * @return {string}
     * @override
     */
    getButtonText() {
        if (!this.counts.docs) {
            return 'No Data';
        }
        return 'Total ' + super.prettifyInteger(this.counts.docs);
    }

    /**
     * Returns the list of filter objects.
     *
     * @return {array}
     * @override
     */
    getCloseableFilters() {
        return this.filters;
    }

    // filter is a filter from the filter service that the filter to remove corresponds to.
    removeFilter(filter: any) {
        // We do it this way instead of using splice() because we have to replace filter array
        // with a new object for Angular to recognize the change. It doesn't respond to mutation.
        let newFilters = [];
        for (let index = this.filters.length - 1; index >= 0; index--) {
            if (this.filters[index].id !== filter.id) {
                newFilters.push(this.filters[index]);
            }
        }
        this.filters = newFilters;
    }

    // These methods must be present for AoT compile
    requestExport() {
        // Do nothing.
    }

    /**
     * Returns an object containing the ElementRef objects for the visualization.
     *
     * @return {any} Object containing:  {ElementRef} headerText, {ElementRef} infoText, {ElementRef} visualization
     * @override
     */
    getElementRefs() {
        return {
            visualization: this.visualization,
            headerText: this.headerText,
            infoText: this.infoText
        };
    }

    /**
     * Returns the options for the specific visualization.
     *
     * @return {BaseNeonOptions}
     * @override
     */
    getOptions(): BaseNeonOptions {
        return this.options;
    }
}
