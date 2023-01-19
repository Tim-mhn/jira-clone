import { NgModule } from '@angular/core';
import { TimHttpModule } from '@tim-mhn/common/http';
import { AuthProvidersModule } from '../auth/auth.providers.module';

@NgModule({
  imports: [TimHttpModule, AuthProvidersModule],
})
export class ProjectInvitationsProvidersModule {}
