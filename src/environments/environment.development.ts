export const environment = {
  env: 'development',

  production: true,

  baseUrl: 'http://localhost:4200',
  blobUrl: 'https://weathersenseteststorage.blob.core.windows.net',
  publicBlobUrl: 'https://weathersensepubstorage.blob.core.windows.net',
  iotHubUrl: 'https://weathersensehub.azure-devices.net',
  tenantId: 'd1756ea2-2803-4365-8987-9bd9a3829494',
  clientId: '5ee20736-5cc8-4466-acac-fe2062a9a1a7',
  authority: 'https://login.microsoftonline.com/d1756ea2-2803-4365-8987-9bd9a3829494',
  devices: ['BME280-1', 'GM1'],
};

// 'https://login.microsoftonline.com/common',