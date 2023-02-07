import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturePageContainerComponent } from './feature-page-container.component';
import { BreadcrumbModule } from '../../../../shared/components/breadcrumb/breadcrumb.module';
import { FeaturePageTitleDirective } from './feature-page-title.directive';

@NgModule({
  declarations: [FeaturePageContainerComponent, FeaturePageTitleDirective],
  imports: [CommonModule, BreadcrumbModule],
  exports: [FeaturePageContainerComponent, FeaturePageTitleDirective],
})
export class FeaturePageContainerModule {}
