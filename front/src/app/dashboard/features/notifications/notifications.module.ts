import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsProvidersModule } from './notifications-providers.module';
import { NotificationsIndicatorModule } from './components/notifications-indicator/notifications-indicator.module';
import { NotificationsIndicatorComponent } from './components/notifications-indicator/notifications-indicator.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationsProvidersModule,
    NotificationsIndicatorModule,
  ],
  exports: [NotificationsIndicatorComponent],
})
export class NotificationsModule {}
