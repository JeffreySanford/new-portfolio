import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './common/auth/auth.module';
import { AuthInterceptor } from './common/auth/auth.interceptor';
import { LandingModule } from './landing/landing.module';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from './authentication/login/login.component';
import { AppComponent } from './app.component';
import { SidebarModule } from './common/sidebar/sidebar.module';
import { HeaderModule } from './common/header/header.module';
import { TableModule } from './projects/table/table.module';
import { DataVisualizationsModule } from './projects/data-visualizations/data-visualizations.module';
import { SpaceVideoModule } from './projects/space-video/space-video.module';
import { PeasantKitchenComponent } from './projects/peasant-kitchen/peasant-kitchen.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    PeasantKitchenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    AuthModule,
    LandingModule,
    SidebarModule,
    HeaderModule,
    TableModule,
    DataVisualizationsModule,
    SpaceVideoModule
  ],
  exports: [SidebarModule, HeaderModule, MaterialModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
