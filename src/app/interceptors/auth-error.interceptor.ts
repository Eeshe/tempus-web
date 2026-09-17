import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AUTH_BASE_URL, AuthService } from "../services/auth.service";

/**
 * Clears the local authentication state and redirects to the login page when
 * the backend rejects a request because the session is no longer valid.
 * Requests to the auth endpoints themselves are excluded, so a failed login
 * attempt or the initial session check does not trigger a redirect.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = req.url.startsWith(AUTH_BASE_URL);

      if (error.status === 401 && !isAuthRequest && router.url !== "/login") {
        authService.markUnauthenticated();
        router.navigate(["/login"]);
      }
      return throwError(() => error);
    })
  );
};
