export interface DeviceType {
  id: string,
  status: string,
  testDevice: boolean,
  desiredProperties: DeviceProperties,
  reportedProperties: DeviceProperties,
  tags: DeviceTags
}

export interface DeviceProperties {
  fwVersion: string,
  gitRevision: string,
  doSleep: boolean,
  sleepTimeSec: number,
  measureIntervalMs: number,
  measureBatchSize: number,
  ledPin: number,
}

export interface DeviceTags {

  deviceType: string,
  telemetryVersion: string,
  version: string,
  location: string
}
