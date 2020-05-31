import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { concatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
interface DateRecord {
    x: {
        month: number,
        day: number,
        year: number,
    }
}

interface HospitalRecord {
    inicialesplanta: number,
    hospitalizadosuci: number,
    disponiblesuci: number,
    disponiblesplanta: number,
    inicialesuci: number,
    hospitalizados: number,
    x: {
        hospital: string,
        provincia: string
    }
}

interface AltasRecord {
    "serie1-1": number,
}

interface MuertesRecord {
    "serie1-1": number,
}

export interface WidgetData {
    inicialesplanta: number,
    hospitalizadosuci: number,
    disponiblesuci: number,
    disponiblesplanta: number,
    inicialesuci: number,
    hospitalizados: number,
    x: {
        hospital: string,
        provincia: string,
    }
    date: {
        month: number,
        day: number,
        year: number,
    },
    altas: number,
    muertes: number,
}

const LAST_RECORD_URL = "https://analisis.datosabiertos.jcyl.es/api/records/1.0/analyze/?maxpoints=0&sort=-fecha&x=fecha&y.consumo.expr=camas_iniciales_planta&y.consumo.func=SUM&y.consumo.cumulative=false&dataset=ocupacion-de-camas-en-hospitales&timezone=Europe%2FMadrid&lang=es";
const HUBU_HOSPITAL_RECORD_URL = "https://analisis.datosabiertos.jcyl.es/api/records/1.0/analyze/?maxpoints=0&sort=-codigos&x=hospital&x=provincia&y.inicialesplanta.expr=camas_iniciales_planta&y.inicialesplanta.func=SUM&y.inicialesplanta.cumulative=false&y.disponiblesplanta.expr=camas_habilitadas_planta&y.disponiblesplanta.func=SUM&y.disponiblesplanta.cumulative=false&y.hospitalizados.expr=camas_ocupadas_planta&y.hospitalizados.func=SUM&y.hospitalizados.cumulative=false&y.inicialesuci.expr=camas_iniciales_uci&y.inicialesuci.func=SUM&y.inicialesuci.cumulative=false&y.disponiblesuci.expr=camas_habilitadas_uci&y.disponiblesuci.func=SUM&y.disponiblesuci.cumulative=false&y.hospitalizadosuci.expr=camas_ocupadas_uci&y.hospitalizadosuci.func=SUM&y.hospitalizadosuci.cumulative=false&y.codigos.expr=codigo_ine&y.codigos.func=SUM&y.codigos.cumulative=false&dataset=ocupacion-de-camas-en-hospitales&timezone=Europe%2FMadrid&lang=es&refine.provincia=Burgos&refine.hospital=Complejo%20Asistencial%20Universitario%20de%20Burgos"
const HUBU_ALTAS_RECORD_URL = "https://analisis.datosabiertos.jcyl.es/api/records/1.0/analyze/?refine.hospital=Complejo+Asistencial+Universitario+de+Burgos&timezone=Europe%2FMadrid&dataset=situacion-de-hospitalizados-por-coronavirus-en-castilla-y-leon&x=fecha.year&x=fecha.month&x=fecha.day&sort=x.fecha.year,x.fecha.month,x.fecha.day&maxpoints=&y.serie1-1.expr=nuevas_altas&y.serie1-1.func=SUM&y.serie1-1.cumulative=false&lang=es"
const HUBU_MUERTES_RECORD_URL = "https://analisis.datosabiertos.jcyl.es/api/records/1.0/analyze/?refine.hospital=Complejo+Asistencial+Universitario+de+Burgos&timezone=Europe%2FMadrid&dataset=situacion-de-hospitalizados-por-coronavirus-en-castilla-y-leon&x=fecha.year&x=fecha.month&x=fecha.day&sort=x.fecha.year,x.fecha.month,x.fecha.day&maxpoints=&y.serie1-1.expr=nuevos_fallecimientos&y.serie1-1.func=SUM&y.serie1-1.cumulative=false&lang=es"

@Injectable({
    providedIn: 'root',
})
export default class BackendService {
    constructor(
        private http: HttpClient) { }

    public getWidgetsData() {
        let dateRecord: DateRecord;
        let widgetData;
        return this.http.get(LAST_RECORD_URL)
            .pipe(
                concatMap((response: DateRecord[]) => {
                    dateRecord = response[response.length - 1];
                    return this.http.get(HUBU_HOSPITAL_RECORD_URL + "&refine.fecha=" + dateRecord.x.year + "-" + dateRecord.x.month + "-" + dateRecord.x.day);

                }),
                concatMap((response: HospitalRecord[]) => {
                   widgetData = { ...response[0] , date: dateRecord.x};
                   return this.http.get(HUBU_ALTAS_RECORD_URL + "&refine.fecha=" + dateRecord.x.year + "-" + dateRecord.x.month + "-" + dateRecord.x.day);
                }),
                concatMap((response: AltasRecord[]) => {
                   widgetData = {...widgetData, altas: (response[0])["serie1-1"]};
                   return this.http.get(HUBU_MUERTES_RECORD_URL + "&refine.fecha=" + dateRecord.x.year + "-" + dateRecord.x.month + "-" + dateRecord.x.day)
                }),
                concatMap((response: MuertesRecord[]) => {
                    return of({...widgetData, muertes: (response[0])["serie1-1"]});
                 })
            );
    }

}