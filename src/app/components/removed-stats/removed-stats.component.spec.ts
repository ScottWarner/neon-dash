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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseMetaData, FieldMetaData, TableMetaData, Dataset } from '../../dataset';

import { FormsModule } from '@angular/forms';
import { Injector } from '@angular/core';

import { RemovedStatsComponent } from './removed-stats.component';
import { ExportControlComponent } from '../export-control/export-control.component';
import { ActiveGridService } from '../../services/active-grid.service';
import { ExportService } from '../../services/export.service';
import { ConnectionService } from '../../services/connection.service';
import { DatasetService } from '../../services/dataset.service';
import { TranslationService } from '../../services/translation.service';
import { FilterService } from '../../services/filter.service';
import { ThemesService } from '../../services/themes.service';
import { ErrorNotificationService } from '../../services/error-notification.service';
import { NeonGTDConfig } from '../../neon-gtd-config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../app.material.module';
import { UnsharedFilterComponent } from '../unshared-filter/unshared-filter.component';
import { VisualizationService } from '../../services/visualization.service';
import { neonVariables } from '../../neon-namespaces';

import * as neon from 'neon-framework';
import { ChartComponent } from '../chart/chart.component';
import { initializeTestBed } from '../../../testUtils/initializeTestBed';
import { DatasetServiceMock } from '../../../testUtils/MockServices/DatasetServiceMock';
import { FilterServiceMock } from '../../../testUtils/MockServices/FilterServiceMock';
import { NgxGaugeModule } from 'ngx-gauge';

describe('Component: RemovedStats', () => {
    let component: RemovedStatsComponent;
    let fixture: ComponentFixture<RemovedStatsComponent>;
    let getService = (type: any) => fixture.debugElement.injector.get(type);

    initializeTestBed({
        declarations: [
            ChartComponent,
            RemovedStatsComponent,
            ExportControlComponent,
            UnsharedFilterComponent,
            ChartComponent
        ],
        providers: [
            ActiveGridService,
            ConnectionService,
            {
                provide: DatasetService,
                useClass: DatasetServiceMock
            },
            { provide: FilterService, useClass: FilterServiceMock },
            ExportService,
            TranslationService,
            VisualizationService,
            ErrorNotificationService,
            ThemesService,
            Injector,
            { provide: 'config', useValue: new NeonGTDConfig() }
        ],
        imports: [
            AppMaterialModule,
            NgxGaugeModule,
            FormsModule,
            BrowserAnimationsModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RemovedStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('exists', () => {
        expect(component).toBeTruthy();
    });
});
