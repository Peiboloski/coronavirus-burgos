import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import BackendService, { WidgetData } from './backend/backendService';

interface GraphLink {
  title: string,
  location: string,
  hospital?: string,
  url: string,
}
const LOCATION = 'Burgos';
const LOCATION_PROVINCIA = 'Burgos (Provincia)'
const HOSPITAL = 'Hospital Universitario';

const GRAPHS: GraphLink[] = [
  {
    title: 'Nuevos Hospitalizados',
    location: LOCATION,
    hospital: HOSPITAL,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoiY29sdW1uIiwiZnVuYyI6IkFWRyIsInlBeGlzIjoibnVldm9zX2hvc3BpdGFsaXphZG9zX3VjaSIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiM2NmMyYTUiLCJkaXNwbGF5VmFsdWVzIjpmYWxzZSwieUxhYmVsT3ZlcnJpZGUiOiJOdWV2b3MgSG9zcGl0YWxpemFkb3MgVUNJIn0seyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoiY29sdW1uIiwiZnVuYyI6IkFWRyIsInlBeGlzIjoibnVldm9zX2hvc3BpdGFsaXphZG9zX3BsYW50YSIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiNmYzhkNjIiLCJ5TGFiZWxPdmVycmlkZSI6Ik51ZXZsb3MgSG9zcGl0YWxpemFkb3MgUGxhbnRhIn1dLCJjb25maWciOnsiZGF0YXNldCI6InNpdHVhY2lvbi1kZS1ob3NwaXRhbGl6YWRvcy1wb3ItY29yb25hdmlydXMtZW4tY2FzdGlsbGEteS1sZW9uIiwib3B0aW9ucyI6eyJyZWZpbmUuaG9zcGl0YWwiOiJDb21wbGVqbyBBc2lzdGVuY2lhbCBVbml2ZXJzaXRhcmlvIGRlIEJ1cmdvcyJ9fSwieEF4aXMiOiJmZWNoYSIsIm1heHBvaW50cyI6IiIsInRpbWVzY2FsZSI6ImRheSIsInNvcnQiOiIiLCJzZXJpZXNCcmVha2Rvd24iOiIiLCJzZXJpZXNCcmVha2Rvd25UaW1lc2NhbGUiOiIifV0sImFsaWduTW9udGgiOnRydWUsImRpc3BsYXlMZWdlbmQiOnRydWV9'
  },
  {
    title: 'Total Hospitalizados',
    location: LOCATION,
    hospital: HOSPITAL,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoibGluZSIsImZ1bmMiOiJBVkciLCJ5QXhpcyI6Imhvc3BpdGFsaXphZG9zX3BsYW50YSIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiM2NmMyYTUiLCJkaXNwbGF5VmFsdWVzIjpmYWxzZSwieUxhYmVsT3ZlcnJpZGUiOiJIb3NwaXRhbGl6YWRvcyBwbGFudGEgSFVCVSJ9LHsiYWxpZ25Nb250aCI6dHJ1ZSwidHlwZSI6ImxpbmUiLCJmdW5jIjoiQVZHIiwieUF4aXMiOiJob3NwaXRhbGl6YWRvc191Y2kiLCJzY2llbnRpZmljRGlzcGxheSI6dHJ1ZSwiY29sb3IiOiIjZmM4ZDYyIiwieUxhYmVsT3ZlcnJpZGUiOiJIb3NwaXRhbGl6YWRvcyBVQ0kgSFVCVSJ9XSwiY29uZmlnIjp7ImRhdGFzZXQiOiJzaXR1YWNpb24tZGUtaG9zcGl0YWxpemFkb3MtcG9yLWNvcm9uYXZpcnVzLWVuLWNhc3RpbGxhLXktbGVvbiIsIm9wdGlvbnMiOnsicmVmaW5lLmhvc3BpdGFsIjoiQ29tcGxlam8gQXNpc3RlbmNpYWwgVW5pdmVyc2l0YXJpbyBkZSBCdXJnb3MifX0sInhBeGlzIjoiZmVjaGEiLCJtYXhwb2ludHMiOiIiLCJ0aW1lc2NhbGUiOiJkYXkiLCJzb3J0IjoiIn1dLCJhbGlnbk1vbnRoIjp0cnVlLCJkaXNwbGF5TGVnZW5kIjp0cnVlfQ%3D%3D'
  },
  {
    title: 'Ocupación UCI',
    location: LOCATION,
    hospital: HOSPITAL,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoibGluZSIsImZ1bmMiOiJBVkciLCJ5QXhpcyI6ImNhbWFzX2hhYmlsaXRhZGFzX3VjaSIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiM2NmMyYTUiLCJ5TGFiZWxPdmVycmlkZSI6IkNhbWFzIERpc3BvbmlibGVzIFVDSSIsInlTdGVwIjoiIiwieVJhbmdlTWluIjoiMCIsInlSYW5nZU1heCI6IjEyMCJ9LHsiYWxpZ25Nb250aCI6dHJ1ZSwidHlwZSI6ImxpbmUiLCJmdW5jIjoiQVZHIiwieUF4aXMiOiJjYW1hc19vY3VwYWRhc191Y2kiLCJzY2llbnRpZmljRGlzcGxheSI6dHJ1ZSwiY29sb3IiOiIjZmM4ZDYyIiwieUxhYmVsT3ZlcnJpZGUiOiJDYW1hcyBPY3VwYWRhcyBVQ0kiLCJ5U3RlcCI6IiIsInlSYW5nZU1pbiI6IjAiLCJ5UmFuZ2VNYXgiOiIxMjAifV0sImNvbmZpZyI6eyJkYXRhc2V0Ijoib2N1cGFjaW9uLWRlLWNhbWFzLWVuLWhvc3BpdGFsZXMiLCJvcHRpb25zIjp7InJlZmluZS5wcm92aW5jaWEiOiJCdXJnb3MiLCJyZWZpbmUuaG9zcGl0YWwiOiJDb21wbGVqbyBBc2lzdGVuY2lhbCBVbml2ZXJzaXRhcmlvIGRlIEJ1cmdvcyJ9fSwieEF4aXMiOiJmZWNoYSIsIm1heHBvaW50cyI6IiIsInRpbWVzY2FsZSI6ImRheSIsInNvcnQiOiIifV0sImFsaWduTW9udGgiOnRydWUsImRpc3BsYXlMZWdlbmQiOnRydWV9'
  },
  {
    title: 'Ocupación Planta',
    location: LOCATION,
    hospital: HOSPITAL,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoibGluZSIsImZ1bmMiOiJBVkciLCJ5QXhpcyI6ImNhbWFzX2hhYmlsaXRhZGFzX3BsYW50YSIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiM2NmMyYTUiLCJ5TGFiZWxPdmVycmlkZSI6IkNhbWFzIERpc3BvbmlibGVzIFBsYW50YSIsInlTdGVwIjoiIiwieVJhbmdlTWluIjoiMCIsInlSYW5nZU1heCI6IjEwMDAifSx7ImFsaWduTW9udGgiOnRydWUsInR5cGUiOiJsaW5lIiwiZnVuYyI6IkFWRyIsInlBeGlzIjoiY2FtYXNfb2N1cGFkYXNfcGxhbnRhIiwic2NpZW50aWZpY0Rpc3BsYXkiOnRydWUsImNvbG9yIjoiI2ZjOGQ2MiIsInlMYWJlbE92ZXJyaWRlIjoiQ2FtYXMgT2N1cGFkYXMgUGxhbnRhIiwieVN0ZXAiOiIiLCJ5UmFuZ2VNaW4iOiIwIiwieVJhbmdlTWF4IjoiMTAwMCJ9XSwiY29uZmlnIjp7ImRhdGFzZXQiOiJvY3VwYWNpb24tZGUtY2FtYXMtZW4taG9zcGl0YWxlcyIsIm9wdGlvbnMiOnsicmVmaW5lLnByb3ZpbmNpYSI6IkJ1cmdvcyIsInJlZmluZS5ob3NwaXRhbCI6IkNvbXBsZWpvIEFzaXN0ZW5jaWFsIFVuaXZlcnNpdGFyaW8gZGUgQnVyZ29zIn19LCJ4QXhpcyI6ImZlY2hhIiwibWF4cG9pbnRzIjoiIiwidGltZXNjYWxlIjoiZGF5Iiwic29ydCI6IiJ9XSwiYWxpZ25Nb250aCI6dHJ1ZSwiZGlzcGxheUxlZ2VuZCI6dHJ1ZX0%3D'
  },
  {
    title: 'Nuevos Fallecidos',
    location: LOCATION,
    hospital: HOSPITAL,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoiY29sdW1uIiwiZnVuYyI6IlNVTSIsInlBeGlzIjoibnVldm9zX2ZhbGxlY2ltaWVudG9zIiwic2NpZW50aWZpY0Rpc3BsYXkiOnRydWUsImNvbG9yIjoiIzY2YzJhNSJ9XSwiY29uZmlnIjp7ImRhdGFzZXQiOiJzaXR1YWNpb24tZGUtaG9zcGl0YWxpemFkb3MtcG9yLWNvcm9uYXZpcnVzLWVuLWNhc3RpbGxhLXktbGVvbiIsIm9wdGlvbnMiOnsicmVmaW5lLmhvc3BpdGFsIjoiQ29tcGxlam8gQXNpc3RlbmNpYWwgVW5pdmVyc2l0YXJpbyBkZSBCdXJnb3MifX0sInhBeGlzIjoiZmVjaGEiLCJtYXhwb2ludHMiOiIiLCJ0aW1lc2NhbGUiOiJkYXkiLCJzb3J0IjoiIn1dLCJhbGlnbk1vbnRoIjp0cnVlLCJkaXNwbGF5TGVnZW5kIjp0cnVlfQ%3D%3D'
  },
    {
    title: 'Nuevas Altas',
    location: LOCATION,
    hospital: HOSPITAL,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoiY29sdW1uIiwiZnVuYyI6IlNVTSIsInlBeGlzIjoibnVldmFzX2FsdGFzIiwic2NpZW50aWZpY0Rpc3BsYXkiOnRydWUsImNvbG9yIjoiIzY2YzJhNSJ9XSwiY29uZmlnIjp7ImRhdGFzZXQiOiJzaXR1YWNpb24tZGUtaG9zcGl0YWxpemFkb3MtcG9yLWNvcm9uYXZpcnVzLWVuLWNhc3RpbGxhLXktbGVvbiIsIm9wdGlvbnMiOnsicmVmaW5lLmhvc3BpdGFsIjoiQ29tcGxlam8gQXNpc3RlbmNpYWwgVW5pdmVyc2l0YXJpbyBkZSBCdXJnb3MifX0sInhBeGlzIjoiZmVjaGEiLCJtYXhwb2ludHMiOiIiLCJ0aW1lc2NhbGUiOiJkYXkiLCJzb3J0IjoiIn1dLCJhbGlnbk1vbnRoIjp0cnVlLCJkaXNwbGF5TGVnZW5kIjp0cnVlfQ%3D%3D'
  },
  {
    title: 'Nuevos enfermos detectados por atención primaria',
    location: LOCATION_PROVINCIA,
    url: 'https://analisis.datosabiertos.jcyl.es/chart/embed/?dataChart=eyJ0aW1lc2NhbGUiOiJ5ZWFyIiwicXVlcmllcyI6W3siY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoiY29sdW1uIiwiZnVuYyI6IlNVTSIsInlBeGlzIjoiaW5jcmVtZW50b19lbmZlcm1vcyIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiM2NmMyYTUiLCJ5TGFiZWxPdmVycmlkZSI6Ik51ZXZvcyBFbmZlcm1vcyBEZXRlY3RhZG9zIFBvciBBdGVuY2lvbiBQcmltYXJpYSAoUHJvdmluY2lhIEJ1cmdvcykifV0sImNvbmZpZyI6eyJkYXRhc2V0Ijoic2l0dWFjaW9uLWFmZWN0YWRvcy1wb3ItY29yb25hdmlydXMtZW4tYXRlbmNpb24tcHJpbWFyaWEiLCJvcHRpb25zIjp7ImRpc2p1bmN0aXZlLnByb3ZpbmNpYSI6dHJ1ZSwicmVmaW5lLnByb3ZpbmNpYSI6IkJ1cmdvcyJ9fSwieEF4aXMiOiJmZWNoYSIsIm1heHBvaW50cyI6IiIsInRpbWVzY2FsZSI6ImRheSIsInNvcnQiOiIifV0sImFsaWduTW9udGgiOnRydWUsImRpc3BsYXlMZWdlbmQiOnRydWV9'
  },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public graphs = GRAPHS;
  public percentageUci;
  public percentagePlanta;
  public nuevasAltas;
  public nuevasMuertes;
  public updateDate;
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private _backendService: BackendService) {
    iconRegistry
      .addSvgIcon(
        'hospital',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/hospital1.svg'))
      .addSvgIcon(
        'location',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/location.svg'))
        ;
  }

  public  ngOnInit(): void {
    this._backendService.getWidgetsData().subscribe((data: WidgetData) => {
      this.percentageUci = Math.round(100 *(data.hospitalizadosuci / data.disponiblesuci));
      this.percentagePlanta = Math.round(100 *(data.hospitalizados / data.disponiblesplanta));
      this.nuevasAltas = data.altas;
      this.nuevasMuertes = data.muertes;
      this.updateDate = data.date.day + "/"+ data.date.month + "/"+ data.date.year
    });

  }

  public onGraphClicked(url: string) {
    window.location.href = url;
  }
}
