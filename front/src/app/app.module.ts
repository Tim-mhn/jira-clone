import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedProvidersModule } from './shared/shared.providers.module';
import { AuthProvidersModule } from './auth/auth.providers.module';
import { HTTP_INTERCEPTORS_PROVIDERS } from './shared/http-interceptors';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    AuthProvidersModule,
    SharedProvidersModule,
  ],
  bootstrap: [AppComponent],
  providers: [HTTP_INTERCEPTORS_PROVIDERS],
})
export class AppModule {}
