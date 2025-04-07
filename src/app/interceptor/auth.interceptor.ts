import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!localStorage) {
      return next.handle(req);
    }

    const idToken = localStorage.getItem(this.authService.getLocalIdKey());

    // JWT Bearer Token Present
    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + idToken)
      });

      console.log("Auth Service:  Id Token Found");
      return next.handle(cloned);
    }

    // JWT Bearer Token Not Present -> Pass Through
    else {

      console.log("Auth Service:  Id Token Missing");
      return next.handle(req);
    }
  }
}
