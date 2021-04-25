import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData } from 'angularfire2/firestore';
import { formatDate } from '@angular/common';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  coleccionEstacionamientos : AngularFirestoreCollection<any[]>;
  datosUsuario : AngularFirestoreDocument<DocumentData>;
  urlImagen : any;
  constructor(private firestore: AngularFirestore, private http: HTTP) { }


  registrarUsuario(nombre: string, edad : number,  emailUser: string, sexo : number, passUser : string): Promise<any>{
    console.log("[FirebaseService] [registrarUsuario] " + emailUser + " " + passUser);
    let idImagen = "";

    return firebase.auth().createUserWithEmailAndPassword(emailUser, passUser)
    .then((newUserCredential: firebase.auth.UserCredential) => {
      firebase
        .firestore()
        .doc(`/usuariosRegistrados/${newUserCredential.user.uid}`)
        .set({ nombre, edad, emailUser, sexo, idImagen });
        return newUserCredential;
    })
    .catch(error => {
      console.error(error);
      throw new Error(error);
    });
  }

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
    let fechaEstacionamiento = formatDate(new Date(),'dd/MM/yyyy hh:mm:ss a', 'en');
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
    window.sessionStorage.setItem("idUser" , firebase.auth().currentUser.uid);
      this.datosUsuario = this.firestore.doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`);
      console.log("despue de obtener datos del usuario a firebase");      
      console.log(this.datosUsuario);
      return this.datosUsuario;
  }else{
    console.log("user null");  
  }
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
      this.actualizarUsuario(idRandom).then(resp => {
        console.log("[irMenuUsuario] Despues de actualizar usuario");
      }).catch(error =>{
        console.error(error);      
      });
      resolve(resp);
    
    }).catch(error => {
      console.error("[FirebaseService] [guardarImagenFirebase] Error al subir imagen a firebase");        
      reject(console.error(error));
    });
    console.log("[FirebaseService] [guardarImagenFirebase] Fin: ");
  });

}
  actualizarUsuario(idImagen: String): Promise<any> {
    console.log("[actualizarUsuario] idImagen" + idImagen);
    console.log(firebase.auth().currentUser.uid);
    
    return new Promise<any>((resolve, reject) => {
      
      return firebase.firestore().collection("usuariosRegistrados").doc(`${firebase.auth().currentUser.uid}`).update(
        {idImagen}
        ).then(resp => {
      console.log("[actualizarUsuario] Despues de actualizar imagen user: ");
      console.log(resp);
      resolve(resp);
      
      
    }).catch(error =>{
      console.error("[actualizarUsuario] Error actualizar usuario: " + error);
      reject(error);
      
    });
  });
    

  }


obtenerImagenFirebase(idImagen : any) : Promise<any> {
  console.log("[FirebaseService] [obtenerImagenFirebase] Inicio: " + idImagen);
  let url= "";
  return new Promise( (resolve, reject) => {
    
    firebase.storage().ref("image/"+idImagen).getDownloadURL().then(resp => {
      console.log(resp);
      url = resp;
      console.log(url);
      

      this.http.get(url, {}, {})
        .then(data => {
          this.urlImagen = data.data;

            if (data) {
              console.log(data.status);
              data.url = url;
              resolve(data);
            } else {
              reject(console.error("[FirebaseService] [obtenerImagenFirebase] Error al obtener imagen"));
            }

        });      
     });
});
}


}
