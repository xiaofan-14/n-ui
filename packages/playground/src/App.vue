<script lang="ts" setup>
import { reactive } from 'vue'

const data = reactive({
  name: '',
  desc: ''
})
</script>

<template>
  <div>
    <span>姓名: 密码框</span>
    <er-input v-model="data.name" show-password type="password" />
  </div>
  <div>
    <span>描述: 文本域</span>
    <er-input v-model="data.desc" type="textarea" />
  </div>
</template>
