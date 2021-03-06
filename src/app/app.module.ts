// This is only visible in EASY MODE
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// File is dynamically built using webpack loader
import { SkyPagesModule } from './sky-pages.module';

@NgModule({
    declarations: [ AppComponent ],
    imports: [
      BrowserModule,
      RouterModule,
      SkyPagesModule
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
