<script setup lang="ts">
defineOptions({
  name: 'LButton'
})
</script>

<template>
  <button class="bg-zinc-100 border font-semibold text-zinc-900 text-sm px-4 duration-200 py-2.5 transition-all hover:border-zinc-300 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 active:translate-y-[0.5px] inline-flex gap-2 rounded-sm active:border-zinc-300 active:bg-zinc-200 active:shadow-none text-center">
    <slot />
  </button>
</template>
