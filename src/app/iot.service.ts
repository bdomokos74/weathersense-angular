import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Measurement} from "./measurement";

@Injectable({providedIn: 'root'})
export class IoTService {
  private measurementUrl = '/blob/weathersense-data/';
  private headers = {"x-ms-version": "2020-04-08"};

  constructor(private http: HttpClient) {
  }

  getMeasurements(device: string, date: string): Observable<Measurement[]> {
    return new Observable<Measurement[]>(subscriber => {
      let url = `${this.measurementUrl}meas-${device}-${date}.txt`;
      console.log(`requesting ${url}`);
      this.http.get(url,
        {
          headers: this.headers,
          responseType: "text"
        }).subscribe(str => {
        let epochToDate = function (epochSeconds: number) {
          let d = new Date(0);
          d.setUTCSeconds(epochSeconds);
          return d;
        }
        let measurements = str.split('\n')
          .filter(s => s.length != 0)
          .map<Measurement>(item => {
            let parsed = JSON.parse(item);
            parsed.ts = epochToDate(parsed.ts);
            return parsed;
          });
        let len = measurements.length;
        console.log(measurements[len - 1].ts);
        console.log(measurements[len - 1]);
        subscriber.next(measurements);
        subscriber.complete();
      });
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`measurementservice: ${message}`);
  }
}
