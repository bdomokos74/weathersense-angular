export const environment = {
  env: 'prod',

  production: true,

  baseUrl: 'https://weathersensegui.z6.web.core.windows.net',
  blobUrl: 'https://weathersensestorage.blob.core.windows.net',
  publicBlobUrl: 'https://weathersensepubstorage.blob.core.windows.net',
  iotHubUrl: 'https://weathersensehub.azure-devices.net',
  tenantId: 'd1756ea2-2803-4365-8987-9bd9a3829494',
  clientId: 'c66d1c86-6db9-4534-999c-53c95fb6ae1a',

  devices: ['DOIT1', 'BME280-1', 'DALLAS1', 'ESP32-1'],
};
