<script setup lang="ts">
import { NButton } from 'n-ui-mini'

function click(){
  console.log('clicked')
}
</script>

<template>
  <n-button type="danger" @click="click">
    click me
  </n-button>
</template>

<style>

</style>
