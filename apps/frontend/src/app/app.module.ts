import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { appRoutes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { LandingModule } from './pages/landing/landing.module';
import { AppComponent } from './app.component';
import { SidebarModule } from './pages/sidebar/sidebar.module';
import { HeaderModule } from './pages/header/header.module';
import { TableModule } from './projects/table/table.module';
import { DataVisualizationsModule } from './projects/data-visualizations/data-visualizations.module';
import { SpaceVideoModule } from './projects/space-video/space-video.module';
import { FooterModule } from './pages/footer/footer/footer.module';
import { RecordService } from './projects/table/table/record-list/record.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    LandingModule,
    SidebarModule,
    HeaderModule,
    TableModule,
    DataVisualizationsModule,
    SpaceVideoModule,
    FooterModule,
    HttpClientModule
  ],
  exports: [
    SidebarModule,
    HeaderModule,
    MaterialModule,
    FooterModule
  ],
  providers: [
    RecordService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
