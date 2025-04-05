// src/app/app.component.ts
import { Component } from '@angular/core';
import { ConnectionService } from './core/services/connection.service';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Cambiado a .css
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AppComponent {
  isOnline$: Observable<boolean>;

  constructor(
    private connectionService: ConnectionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isOnline$ = this.connectionService.onlineStatus$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
