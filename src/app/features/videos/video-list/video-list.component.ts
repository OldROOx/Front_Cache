// src/app/features/videos/video-list/video-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Video } from '../../../core/models/video.model';
import { VideoService } from '../../../core/services/video.service';
import { ConnectionService } from '../../../core/services/connection.service';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  imports: [
    NgClass,
    DatePipe
  ],
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit, OnDestroy {
  videos: Video[] = [];
  isLoading = true;
  error: string | null = null;
  isOnline = true;

  private connectionSubscription!: Subscription;

  constructor(
    private videoService: VideoService,
    private connectionService: ConnectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de conexión
    this.connectionSubscription = this.connectionService.onlineStatus$.subscribe(isOnline => {
      this.isOnline = isOnline;

      // Si recuperamos la conexión, intentar cargar videos nuevamente
      if (isOnline && (!this.videos.length || this.error)) {
        this.loadVideos();
      }
    });

    // Cargar videos iniciales
    this.loadVideos();
  }

  ngOnDestroy(): void {
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }

  loadVideos(): void {
    this.isLoading = true;
    this.error = null;

    this.videoService.getAllVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los videos. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
        console.error('Error loading videos:', err);
      }
    });
  }

  watchVideo(videoId: string): void {
    this.router.navigate(['/videos', videoId]);
  }
}
