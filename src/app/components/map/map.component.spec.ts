/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Injector } from '@angular/core';

import { MaterialModule } from '@angular/material';
import { ChartModule } from 'angular2-chartjs';

import {} from 'jasmine';

import { MapComponent } from './map.component';
import { LegendComponent } from '../legend/legend.component';
import { ExportService } from '../../services/export.service';
import { ConnectionService } from '../../services/connection.service';
import { DatasetService } from '../../services/dataset.service';
import { TranslationService } from '../../services/translation.service';
import { FilterService } from '../../services/filter.service';
import { ThemesService } from '../../services/themes.service';
import { ErrorNotificationService } from '../../services/error-notification.service';
import { NeonGTDConfig } from '../../neon-gtd-config';

function webgl_support(): any {
    try {
        let canvas = document.createElement('canvas');
        return !!window['WebGLRenderingContext'] && (
            canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) { return false; }
};

describe('Component: Map', () => {
    let testConfig: NeonGTDConfig = new NeonGTDConfig();
    let component: MapComponent;
    let fixture: ComponentFixture<MapComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MapComponent,
                LegendComponent
            ],
            providers: [
                ConnectionService,
                DatasetService,
                FilterService,
                ExportService,
                TranslationService,
                ErrorNotificationService,
                ThemesService,
                Injector,
                { provide: 'config', useValue: testConfig }
            ],
            imports: [
                MaterialModule,
                MaterialModule.forRoot(),
                FormsModule,
                ChartModule
            ]
        });
        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });



    // Cesium causes the test to fail just because PhantomJS does not have webgl.
    // Disabling this test until i can find a resolution.
    it('should create an instance', () => {
        if (!webgl_support()) {
            pending('Cesium requires webgl which is not supported by the browser implementation.');
        }
        expect(component).toBeTruthy();
    });

});
