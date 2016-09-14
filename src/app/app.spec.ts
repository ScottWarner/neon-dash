/*
 * Copyright 2016 Next Century Corporation
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
/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DatasetService } from './services/dataset.service';

describe('App: AppComponent', () => {
  beforeEach(() => {
    addProviders([DatasetService, AppComponent]);
  });

  it('should create the app',
    inject([AppComponent], (app: AppComponent) => {
      expect(app).toBeTruthy();
    }));

  it('should have no dataset select at start',
    inject([AppComponent], (app: AppComponent) => {
      expect(app.selectedDataset).toEqual('Select a Dataset');
    }));
});