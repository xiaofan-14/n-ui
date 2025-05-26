<script setup lang="ts">
import { ErMessageBox, ErMessage } from "learn-ui-to-me";

function openConfirm() {
  ErMessageBox
    .confirm("proxy will permanently delete the file. Continue?", "Warning", { type: "warning" })
    .then((action: any) => {
      ErMessage.info(`action: ${action}`);
    })
    .catch((action: any) => {
      ErMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <er-button @click="openConfirm" plain> Click to open the Confirm</er-button>
</template>
