import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';


const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
        'hospital',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/hospital.svg'));
  }
}
