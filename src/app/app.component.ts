import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import {LoginPage} from '../pages/login/login';
import {ConnectionService} from '../providers/connection-service/connection-service';
import {ModelService} from '../providers/model-service/model-service';
import {SimulationService} from '../providers/simulation-service/simulation-service';
import {PusherService} from '../providers/pusher-service/pusher-service';
import {VisualizationService} from '../providers/visualization-service/visualization-service';

/*@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [ModelService, SimulationService, ConnectionService, PusherService, VisualizationService],
  prodMode: false
})*/

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
