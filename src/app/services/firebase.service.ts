import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData } from 'angularfire2/firestore';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  coleccionEstacionamientos : AngularFirestoreCollection<any[]>;
  datosUsuario : AngularFirestoreDocument<DocumentData>;
  constructor(private firestore: AngularFirestore) { }


  registrarUsuario(nombre: string, edad : number,  emailUser: string, sexo : number, passUser : string): Promise<any>{
    console.log("[FirebaseService] [registrarUsuario] " + emailUser + " " + passUser);
   /*this.guardarImagenFirebase(imagenPerfil).then(resp => {
      console.log("[FirebaseService] [registrarUsuario] Despues de guardar imagen en firebase");      
      console.log(resp);
    }).catch(error => {
      console.error("[registrarUsuario] Error al guardar imagen en firebase.");
      console.error(error);
    });*/

    return firebase.auth().createUserWithEmailAndPassword(emailUser, passUser)
    .then((newUserCredential: firebase.auth.UserCredential) => {
      firebase
        .firestore()
        .doc(`/usuariosRegistrados/${newUserCredential.user.uid}`)
        .set({ nombre, edad, emailUser, sexo });
        return newUserCredential;
    })
    .catch(error => {
      console.error(error);
      throw new Error(error);
    });
  }

  guardarImagenFirebase(imagenPerfil : any) : Promise<any> {
    console.log("[FirebaseService] [guardarImagenFirebase] Inicio: " + imagenPerfil);

    let idRandom = this.firestore.createId();
    
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      console.log("[FirebaseService] [guardarImagenFirebase] storageRef: ");
      console.log(storageRef);
      
      let imageRef = storageRef.child('image').child(idRandom);
      console.log("[FirebaseService] [guardarImagenFirebase] imageRef: ");
      console.log(imageRef);

      imageRef.putString(imagenPerfil).then(resp => {
        console.log(resp);
      
      }).catch(error => {
        console.error("[FirebaseService] [guardarImagenFirebase] Error al subir imagen a firebase");        
        console.error(error);
      });

    /* this.encodeImageUri(imagenPerfil, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })*/
      console.log("[FirebaseService] [guardarImagenFirebase] Fin: ");
    });

  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  loginUser(email: string, password: string ): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  
  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser():Promise<void> {
    return firebase.auth().signOut();
  }

  guardarPuntoEstacionamiento(latitud : string , longitud : string, direccion : string): Promise<any>{
    console.log("[FirebaseService] [guardarPuntoEstacionamiento] " + latitud + " " + longitud);
    console.log(firebase.auth().currentUser);
    let fecha = formatDate(new Date(),'MM/dd/yyyy', 'en');
    let hora = new Date();
    let fechaEstacionamiento= fecha + "/" + hora.getHours() + ":" + hora.getMinutes();
    let autoEstacionado = true;
    
    if(firebase && firebase.auth().currentUser.uid != null){
      const id = this.firestore.createId();
      console.log(id);
      
      return firebase
        .firestore()
        .doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`).collection("historialEstacionamientos").doc(`estacionamiento${id}`)
        .set({ latitud , longitud, direccion, fechaEstacionamiento, autoEstacionado, id}).then(resp=>{
          console.log(resp);
          window.sessionStorage.setItem("idEstacionamiento", id);
        })
        .catch(error=>{
          throw new Error(error);
        })
    }
  
  }

  obtenerHistorialEstacionamiento():  AngularFirestoreCollection<any[]>{
    if(firebase.auth().currentUser && firebase.auth().currentUser.uid != null){
    this.coleccionEstacionamientos = this.firestore.doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`).collection("historialEstacionamientos")
    this.coleccionEstacionamientos.valueChanges;
        console.log(this.coleccionEstacionamientos.valueChanges);
        return this.coleccionEstacionamientos;
  } else{
  console.log("user null");  
  }
}

estacionarVehiculo(idEstacionamiento : String) : Promise<any>{
  let autoEstacionado = false;
  return firebase
        .firestore()
        .doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`).collection("historialEstacionamientos").doc(`estacionamiento${idEstacionamiento}`)
        .update({ autoEstacionado}).then(resp=>{
          console.log(resp);
        })
        .catch(error=>{
          throw new Error(error);
        })
}


obtenerDatosUsuario():  AngularFirestoreDocument<DocumentData>{
  if(firebase.auth().currentUser && firebase.auth().currentUser.uid != null){
    console.log(firebase.auth().currentUser.uid);    
      this.datosUsuario = this.firestore.doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`);
      console.log("despue de obtener datos del usuario a firebase");      
      console.log(this.datosUsuario);
      return this.datosUsuario;
  }else{
    console.log("user null");  
  }
}

}
