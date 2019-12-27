import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import {Observable} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

// import {CommonService} from '../services/common.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(public router: Router,
              public toastr: ToastrService,
              // private common: CommonService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap((res: HttpResponse<any>) => {

    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        // this.common.formProcessing = false;
        // this.common.dataLoading = false;
        const message = err.error.message;
        this.toastr.error(err.error);


      }
    }));
  }
}
