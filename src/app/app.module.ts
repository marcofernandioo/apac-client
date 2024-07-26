import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { TimelineTableComponent } from './components/timeline-table/timeline-table.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTabsModule } from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NativeDateAdapter, DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CreateGroupComponent } from './components/create-group/create-group.component';
import { CreateIntakeComponent } from './components/create-intake/create-intake.component';
import { CreateSemesterComponent } from './components/create-semester/create-semester.component';
import { EditSemesterComponent } from './components/edit-semester/edit-semester.component';
import { InfoComponent } from './pages/info/info.component';
import { IntakeTableComponent } from './components/intake-table/intake-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TimelineTableComponent,
    TimelineComponent,
    CreateGroupComponent,
    CreateIntakeComponent,
    CreateSemesterComponent,
    EditSemesterComponent,
    InfoComponent,
    IntakeTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatSlideToggleModule
  ],
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule { }
