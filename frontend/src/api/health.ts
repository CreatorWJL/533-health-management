import request from './request'

export interface HealthRecord {
  id?: number
  userId: number
  height?: number
  weight?: number
  bmi?: number
  bloodType?: number
  bloodPressureHigh?: number
  bloodPressureLow?: number
  heartRate?: number
  bloodSugar?: number
  medicalHistory?: string
  allergyHistory?: string
  familyHistory?: string
}

export const healthApi = {
  addRecord: (data: HealthRecord) => request.post('/health/record', data),
  getRecords: (userId: number) => request.get('/health/records', { params: { userId } }),
  getLatestRecord: (userId: number) => request.get('/health/record/latest', { params: { userId } })
}
