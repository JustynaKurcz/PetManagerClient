import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { createUrlTree: jasmine.createSpy('createUrlTree') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if token exists in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should return UrlTree if token does not exist in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(guard.canActivate()).toEqual(routerSpy.createUrlTree(['/sign-in']));
  });
});
