// src/app/core/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Video } from '../models/video.model';
import {environment} from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly API_URL = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  getAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.API_URL)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getVideoById(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Obtener la URL de streaming para un video
  getStreamUrl(videoId: string): string {
    return `${this.API_URL}/stream/${videoId}`;
  }

  uploadVideo(title: string, description: string, file: File): Observable<Video> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', file);

    return this.http.post<Video>(this.API_URL, formData)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  updateVideo(id: string, data: Partial<Video>): Observable<Video> {
    return this.http.put<Video>(`${this.API_URL}/${id}`, data)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  deleteVideo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
}
