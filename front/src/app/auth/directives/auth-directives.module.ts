import { NgModule } from '@angular/core';
import { AuthPageTitleDirective } from './auth-page-title.directive';

@NgModule({
  declarations: [AuthPageTitleDirective],
  exports: [AuthPageTitleDirective],
})
export class AuthDirectivesModule {}
