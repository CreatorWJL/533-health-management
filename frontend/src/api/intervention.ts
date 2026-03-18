import request from './request'

export interface InterventionPlan {
  id?: number
  userId: number
  assessmentId?: number
  planType?: string
  planName?: string
  content?: string
  goals?: string
  duration?: number
  status?: number
  startDate?: string
  endDate?: string
}

export const interventionApi = {
  create: (data: InterventionPlan) => request.post('/intervention/create', data),
  list: (userId: number) => request.get('/intervention/list', { params: { userId } }),
  update: (data: InterventionPlan) => request.put('/intervention/update', data)
}
