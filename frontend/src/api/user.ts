import request from './request'

export interface User {
  id?: number
  username: string
  password?: string
  realName?: string
  phone?: string
  email?: string
}

export const userApi = {
  register: (data: User) => request.post('/user/register', data),
  login: (data: User) => request.post('/user/login', data),
  getInfo: (userId: number) => request.get('/user/info', { params: { userId } }),
  update: (data: User) => request.put('/user/update', data)
}
