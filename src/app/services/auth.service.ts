import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, tap } from "rxjs";

@Service()
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly baseUrl = "/api/v1/auth";

  constructor() {
    this.http.get(`${this.baseUrl}/me`).pipe(
      map(() => true),
      catchError(() => of(false)),
    ).subscribe(isAuthenticated => this.authState.next(isAuthenticated));
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  register(username: string, password: string) {
    return this.makePostRequest("register", username, password);
  }

  login(username: string, password: string) {
    return this.makePostRequest("login", username, password).pipe(
      tap(() => this.authState.next(true))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.authState.next(false))
    );
  }

  private makePostRequest(endpoint: string, username: string, password: string) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, { username, password });
  }
}
