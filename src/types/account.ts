export interface Account {
  id: string
  labels: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
  labelsStr?: string
}

export type AccountType = Account['type']