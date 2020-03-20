import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {formatDate} from '@angular/common';


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
    let fechaEstacionamiento = formatDate(new Date(),'dd/MM/yyyy', 'en');
    
    if(firebase && firebase.auth().currentUser.uid != null){
      return firebase
        .firestore()
        .doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`).collection("historialEstacionamientos").doc()
        .set({ latitud , longitud, direccion, fechaEstacionamiento}).then(resp=>{
          console.log(resp);
          this.obtenerHistorialEstacionamiento();
        })
        .catch(error=>{
          throw new Error(error);
        });
    }
  
  }

  obtenerHistorialEstacionamiento():  AngularFirestoreCollection<any[]>{
    this.coleccionEstacionamientos = this.firestore.doc(`/usuariosRegistrados/${firebase.auth().currentUser.uid}`).collection("historialEstacionamientos")
    this.coleccionEstacionamientos.valueChanges;
        console.log(this.coleccionEstacionamientos.valueChanges);
        return this.coleccionEstacionamientos;
  }
}
