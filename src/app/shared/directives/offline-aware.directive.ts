// src/app/shared/directives/offline-aware.directive.ts
import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectionService } from '../../core/services/connection.service';

@Directive({
  selector: '[appOfflineAware]'
})
export class OfflineAwareDirective implements OnInit, OnDestroy {
  @Input() offlineClass = 'offline';
  @Input() onlineClass = 'online';

  private subscription: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {
    // Aplicar clase inicial basada en el estado actual
    this.updateClassBasedOnConnection(this.connectionService.isOnline());

    // Suscribirse a cambios de estado de conexión
    this.subscription = this.connectionService.onlineStatus$.subscribe(isOnline => {
      this.updateClassBasedOnConnection(isOnline);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateClassBasedOnConnection(isOnline: boolean): void {
    if (isOnline) {
      this.renderer.removeClass(this.el.nativeElement, this.offlineClass);
      this.renderer.addClass(this.el.nativeElement, this.onlineClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.onlineClass);
      this.renderer.addClass(this.el.nativeElement, this.offlineClass);
    }
  }
}
