import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SyncButtons } from '../sync/sync-buttons/sync-buttons';

@Component({
  imports: [RouterLink, RouterLinkActive, SyncButtons],
  selector: 'app-navigation-bar',
  styleUrl: './navigation-bar.css',
  templateUrl: './navigation-bar.html',
})
export class NavigationBar {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  readonly isAuthenticated: Signal<boolean> = this.authService.isAuthenticated;

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(["/login"]));
  }
}
