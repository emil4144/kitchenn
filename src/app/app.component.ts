import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {MatDialog} from '@angular/material';
import {LoginComponent} from './components/login/login.component';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  closeDialog = false;
  orders = [];


  constructor(
    private socket: Socket,
    private dialog: MatDialog,
    public auth: AuthService
  ) {
    this.socket.emit('getOrders');
    this.socket.on('initorder', (data) => {
      this.orders = data;
      console.log(this.orders);
    });
    this.socket.on('order', (data) => {
      this.orders.unshift(data);
    });
  }

  ngOnInit(): void {
    this.showLoginPopup();
  }

  changeAction(action, id, i) {
    switch (action) {
      case 'pending':
        this.orders[i].action = 'under construction';
        this.socket.emit('change-action', {id: id, action: 'under construction'});
        break;
      case 'under construction':
        this.orders[i].action = 'pick-up';
        this.socket.emit('change-action', {id: id, action: 'pick-up'});
        break;
      case 'pick-up':
        this.orders[i].action = 'picked';
        this.socket.emit('change-action', {id: id, action: 'picked'});
        break;
    }
  }

  getClass(action) {
    switch (action) {
      case 'pending':
        return 'pending';
      case 'under construction':
        return 'under-construction';
      case 'pick-up':
        return 'pick-up';
      case 'picked':
        return 'picked';
    }
  }

  getActive() {
    for (let order of this.orders) {
      if (order.action != 'picked') {
        return true;
      }
    }
    return false;
  }

  close() {
    this.socket.emit('closeEvent', this.orders);
    this.orders = [];
    this.closeDialog = false;
  }

  showLoginPopup() {
    if (!this.auth.loggedIn()) {
      this.dialog.open(LoginComponent, {width: '300', height: '400', panelClass: 'login-dialog-container'});
    }
  }





}
