import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {ModelListPage} from '../../pages/model-list/model-list';

@Component({
  templateUrl: 'login.html',
})
export class LoginPage {
  public _userServer : string = '';
  public _userLogin : string = '';
  public _userPassword : string = '';

  constructor(public nav: NavController,
              public _connectionService: ConnectionService,
              public alertController: AlertController) {}

  ionViewWillEnter() {
    //console.log('enter SettingsPage')
    this._connectionService.loadStoredServers();
    this._connectionService.loadLastUsedServer();
  }

  selectServer() {
    //console.log("select " + this._userServer);
    this._connectionService.checkAndConnectServer(this._userServer).then(
      server => {
        if (server.isConnected) {
          this.nav.push(ModelListPage);//HomePage);
        } else {
          this.displayAlert(server.info);
        }
      },
      error => {this.displayAlert('Invalid server address')}
    );
    // TODO : handle login and password
  }

  public displayAlert(text : string) {
    let alert = this.alertController.create({
      title : text,
      buttons: [{
      text: 'OK',
      handler: () => {
        alert.dismiss();
        //let navTransition = alert.dismiss();
        //navTransition.then(() => {this.nav.pop();});
        return false;
      }
      }]
    });
    alert.present();

  }

  public displayInfo(o) {
    //console.log(o)
  }
}
