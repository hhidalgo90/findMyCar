import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  coleccionEstacionamientos : AngularFirestoreCollection<any[]>;
  constructor(private firestore: AngularFirestore) { }


  registrarUsuario(emailUser : string , pass : string): Promise<any>{
    console.log("[FirebaseService] [registrarUsuario] " + emailUser + " " + pass);
    return firebase.auth().createUserWithEmailAndPassword(emailUser, pass)
    .then((newUserCredential: firebase.auth.UserCredential) => {
      firebase
        .firestore()
        .doc(`/usuariosRegistrados/${newUserCredential.user.uid}`)
        .set({ emailUser});
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
    let fechaEstacionamiento = formatDate(new Date(),'MM/dd/yyyy', 'en');
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
}
