<script setup lang="ts">
import {ref} from 'vue'

function test() {
  console.log('clicked!')
}

const disabled = ref(false)

setTimeout(() => {
  disabled.value = true
}, 1500)

const val = ref(['a'])

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

  <ErButton :autofocus="true" :circle="true" icon="search"/>

  <ErButtonGroup :disabled="true">
    <ErButton icon="arrow-left" @click="test">prev</ErButton>
    <ErButton @click="test">current</ErButton>
    <ErButton suffixIcon="arrow-right" @click="test">next</ErButton>
  </ErButtonGroup>

  <Collapse :modelValue="val" accordion>
    <CollapseItem name="a" title="title a">
      content a Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio, rem.
    </CollapseItem>
    <CollapseItem name="b" title="title b">
      content b
    </CollapseItem>
    <CollapseItem name="c" title="title c" :disabled="true">
      content c
    </CollapseItem>
  </Collapse>
</template>
