import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }


  registrarUsuario(emailUser : string , pass : string): Promise<any>{
    console.log("[FirebaseService] [registrarUsuario] " + emailUser + " " + pass);
    return firebase.auth().createUserWithEmailAndPassword(emailUser, pass)
    .then((newUserCredential: firebase.auth.UserCredential) => {
      firebase
        .firestore()
        .doc(`/usuariosRegistrados/${newUserCredential.user.uid}`)
        .set({ emailUser });
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
}
