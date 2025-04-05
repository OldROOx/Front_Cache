import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { OfflineAwareDirective } from './directives/offline-aware.directive';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    VideoPlayerComponent,
    OfflineAwareDirective
  ],
  exports: [
    VideoPlayerComponent,
    OfflineAwareDirective
  ]
})
export class SharedModule { }
