export interface ReaderResult {
  id: number
  cost?: number
  address: string
  name: string
  phoneNumber?: string
  password: string
  type?: 'faculty' | 'reader' | 'staff'
  cardNumber?: string
}
