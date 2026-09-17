import { HttpClient } from "@angular/common/http";
import { inject, Service, Signal, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

@Service()
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = "/api/v1/auth";

  private readonly _isAuthenticated = signal<boolean>(false);

  readonly isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();

  register(username: string, password: string): Observable<void> {
    return this.makePostRequest("register", username, password).pipe(
      tap(() => this._isAuthenticated.set(true))
    );
  }

  login(username: string, password: string): Observable<void> {
    return this.makePostRequest("login", username, password).pipe(
      tap(() => this._isAuthenticated.set(true))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this._isAuthenticated.set(false))
    );
  }

  private makePostRequest(endpoint: string, username: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${endpoint}`, { username, password });
  }
}
