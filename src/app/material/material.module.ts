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
  MatButtonToggleModule
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
  MatButtonToggleModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}