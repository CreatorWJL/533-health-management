import request from './request'

export interface DeviceData {
  id?: number
  userId: number
  deviceId?: string
  deviceType?: string
  dataType?: string
  dataValue?: string
  dataTime?: string
}

export const deviceApi = {
  upload: (data: DeviceData) => request.post('/device/upload', data),
  getData: (userId: number) => request.get('/device/data', { params: { userId } })
}
