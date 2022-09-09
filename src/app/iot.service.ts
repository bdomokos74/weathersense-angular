import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Measurement} from "./measurement";
import {MeasurementType} from "./measurement-type";

@Injectable({providedIn: 'root'})
export class IoTService {
  private measurementUrl = '/blob/weathersense-data/';
  private headers = {"x-ms-version": "2020-04-08"};

  constructor(private http: HttpClient) {
  }

  getMeasurements(device: string, date: string): Observable<Measurement[]> {
    return this.getMeasurementsMulti([device], date)
  }
  getMeasurementsMulti(devices: string[], date: string): Observable<Measurement[]> {
    let numReturned: number = 0;
    return new Observable<Measurement[]>(subscriber => {
      for (const device of devices) {
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
          let measurements: Measurement[]
          try {
            measurements = str.split('\n')
              .filter(s => s.length != 0)
              .map<Measurement>(item => {
                let parsed = JSON.parse(item);
                parsed.ts = epochToDate(parsed.ts);
                return parsed;
              });
          } catch (e) {
            //2022-08-09T23:53:22.000000,  22.33,  97409.00, 41.55,     , 0       ,25.47,  19.19,
            //2022-08-05T00:51:23.737603,  27.39,  966.87,   43.68, 0.54, 240000

            let rows = str.split('\n');
            let tmp = rows[0].split(',')
            console.log("oldformat, cols=" + tmp.length);
            console.log(tmp.map((s, i) => i + ": " + s).join(" "))

            measurements = rows
              .filter(s => s.length != 0)
              .map<Measurement>(item => {
                let parsed = item.split(',');
                console.log(parsed.length)
                let meas!: Measurement;
                if (parsed.length === 9) {
                  meas = {
                    id: undefined,
                    ts: new Date(parsed[0]),
                    p: parseFloat(parsed[2]),
                    h: parseFloat(parsed[3]),
                    t1: parsed[6] ? parseFloat(parsed[6]) : undefined,
                    t2: parsed[7] ? parseFloat(parsed[7]) : undefined,
                  }
                }
                if (parsed.length === 6) {
                  meas = {
                    id: undefined,
                    ts: new Date(parsed[0]),
                    p: parseFloat(parsed[2]),
                    h: parseFloat(parsed[3]),
                    t1: parseFloat(parsed[1]),
                    t2: undefined
                  }
                } else {

                }
                return meas;
              });
          }
          let len = measurements.length;
          console.log("got data:")
          console.log(measurements[len - 1].ts);
          console.log(measurements[len - 1]);
          subscriber.next(measurements);
          numReturned += 1
          if(numReturned == devices.length) {
            subscriber.complete();
          }

        }, error => {
          subscriber.error(error)
        });
      }

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

  getDevices(): string[] {
    return ['DOIT1', 'BME280-1', 'DALLAS1', 'ESP32-1']
  }

  getMeasurementTypes(): MeasurementType[] {
    return [
      {name: 'Temperature', code1: 't1', code2: 't2', unit: '°C'},
      {name: 'Pressure', code1: 'p', code2: undefined, unit: 'hPa'},
      {name: 'Humidity', code1: 'h', code2: undefined, unit: '%'}];
  }
}
