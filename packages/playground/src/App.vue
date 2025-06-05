<script setup lang="ts">
import {ref, watchEffect} from 'vue'

const options = ref([
  { value: '北京', label: 'beijing' },
  { value: '上海', label: 'shanghai' },
  { value: '深证', label: 'shenzhen' },
  { value: '杭州', label: 'hangzhou' },
])
const value = ref('')

watchEffect(()=>{
  console.log(value.value);
})
</script>
<template>
  <er-select v-model="value" :options="options" clearable />
</template>

