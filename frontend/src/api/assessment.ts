import request from './request'

export interface HealthAssessment {
  id?: number
  userId: number
  assessmentType?: string
  riskLevel?: number
  riskFactors?: string
  assessmentResult?: string
  recommendations?: string
  assessmentDate?: string
}

export const assessmentApi = {
  create: (data: HealthAssessment) => request.post('/assessment/create', data),
  list: (userId: number) => request.get('/assessment/list', { params: { userId } }),
  detail: (id: number) => request.get('/assessment/detail', { params: { id } })
}
