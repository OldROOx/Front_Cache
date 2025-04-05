// src/app/core/services/connection.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private onlineStatusSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public onlineStatus$ = this.onlineStatusSubject.asObservable();

  constructor() {
    this.initConnectionListener();
  }

  private initConnectionListener(): void {
    // Escuchar los eventos de conexión del navegador
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    // Combinar ambos observables
    merge(online$, offline$).subscribe(status => {
      this.onlineStatusSubject.next(status);
    });
  }


  public isOnline(): boolean {
    return navigator.onLine;
  }
}
