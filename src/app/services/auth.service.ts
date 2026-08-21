import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = "/api/v1/auth";

  constructor(private http: HttpClient) { }

  register(username: string, password: string) {
    return this.makePostRequest("register", username, password);
  }

  login(username: string, password: string) {
    return this.makePostRequest("login", username, password);
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/me`).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  private makePostRequest(endpoint: string, username: string, password: string) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, { username, password });
  }
}
