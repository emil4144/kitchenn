import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {RouterModule, Routes, ExtraOptions} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {MaterialModule} from './modules/material-module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './components/login/login.component';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {ToastrModule} from 'ngx-toastr';
import {RequestInterceptor} from './helpers/http.interceptor';

const config: SocketIoConfig = {url: `${environment.staticUrl}`, options: {}};

// Token getter for JWT module
export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    KeyboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    MaterialModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3000/auth/']
      }
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
  ],
  entryComponents: [
    LoginComponent,
    KeyboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
