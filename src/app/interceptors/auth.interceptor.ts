import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Class Interceptor start:', request.url);

    const token = localStorage.getItem('token');
    console.log('Token status:', !!token);

    if (token && token.length > 0) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Request modified with token');
      return next.handle(cloned);
    }

    console.log('Request without token');
    return next.handle(request);
  }
}
