// src/app/features/videos/video-detail/video-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Video } from '../../../core/models/video.model';
import { VideoService } from '../../../core/services/video.service';
import { ConnectionService } from '../../../core/services/connection.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../../../shared/components/video-player/video-player.component';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css'], // Cambiado a .css
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent]
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  video: Video | null = null;
  videoUrl: string = '';
  isLoading = true;
  error: string | null = null;
  isOnline = true;

  private routeSubscription!: Subscription;
  private connectionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de conexión
    this.connectionSubscription = this.connectionService.onlineStatus$.subscribe(isOnline => {
      this.isOnline = isOnline;
    });

    // Obtener el ID del video de la URL
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const videoId = params.get('id');
      if (videoId) {
        this.loadVideo(videoId);
      } else {
        this.error = 'ID de video no válido';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }

  loadVideo(videoId: string): void {
    this.isLoading = true;
    this.error = null;

    this.videoService.getVideoById(videoId).subscribe({
      next: (video) => {
        this.video = video;
        this.videoUrl = this.videoService.getStreamUrl(video.id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el video. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
        console.error('Error loading video:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/videos']);
  }
}
