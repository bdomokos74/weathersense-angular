export const environment = {
  env: '',
  production: true,

  baseUrl: 'https://weathersensegui.z6.web.core.windows.net',
  blobUrl: 'https://weathersensestorage.blob.core.windows.net',
  publicBlobUrl: 'https://weathersensepubstorage.blob.core.windows.net',
  iotHubUrl: 'https://weathersensehub.azure-devices.net',
  tenantId: 'd1756ea2-2803-4365-8987-9bd9a3829494',
  clientId: '<paste_cliend_id_here>',
  authority: 'https://login.microsoftonline.com/d1756ea2-2803-4365-8987-9bd9a3829494',

  devices: ['DOIT1', 'BME280-1', 'DALLAS1', 'ESP32-1'],
};
