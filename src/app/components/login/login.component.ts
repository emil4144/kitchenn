import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import {patternValidator} from '../../helpers/pattern-validator';
import {EMAIL_PATTERN} from '../../constants/app.config';
import {AuthService} from '../../services/auth.service';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss'
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  subscriptions: Subscription[] = [];

  loginValue = '';
  passValue = '';
  keyboard: Keyboard;


  selectedInput;

  constructor(
    private  fb: FormBuilder,
    public auth: AuthService,
    public router: Router,
  ) {
    this.loginForm = fb.group({
      email: new FormControl(null, {
        validators: [Validators.required, patternValidator(EMAIL_PATTERN)]
      }),
      password: ['', Validators.required],
    });

  }

  ngOnInit() {
  }

  login() {
    // if (this.loginForm.valid) {

    this.subscriptions.push(this.auth.login(this.loginForm.value).subscribe((dt: any) => {

      // Saving token to browser local storage
      localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));

      // Gets current user data
      // this.auth.userData = jwtDecode(localStorage.getItem('token'));

      // Getting redirect url part matching current user role
      // const currentRole = this.auth.userData.role.name.toLowerCase();
      // const userType = USER_TYPES.find(d => d.role === currentRole);

      // Navigate to the dashboard page
      this.router.navigate([`admin/dashboard/show`]); // ${userType ? userType.label : 'admin'}

    }));
    // }

  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
  }


  onChange = (input: string) => {
    this.loginValue = input;
    console.log('Input changed', this.selectedInput, input);
  };

  onPassChange(input: string) {
    this.passValue = input;
  }

  onKeyPress = (button: string) => {
    console.log('Button pressed', button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') {
      this.handleShift();
    }
  };

  onInputChange = (event: any) => {
    console.log(event.target.value, event.target.id);
    this.keyboard.setInput(event.target.value, event.target.id);
  };

  onInputFocus(event: any) {
    this.selectedInput = event.target.id;
    console.log(this.selectedInput);
    this.keyboard.setOptions({
      inputName: event.target.id
    });
  }

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get pass(): AbstractControl {
    return this.loginForm.get('password');
  }
}
