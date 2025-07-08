import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Account } from '@/types/account'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

    // Преобразование строки меток в массив объектов
  const parseLabels = (labelsStr: string): { text: string }[] => {
    return labelsStr
      .split(';')
      .map(item => item.trim())
      .filter(Boolean)
      .map(text => ({ text }))
  }

  // Преобразование массива меток в строку
  const stringifyLabels = (labels: { text: string }[]): string => {
    return labels.map(label => label.text).join('; ')
  }

  // Добавление новой учетной записи
const addAccount = (): Account => {
  const newAccount: Account = {
    id: Date.now().toString(),
    labels: [],
    type: 'Локальная',
    login: '',
    password: '',
    labelsStr: ''
  }
  
  accounts.value.push(newAccount)
  saveToLocalStorage()
  return newAccount
}

  // Удаление учетной записи
const removeAccount = (id: string): void => {
  try {
    const newAccounts = accounts.value.filter(account => account.id !== id)
    if (newAccounts.length === accounts.value.length) {
      throw new Error('Учетная запись не найдена')
    }
    accounts.value = newAccounts
    saveToLocalStorage()
  } catch (error) {
    console.error('Ошибка удаления:', error)
    throw error // Пробрасываем для обработки в компоненте
  }
}

  // Обновление учетной записи
const updateAccount = (id: string, updatedData: Partial<Account>) => {
  try {
    const account = accounts.value.find(a => a.id === id)
    if (!account) throw new Error(`Account ${id} not found`)
    
    // ... остальная логика ...
  } catch (err) {
    console.error('Update failed:', err)
    throw err // Перебрасываем для обработки в компоненте
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