import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  closeDialog=false
  orders=[]
  constructor(private socket: Socket){
    this.socket.emit("getOrders");
    this.socket.on("initorder",(data)=>{
      this.orders=data
      console.log(this.orders)
    })
    this.socket.on("order",(data)=>{
      this.orders.unshift(data)
    })
  }

  changeAction(action,id,i){
    switch(action){
      case "pending":
        this.orders[i].action="under construction";
        this.socket.emit("change-action",{id:id,action:"under construction"})
        break;
      case "under construction":
          this.orders[i].action="pick-up";
          this.socket.emit("change-action",{id:id,action:"pick-up"})
          break
      case "pick-up":
          this.orders[i].action="picked";
          this.socket.emit("change-action",{id:id,action:"picked"})
        break
    }
  }
  getClass(action){
    switch(action){
      case "pending":
        return "pending"
      case "under construction":
         return "under-construction"
      case "pick-up":
        return "pick-up"
      case "picked":
        return "picked"
    }
  }
  getActive(){
     for(let order of this.orders){
       if(order.action!="picked"){
         return true
       }
     }
    return false
  }

  close(){
    this.socket.emit("closeEvent", this.orders)
    this.orders=[]
    this.closeDialog=false
  }
}
