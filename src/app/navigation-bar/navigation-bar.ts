import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SyncButtons } from '../sync/sync-buttons/sync-buttons';

@Component({
  imports: [AsyncPipe, RouterLink, RouterLinkActive, SyncButtons],
  selector: 'app-navigation-bar',
  styleUrl: './navigation-bar.css',
  templateUrl: './navigation-bar.html',
})
export class NavigationBar {
  private readonly router: Router = inject(Router);
  private authService: AuthService;

  readonly isAuthenticated: Observable<boolean>;

  constructor() {
    this.authService = inject(AuthService);
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(["/login"]));
  }
}
