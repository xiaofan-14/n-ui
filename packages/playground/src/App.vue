<template>
  <ErConfigProvider>

    <div>
      <div id="outside">外部区域</div>
      <er-popconfirm
      title="Test Title"
      :hide-icon="true"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      >
      <button id="trigger">trigger</button>
    </er-popconfirm>
  </div>
</ErConfigProvider>
</template>

<script setup>
function handleConfirm() {
  console.log('✅ Confirm clicked');
}

function handleCancel() {
  console.log('❌ Cancel clicked');
}
</script>
