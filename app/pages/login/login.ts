import {Page, NavController, Alert} from 'ionic-angular';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {HomePage} from '../../pages/home/home';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  private _userServer : string = '';
  private _userLogin : string = '';
  private _userPassword : string = '';

  constructor(public nav: NavController,
              private _connectionService: ConnectionService) {}

  onPageWillEnter() {
    console.log('enter SettingsPage')
    this._connectionService.loadStoredServers();
    this._connectionService.loadLastUsedServer();
  }

  selectServer() {
    console.log("select " + this._userServer);
    this._connectionService.checkAndConnectServer(this._userServer).then(
      server => {
        if (server.isConnected) {
          this.nav.push(HomePage);
        } else {
          this.displayAlert(server.info);
        }
      },
      error => {this.displayAlert(error)}
    );
    // TODO : handle login and password
  }

  private displayAlert(text : string) {
    let alert = Alert.create({
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
    this.nav.present(alert);

  }

  private displayInfo(o) {
    console.log(o)
  }
}
