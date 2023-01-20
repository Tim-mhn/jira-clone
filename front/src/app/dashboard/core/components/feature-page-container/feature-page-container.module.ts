import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturePageContainerComponent } from './feature-page-container.component';
import { BreadcrumbModule } from '../../../../shared/components/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [FeaturePageContainerComponent],
  imports: [CommonModule, BreadcrumbModule],
  exports: [FeaturePageContainerComponent],
})
export class FeaturePageContainerModule {}
