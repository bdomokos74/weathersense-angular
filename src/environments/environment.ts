// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  baseUrl: 'http://localhost:4200',
  blobUrl: 'https://weathersensestorage.blob.core.windows.net',
  iotHubUrl: 'https://weathersensehub.azure-devices.net',

  tenantId: 'd1756ea2-2803-4365-8987-9bd9a3829494',
  clientId: '5ee20736-5cc8-4466-acac-fe2062a9a1a7',

  devices: ['DOIT1', 'BME280-1', 'DALLAS1', 'ESP32-1'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
