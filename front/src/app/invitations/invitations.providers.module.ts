import { NgModule } from '@angular/core';
import { TimHttpModule } from '@tim-mhn/common/http';
import { AuthProvidersModule } from '../auth/auth.providers.module';

@NgModule({
  imports: [TimHttpModule, AuthProvidersModule],
  declarations: [],
})
export class ProjectInvitationsProvidersModule {}
