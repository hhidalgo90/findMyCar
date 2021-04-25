import { Injectable } from '@angular/core';

declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
public stompClient;
public msg = [];

constructor() {
  this.initializeWebSocketConnection();
}

initializeWebSocketConnection() : Promise<any> {
  const serverUrl = 'http://localhost:8080/socket';
  const ws = new SockJS(serverUrl);
  this.stompClient = Stomp.over(ws);
  const that = this;

  return new Promise( (resolve, reject) => { 
    // tslint:disable-next-line:only-arrow-functions
  this.stompClient.connect({}, function(frame) {
    console.log("connect webSocket");
    console.log(frame);

    that.stompClient.subscribe('/message', (message) => {
      console.log(message);
      
      if (message.body) {
        that.msg.push(message.body);
      }
      
    });

    if(frame){
      resolve(frame);
    }else{
        reject(console.error("[WebSocketService] [initializeWebSocketConnection] Error al conectar con webSocket"));
    }
  });
  
  
  });
}

sendMessage(message) {
  console.log("[sendMessage] " + message);
  
  this.stompClient.send('/app/send/message' , {}, message);
}
}
