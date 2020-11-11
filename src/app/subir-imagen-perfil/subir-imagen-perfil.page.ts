import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import {
  LoadingController,
  AlertController,
  ToastController
} from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-subir-imagen-perfil",
  templateUrl: "./subir-imagen-perfil.page.html",
  styleUrls: ["./subir-imagen-perfil.page.scss"]
})
export class SubirImagenPerfilPage implements OnInit {
  opcionFoto: number;
  imagenPerfil: any;
  activarBtn: boolean = false;
  public loading: HTMLIonLoadingElement;

  constructor(
    public loadingCtrl: LoadingController,
    private router: Router,
    private firebaseService: FirebaseService,
    public alertCtrl: AlertController,
    private camera: Camera,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  async adjuntarImagen(opcionFoto: any) {
    console.log("[adjuntarImagen] Inicio " + opcionFoto);

    if (opcionFoto != undefined) {
      this.loading = await this.loadingCtrl.create({
        duration: 1000,
        message: "Cargando..."
      });
      await this.loading.present();

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        cameraDirection: 1, //abre camara frontal
        sourceType:
          opcionFoto == 1
            ? this.camera.PictureSourceType.CAMERA
            : this.camera.PictureSourceType.PHOTOLIBRARY
      };

      this.camera.getPicture(options).then(
        imageData => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          //let base64Image = 'data:image/jpeg;base64,' + imageData;
          let base64Image = imageData;
          console.log(base64Image);
          this.imagenPerfil = base64Image;
          this.subirImagenFirebase();

          this.loading.dismiss();
        },
        err => {
          console.error("Error al capturar imagen");
          console.error(err);

          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: err.message,
              buttons: [{ text: "Ok", role: "cancel" }]
            });
            await alert.present();
          });
        }
      );
    }
    console.log("[adjuntarImagen] Fin");
  }

  async subirImagenFirebase() {
    this.firebaseService
      .guardarImagenFirebase(this.imagenPerfil)
      .then(async resp => {
        console.log(
          "[subirImagenFirebase] Despues de guardar imagen en firebase"
        );
        console.log(resp);
        this.loading = await this.loadingCtrl.create({
          duration: 1000,
          message: "Cargando..."
        });
        await this.loading.present();

        const toast = await this.toastController.create({
          message: "Imagen guardada con exito.",
          duration: 2000,
          position: "top",
          color: "success"
        });
        toast.present();
        this.loading.dismiss();
        this.activarBtn = true;
      })
      .catch(async error => {
        const toast = await this.toastController.create({
          message: "Error al guardar la imagen.",
          duration: 2000,
          position: "top",
          color: "danger"
        });
        toast.present();

        console.error(
          "[subirImagenFirebase] Error al guardar imagen en firebase."
        );
        console.error(error);
      });
  }

  async irMenuUsuario() {
    console.log("[irMenuUsuario] Inicio");
    this.loading = await this.loadingCtrl.create({
      duration: 1000,
      message: "Iniciando Sesion"
    });
    await this.loading.present();

    this.loading.dismiss().then(() => {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          esUsuarioNuevo: true
        }
      };
      window.sessionStorage.setItem("usuarioLogueado", "true"); //variable de session para guardar si el usuario esta logueado
      console.log(
        "[irMenuUsuario] iniciar sesion: esLogueado: " +
          window.sessionStorage.getItem("usuarioLogueado")
      );

      this.router.navigate(["usuarioLogueado"], navigationExtras);
    });
  }
}
