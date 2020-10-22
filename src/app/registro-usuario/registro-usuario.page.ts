import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";


@Component({
  selector: "app-registro-usuario",
  templateUrl: "./registro-usuario.page.html",
  styleUrls: ["./registro-usuario.page.scss"]
})
export class RegistroUsuarioPage implements OnInit {
  nombre: any;
  edad: any;
  email: any;
  sexo: any;
  passUser: any;
  formUser: FormGroup;

  sexos: any[] = [
    {
      id: 1,
      texto: "Hombre"
    },
    {
      id: 2,
      texto: "Mujer"
    },
    {
      id: 3,
      texto: "Otro"
    }
  ];
  public loading: HTMLIonLoadingElement;

  constructor(
    public loadingCtrl: LoadingController,
    private router: Router,
    private firebaseService: FirebaseService,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.formUser = new FormGroup({
      nombreUser: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z ]*"),
        Validators.minLength(4),
        Validators.maxLength(10)
      ]),
      edadUser: new FormControl("", [Validators.required]),
      emailUser: new FormControl("", [
        Validators.required,
        Validators.pattern(EMAILPATTERN)
      ]),
      sexoUser: new FormControl("", [Validators.required]),
      passUser: new FormControl("", [Validators.required])
    });
  }

  async registrarUsuario(): Promise<void> {
    console.log("registrarUsuario");
    this.loading = await this.loadingCtrl.create({
      duration: 1000,
      message: "Registrando usuario.."
    });
    await this.loading.present();

    this.firebaseService
      .registrarUsuario(
        this.nombre,
        this.edad,
        this.email,
        this.sexo,
        this.passUser
      )
      .then(
        resp => {
          console.log(resp);
          console.log(resp.additionalUserInfo.isNewUser);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              esUsuarioNuevo: resp.additionalUserInfo.isNewUser
            }
          };

          this.loading.dismiss().then(() => {
            window.sessionStorage.setItem("usuarioLogueado", "true"); //variable de session para guardar si el usuario esta logueado
            window.sessionStorage.setItem("nombreUsuarioLogueado", this.nombre);
            window.sessionStorage.setItem("sexoUsuarioLogueado", this.sexo);
            console.log(
              "Registrar usuario: esLogueado: " +
                window.sessionStorage.getItem("usuarioLogueado")
            );

            this.router.navigate(["subirImagenPerfil"], navigationExtras);
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: "Ok", role: "cancel" }]
            });
            await alert.present();
          });
        }
      );
  }

}
