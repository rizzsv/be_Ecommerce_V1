export interface JwtPayload {
  id: string
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  iat?: number
  exp?: number
}

export interface MetaData {
  totalItem: number
  currentPage: number
  totalPages?: number
  quantity?: number
}
