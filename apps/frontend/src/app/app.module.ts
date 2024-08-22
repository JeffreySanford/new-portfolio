import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { AuthModule } from './common/auth/auth.module';
import { AuthInterceptor } from './common/auth/auth.interceptor';
import { LandingModule } from './landing/landing.module';
import { MaterialModule } from './material.module';
import { RegisterComponent } from './authentication/register/register.component';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from './common/sidebar/sidebar.module';
import { HeaderModule } from './common/header/header.module';
import { LoginComponent } from './authentication/login/login.component';
import { TableModule } from './projects/table/table.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent
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
    TableModule
  ],
  exports: [SidebarModule, HeaderModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
