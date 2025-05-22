<script setup lang="ts">
function confirm(){
  console.log('confirm')
}
function cancel(){
  console.log('cancel')
}
</script>

<template>
  <er-popconfirm @confirm="confirm" @cancel="cancel" title="测试标题 Lorem ipsum dolor sit amet." icon="question-circle" iconColor="#f90" hideAfter="200" width="150" confirmButtonText="确定"
    cancelButtonText="取消">
    <er-button>点击我</er-button>
  </er-popconfirm>
</template>

<style></style>
