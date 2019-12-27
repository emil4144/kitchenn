import {Injectable} from '@angular/core';
import {API_URL} from '../constants/app.config';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
  }

  /**
   * Checks to see if user logged in/ token expired
   */
  loggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  /**
   * Sends login credentials
   * @param formData formData object
   */
  login(formData) {
    return this.httpClient.post(`${API_URL}auth/login`, formData);
  }

  /**
   * Logs out the current user
   */
  logout() {
    localStorage.setItem('token', '');
    this.router.navigate(['/']).then(m => m);
  }
}
