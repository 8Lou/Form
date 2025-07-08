<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <AccountForm />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AccountForm from './components/AccountForm.vue'
</script>

<style>
body {
  background: #e3e1dd;
}
.q-card {
  background: rgb(165, 221, 224);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>