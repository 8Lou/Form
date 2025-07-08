<template>
  <div class="q-pa-xl">
    <!-- Заголовок и кнопка в одной строке -->
    <div class="row items-center justify-center q-mb-md">
      <div class="text-h4 q-mr-md">Учетные записи</div>
      <q-btn 
        color="secondary" 
        icon="add" 
        @click="addAccount"
      />
    </div>
    
    <!-- Подсказка -->
    <div class="row items-center q-mb-md">
      <q-icon name="help_outline" color="grey" size="sm" class="q-mr-xs" />
      <span class="text-caption text-grey">
        Для указания нескольких меток для одной пары логин / пароль используйте разделитель ";"
      </span>
    </div>
    
    <!-- Список учетных записей -->
    <q-card 
      v-for="account in accounts" 
      :key="account.id" 
      class="q-mb-md"
      :class="{ 'border-error': hasErrors(account) }"
    >
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Поле меток -->
          <div class="col-12">
            <q-input
              v-model="account.labelsStr"
              label="Метка"
              @blur="updateLabels(account)"
              :rules="[val => !val || val.length <= 50 || 'Максимум 50 символов']"
              :error="hasError(account, 'labels')"
            />
          </div>
          
          <!-- Поле типа учетной записи -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="account.type"
              :options="accountTypes"
              label="Тип записи"
              emit-value
              map-options
              @update:model-value="handleTypeChange(account)"
              :error="hasError(account, 'type')"
            />
          </div>
          
          <!-- Поле логина -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="account.login"
              label="Логин"
              :rules="[val => !!val || 'Обязательное поле', val => val.length <= 100 || 'Максимум 100 символов']"
              @blur="validateAccount(account)"
              :error="hasError(account, 'login')"
            />
          </div>
          
          <!-- Поле пароля (только для локальных учеток) -->
          <div class="col-12" v-if="account.type === 'Локальная'">
            <q-input
              v-model="account.password"
              label="Пароль"
              type="password"
              :rules="[val => !!val || 'Обязательное поле', val => val.length <= 100 || 'Максимум 100 символов']"
              @blur="validateAccount(account)"
              :error="hasError(account, 'password')"
            />
          </div>
          
          <!-- Кнопка удаления -->
          <div class="col-12">
            <q-btn
              color="negative"
              icon="delete"
              label="Удалить"
              @click="handleRemoveAccount(account.id)"
              class="float-right"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const accountStore = useAccountStore()
const { accounts } = storeToRefs(accountStore)
const { addAccount, removeAccount, updateAccount, init } = accountStore

onMounted(() => {
  init()
})

const accountTypes = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Локальная' }
]

// Валидация ошибок
const errorStates = ref<Record<string, Set<string>>>({})

const hasError = (account: Account, field: string) => {
  return errorStates.value[account.id]?.has(field) || false
}

const hasErrors = (account: Account) => {
  return errorStates.value[account.id]?.size > 0
}

const validateAccount = (account: Account) => {
  const errors = new Set<string>()
  
  if (!account.login || account.login.length > 100) {
    errors.add('login')
  }
  
  if (account.type === 'Локальная' && (!account.password || account.password.length > 100)) {
    errors.add('password')
  }
  
  if (account.labelsStr && account.labelsStr.length > 50) {
    errors.add('labels')
  }
  
  errorStates.value[account.id] = errors
  updateAccount(account.id, account)
}

const handleRemoveAccount = (id: string) => {
    removeAccount(id)
}
</script>

<style scoped>
.border-error {
  border-left: 4px solid #046373;
}

.q-card {
  transition: all 0.3s ease;
}

.q-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>