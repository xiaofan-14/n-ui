<script setup lang="ts">
function test(s: string){
  console.log('test ok', s)
}
</script>

<template>
  <p>
    <er-button-group disabled>
      <er-button type="primary" icon="arrow-left" @click="test('1')" >Previous Page</er-button>
      <er-button type="primary" @click="test('2')" >
        Next Page<er-icon icon="arrow-right" style="margin-left: 8px" />
      </er-button>
    </er-button-group>
  </p>
  <p>
    <er-button-group type="warning" size="small">
      <er-button type="primary" icon="edit" round @click="test('3')" />
      <er-button type="primary" icon="share"  @click="test('4')" />
      <er-button type="primary" icon="trash" round @click="test('5')" />
    </er-button-group>
  </p>
</template>
