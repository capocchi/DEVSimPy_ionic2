import { Page, NavController, NavParams, Alert } from 'ionic-angular';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
import { Block, BlockParam } from '../../data-types/data-types';
import { Geolocation } from 'ionic-native';
import { Camera } from 'ionic-native';

@Page({
  templateUrl: 'build/pages/model-detail-param/model-detail-param.html',
})
export class ModelDetailParamPage {

  private _blockLabel: String;
  private _blockLocalCopy: Block;
  private _modelSubscription;


  constructor(public nav: NavController,
              public navParams: NavParams,
              private _modelService : ModelService,
              private _simulationService: SimulationService) {
    this._blockLabel = navParams.get('blockLabel');
    this._blockLocalCopy = null;
  }

  onPageWillEnter(){
    this._modelSubscription = this._modelService.selectedModel$.subscribe(
      data  => {
        this._blockLocalCopy = data.atomicBlocks.find(item => { return item.label === this._blockLabel });
      },
      error => {console.log(error);}
    )
  }

  ngOnDestroy() {
    this._modelSubscription.unsubscribe();
  }

  saveParam(){
    this.uploadNewPictures().then (
      response => {
        if (response === 'OK') {
          this._modelService.saveModelParameters(this._blockLocalCopy).then(
            text => {this.displayAlert(text)}
          );
        }
      }
    )
    .catch(text => {this.displayAlert(text)});
  }

  modifyParam(){
    this.uploadNewPictures().then (
      response => {
        if (response === 'OK') {
          this._simulationService.modifyModelParameters(this._blockLocalCopy).then(
            text => {this.displayAlert(text)}
          );
        }
      }
    )
    .catch(text => {this.displayAlert(text)});
  }

  /* Menu to select between possible phone inputs */
  /*public showPhoneInputs(param : BlockParam){
    let alert = Alert.create();

    alert.setTitle('Select phone input');
    alert.addInput({type: 'checkbox', label: 'Geolocation', value: 'Geolocation'});
    alert.addInput({type: 'checkbox', label: 'Camera', value: 'Camera'});

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Next',
      handler: data => {
        switch (data[0]){
          case 'Geolocation': {this.showLocation(param); break;}
          case 'Camera'     : {this.takePicture(param); break;}
          default: break;
        }
      }
    });

    this.nav.present(alert);
  }*/

  public showLocation(param : BlockParam){

    Geolocation.getCurrentPosition({maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}).then(
      position => {
        let alert = Alert.create();
        alert.setTitle('Select geolocation input');
        alert.addInput({type: 'checkbox', label: `latitude : ${position.coords.latitude}`, value: 'latitude'});
        alert.addInput({type: 'checkbox', label: `longitude : ${position.coords.longitude}`, value: 'longitude'});
        alert.addInput({type: 'checkbox', label: `altitude : ${position.coords.altitude}`, value: 'altitude'});
        alert.addInput({type: 'checkbox', label: `heading : ${position.coords.heading}`, value: 'heading'});

        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            //console.log('Checkbox data:', data);
            switch (data[0]){
              case 'latitude': {param.value = position.coords.latitude; break;}
              case 'longitude': {param.value = position.coords.longitude; break;}
              case 'altitude': {param.value = position.coords.altitude; break;}
              case 'heading': {param.value = position.coords.heading; break;}
              default: return 0.0;
            }
          }
        });

        this.nav.present(alert);

      },
      error => {this.displayAlert(error.message)}
    );
  }

  public takePicture(param : BlockParam){
    // See options definition here :
    // https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
    let options = {
            destinationType: 1,// 0:base-64 encoded string/1:FileURI/2:NativeURI
            sourceType: 1,// 0:PhotoLibrary/1:Camera/2:SavedPhotoAlbum
            encodingType: 0,// 0:JPEG/1:PNG
            quality:100,
            allowEdit: false,
            saveToPhotoAlbum: true
        };
    Camera.getPicture(options).then(
      img => {
        param.value = img; // for immediate display of the image
        param.imageUploadRequired = true;
      },
      error => {this.displayAlert(error.message)}
    );

  }

  private uploadNewPictures(): Promise<string> {
    let nbPictureUploadRequest  = 0;
    let nbPictureUploadResponse = 0;
    let pictureUploadSuccess    = true;

    return new Promise(
      (resolve, reject) => {
        this._blockLocalCopy.params.forEach(
        param => {
          if (param.type === 'image' && param.imageUploadRequired) {
            //console.log('UPLOAD image for ' + param.name)
            nbPictureUploadRequest++;
            this._modelService.uploadPicture(param.value, this._blockLocalCopy.label)
            .then (response => {
              //console.log('UPLOAD done for ' + param.name);
              param.type = 'image';
              param.value = response;
              param.imageUploadRequired = false;
              nbPictureUploadResponse++;
              if (nbPictureUploadResponse === nbPictureUploadRequest && pictureUploadSuccess) {
                //console.log('RESOLVE');
                resolve('OK');
              }

            })
            .catch (error => {
              console.log(error);
              pictureUploadSuccess = false;
              nbPictureUploadResponse++;
              reject(`Image upload for ${param.name} failed.`);
            });
          }
        });
        if (nbPictureUploadRequest === 0) {
          resolve('OK');
        }
      }
    );
  }

  private displayAlert(text : string) {
    let alert = Alert.create({
      title : text,
      buttons: [{
      text: 'OK',
      handler: () => {
        //alert.dismiss();
        let navTransition = alert.dismiss();
        navTransition.then(() => {this.nav.pop();});
        return false;
      }
      }]
    });
    this.nav.present(alert);

  }
}
