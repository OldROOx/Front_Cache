// src/app/shared/components/video-player/video-player.component.ts
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectionService } from '../../../core/services/connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'], // Cambiado a .css
  standalone: true,
  imports: [CommonModule]
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoUrl: string = '';
  @Input() autoplay: boolean = false;
  @Input() controls: boolean = true;
  @Input() title: string = '';

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

  isPlaying: boolean = false;
  isOffline: boolean = false;
  isMuted: boolean = false;
  volume: number = 1;
  currentTime: number = 0;
  duration: number = 0;
  cacheAvailable: boolean = false;

  private connectionSubscription!: Subscription;
  private videoElement!: HTMLVideoElement;

  constructor(private connectionService: ConnectionService) {}

  ngOnInit(): void {
    // Suscribirse al estado de conexión
    this.connectionSubscription = this.connectionService.onlineStatus$.subscribe(isOnline => {
      this.isOffline = !isOnline;
      // Si estamos sin conexión y el video está reproduciendo, mostramos una notificación
      if (this.isOffline && this.isPlaying) {
        console.log('You are now offline. Video will continue from cache.');
      }
    });
  }

  ngAfterViewInit(): void {
    this.videoElement = this.videoPlayerRef.nativeElement;

    // Configurar eventos del reproductor de video
    this.videoElement.addEventListener('play', () => this.isPlaying = true);
    this.videoElement.addEventListener('pause', () => this.isPlaying = false);
    this.videoElement.addEventListener('timeupdate', () => this.updateProgress());
    this.videoElement.addEventListener('loadedmetadata', () => {
      this.duration = this.videoElement.duration;
    });

    // Eventos específicos para detectar buffer/cache
    this.videoElement.addEventListener('progress', () => {
      this.checkBufferAvailability();
    });

    // Si autoplay está habilitado
    if (this.autoplay) {
      this.playVideo();
    }
  }

  ngOnDestroy(): void {
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }

    // Limpiar eventos del video
    if (this.videoElement) {
      this.videoElement.removeEventListener('play', () => {});
      this.videoElement.removeEventListener('pause', () => {});
      this.videoElement.removeEventListener('timeupdate', () => {});
      this.videoElement.removeEventListener('loadedmetadata', () => {});
      this.videoElement.removeEventListener('progress', () => {});
    }
  }

  playVideo(): void {
    this.videoElement.play().catch(err => {
      console.error('Error al reproducir el video:', err);
    });
  }

  pauseVideo(): void {
    this.videoElement.pause();
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  toggleMute(): void {
    this.videoElement.muted = !this.videoElement.muted;
    this.isMuted = this.videoElement.muted;
  }

  changeVolume(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.volume = Number(value);
    this.videoElement.volume = this.volume;
    this.isMuted = (this.volume === 0);
  }

  seekVideo(event: Event): void {
    const seekPosition = (event.target as HTMLInputElement).value;
    this.videoElement.currentTime = Number(seekPosition);
  }

  updateProgress(): void {
    this.currentTime = this.videoElement.currentTime;
    // Verificar si hay suficiente cache para seguir reproduciendo sin conexión
    this.checkBufferAvailability();
  }

  checkBufferAvailability(): void {
    const buffered = this.videoElement.buffered;
    this.cacheAvailable = false;

    // Verificar si hay rangos de buffer
    if (buffered.length > 0) {
      // Verificar el rango de buffer actual
      for (let i = 0; i < buffered.length; i++) {
        // Si el tiempo actual está dentro de un rango de buffer
        if (this.currentTime >= buffered.start(i) && this.currentTime < buffered.end(i)) {
          // Tenemos cache disponible para reproducir
          this.cacheAvailable = true;
          break;
        }
      }
    }
  }

  // Formatear el tiempo para mostrarlo en formato mm:ss
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
