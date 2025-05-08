<script setup lang="ts">
import { ref } from 'vue'
function test(){
  console.log('clicked!')
}
const disabled = ref(false)

setTimeout(()=>{
  disabled.value = true
}, 1500)
</script>

<template>
  <er-button type="primary" size="default" icon="check" :plain="true" @click="test">
    编辑
  </er-button>
  <ErButton type="danger" size="small" :plain="true" suffixIcon="arrow-right">
    danger
  </ErButton>
  <ErButton type="success" size="default" icon="search">
    success
  </ErButton>

  <ErButton :autofocus="true" :circle="true" icon="search" />

  <ErButtonGroup /> 
</template>
