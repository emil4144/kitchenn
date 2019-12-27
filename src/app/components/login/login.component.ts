import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import {patternValidator} from '../../helpers/pattern-validator';
import {EMAIL_PATTERN} from '../../constants/app.config';
import {AuthService} from '../../services/auth.service';
import Keyboard from 'simple-keyboard';
import {MatDialogRef} from '@angular/material';

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
    private dialogRef: MatDialogRef<LoginComponent>
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
    if (this.loginForm.valid) {

      this.subscriptions.push(this.auth.login(this.loginForm.value).subscribe((dt: any) => {

        // Saving token to browser local storage
        localStorage.setItem('token', dt);

        this.dialogRef.close();
        this.router.navigate(['/kitchen_kiosk']);
      }));
    }

  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
  }


  onChange = (input: string) => {
    this.loginValue = input;

    if (this.keyboard) {
      this.loginForm.controls[this.selectedInput].patchValue(input);
    }
  };

  onKeyPress = (button: string) => {
    // console.log('Button pressed', button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') {
      this.handleShift();
    }
  };

  onInputFocus(event: any) {
    this.selectedInput = event.target.id;
    // console.log('FOCUSED' + this.selectedInput);


    this.keyboard.setOptions({
      inputName: event.target.id
    });
  }

  handleShift = () => {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

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
