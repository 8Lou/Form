import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Account {
  id: string
  labels: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
  labelsStr?: string
}

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  // Добавление новой учетной записи
  const addAccount = () => {
    const newAccount = {
      id: Date.now().toString(),
      labels: [],
      type: 'Локальная',
      login: '',
      password: ''
    }
    accounts.value.push(newAccount)
    saveToLocalStorage()
    return newAccount
  }

  // Удаление учетной записи
  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter(account => account.id !== id)
    saveToLocalStorage()
  }

  // Обновление учетной записи
  const updateAccount = (id: string, updatedData: Partial<Account>) => {
    const accountIndex = accounts.value.findIndex(account => account.id === id)
    if (accountIndex !== -1) {
      // Особое преобразование для меток
      if (updatedData.labelsStr !== undefined) {
        updatedData.labels = updatedData.labelsStr
          ? updatedData.labelsStr.split(';')
              .filter(text => text.trim())
              .map(text => ({ text: text.trim() }))
          : []
      }
      
      accounts.value[accountIndex] = { 
        ...accounts.value[accountIndex], 
        ...updatedData 
      }
      saveToLocalStorage()
    }
  }

  // Сохранение в localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  // Загрузка из localStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('accounts')
    if (saved) {
      accounts.value = JSON.parse(saved)
      // Инициализация labelsStr для каждой учетной записи
      accounts.value.forEach(account => {
        account.labelsStr = account.labels.map(label => label.text).join(';')
      })
    }
  }

  // Инициализация хранилища
  const init = () => {
    loadFromLocalStorage()
    if (accounts.value.length === 0) {
      addAccount() // Первая учетная запись по умолчанию
    }
  }

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    init,
    loadFromLocalStorage,
    saveToLocalStorage
  }
})