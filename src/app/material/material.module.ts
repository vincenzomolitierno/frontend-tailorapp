import { NgModule } from '@angular/core';

import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatTableModule,
  MatNativeDateModule,
  MatSortModule,
  MatCheckboxModule,
  MatSelectModule,    
  MatPaginatorModule,
  MatTooltipModule,
  MatDialogModule,
  MatDividerModule,
  MatSliderModule,
  MatDatepickerModule,
  MatRadioModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
} from '@angular/material';

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatTableModule,
  MatNativeDateModule,
  MatSortModule,
  MatCheckboxModule,
  MatSelectModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatDialogModule,
  MatDividerModule,
  MatSliderModule,
  MatDatepickerModule,
  MatRadioModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}