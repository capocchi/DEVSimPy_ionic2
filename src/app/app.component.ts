import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import {ConnectionService} from '../providers/connection-service/connection-service';
import {ModelService} from '../providers/model-service/model-service';
import {SimulationService} from '../providers/simulation-service/simulation-service';
import {PusherService} from '../providers/pusher-service/pusher-service';
import {VisualizationService} from '../providers/visualization-service/visualization-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
