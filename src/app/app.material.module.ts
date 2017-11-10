import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatDialogModule, MatGridListModule, MatIconModule, MatInputModule,
    MatListModule, MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule,
    MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatTabsModule,
    MatToolbarModule, MatTooltipModule,
    MATERIAL_COMPATIBILITY_MODE
} from '@angular/material';

const MD_MODULES = [
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
];

@NgModule({
    declarations: [],
    imports: MD_MODULES,
    exports: MD_MODULES,
    providers: [
        {
            provide: MATERIAL_COMPATIBILITY_MODE,
            useValue: true
        }
    ],
    entryComponents: [],
    bootstrap: []
})

/**
 * This class just imports/exports all the material components we need
 */
/* tslint:disable:no-unnecessary-class */
export class AppMaterialModule { }
