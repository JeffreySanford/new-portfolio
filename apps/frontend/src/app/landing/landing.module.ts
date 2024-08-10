import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing.component';
import { MaterialModule } from '../material.module';
import { OpenAIService } from '../openai/openai.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from '../common/auth/auth.interceptor';

@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    MaterialModule
  ],
  providers: [
    OpenAIService,
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class LandingModule {}
