import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomeMenu } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ModelDetailPage } from '../pages/model-detail/model-detail';
import { ModelDetailBlockPage } from '../pages/model-detail-block/model-detail-block';
import { ModelDetailDiagramPage } from '../pages/model-detail-diagram/model-detail-diagram';
import { ModelDetailParamPage } from '../pages/model-detail-param/model-detail-param';
import { ModelDetailSimuListPage } from '../pages/model-detail-simu-list/model-detail-simu-list';
import { ModelDetailSimuResultPage } from '../pages/model-detail-simu-result/model-detail-simu-result';
import { ModelDetailSimulationPage } from '../pages/model-detail-simulation/model-detail-simulation';
import { ModelListPage } from '../pages/model-list/model-list';
import { SettingsPage } from '../pages/settings/settings';
import { SimulationListPage } from '../pages/simulation-list/simulation-list';

import {ConnectionService} from '../providers/connection-service/connection-service';
import {ModelService} from '../providers/model-service/model-service';
import {SimulationService} from '../providers/simulation-service/simulation-service';
import {PusherService} from '../providers/pusher-service/pusher-service';
import {VisualizationService} from '../providers/visualization-service/visualization-service';

import {Server, Block, Model, Simulation} from '../data-types/data-types';
import {SimData, Diagram} from  '../data-types/result-diagram-types';

@NgModule({
  declarations: [
    MyApp,
    HomeMenu,
    LoginPage,
    ModelDetailPage,
    ModelDetailBlockPage,
    ModelDetailDiagramPage,
    ModelDetailParamPage,
    ModelDetailSimuListPage,
    ModelDetailSimuResultPage,
    ModelDetailSimulationPage,
    ModelListPage,
    SettingsPage,
    SimulationListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeMenu,
    LoginPage,
    ModelDetailPage,
    ModelDetailBlockPage,
    ModelDetailDiagramPage,
    ModelDetailParamPage,
    ModelDetailSimuListPage,
    ModelDetailSimuResultPage,
    ModelDetailSimulationPage,
    ModelListPage,
    SettingsPage,
    SimulationListPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ModelService,
    SimulationService,
    ConnectionService,
    PusherService,
    VisualizationService
  ]
})
export class AppModule {}
