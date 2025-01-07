import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {Measurement} from "../model/measurement";
import {MeasurementType} from "../model/measurement-type";
import {environment} from "../../../environments/environment";
import {MsalService} from "@azure/msal-angular";
import {DeviceTags, DeviceType} from "../model/device-type";

@Injectable({providedIn: 'root'})
export class IoTService {
  private measurementUrl = '/weathersense-data/';
  private headers = {"x-ms-version": "2020-04-08"};

  constructor(private http: HttpClient, private msalService: MsalService) {
  }

  getDevices(): Observable<DeviceType[]> {
    let url = `${this.getBlobUrl()}/weathersense-config/devices.txt`;
    console.log("requesting:"+ url);
    return new Observable<DeviceType[]>(subscriber => {
      this.http.get(url,
        {
          headers: this.headers,
          responseType: "text"
        }).subscribe(
        {
          next(str) {
            console.log("devs"+ str);
            let devs: DeviceType[] = str.split("\n")
              .filter(s => s.length > 0)
              .map(s => {
                let obj = JSON.parse(s);
                let tags: DeviceTags = {
                  location: obj.tags?.deploymentLocation?.city,
                  deviceType: obj.tags?.deviceType,
                  telemetryVersion: obj.tags?.telemetryVersion,
                  version: obj.tags?.version
                }
                return {
                  id: obj.id,
                  status: obj.status,
                  testDevice: obj.tags?.testDevice,
                  desiredProperties: obj.properties.desired,
                  reportedProperties: obj.properties.reported,
                  tags: tags
                }
              });

            subscriber.next(devs);
          },
          complete() {
            console.log("getDevices completed");
            subscriber.complete();
          }
        });
    });
  }

  getMeasurements(device: string, date: string): Observable<Record<string, Measurement[]>> {
    return this.getMeasurementsMulti([device], date)
  }

  getBlobUrl() {
    if (this.msalService.instance.getAllAccounts().length == 0) {
      return environment.publicBlobUrl;
    } else {
      return environment.blobUrl;
    }
  }

  getMeasurementsMulti(devices: string[], date: string): Observable<Record<string, Measurement[]>> {
    let blobUrl = this.getBlobUrl();
    let numReturned: number = 0;
    return new Observable<Record<string, Measurement[]>>(subscriber => {
      for (const device of devices) {
        let url = `${blobUrl}${this.measurementUrl}meas-${device}-${date}.txt`;
        console.log(`requesting ${url}`);
        this.http.get(url,
          {
            headers: this.headers,
            responseType: "text"
          }).subscribe({
            next(str) {
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
              let result: any = {}
              result[device] = measurements
              subscriber.next(result);
              numReturned += 1
              if (numReturned == devices.length) {
                subscriber.complete();
              }

            },
            error(err) {
              console.log("readmulti err", err);
              numReturned += 1;
              if (numReturned == devices.length) {
                subscriber.complete();
              }
            }
          }
        );
      }
    });
  }

  getMeasurementTypes(): MeasurementType[] {
    return [
      {name: 'Temperature', code1: 't1', code2: 't2', unit: '°C', maxVal: 70},
      {name: 'Pressure', code1: 'p', code2: undefined, unit: 'hPa'},
      {name: 'Humidity', code1: 'h', code2: undefined, unit: '%'},
      {name: 'Radiation', code1: 'cpm', code2: undefined, unit: 'cpm'}];
  }
}
