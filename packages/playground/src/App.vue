<script lang="ts" setup>
import { ErMessage } from "learn-ui-to-me"

const open1 = () => {
  ErMessage("This is a message.");
};
const open2 = () => {
  ErMessage({
    message: "Congrats, this is a success message.",
    type: "success",
    showClose: true
  });
};
const open3 = () => {
  ErMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
    showClose: true
  });
};
const open4 = () => {
  ErMessage.error("Oops, this is a error message.");
};
</script>

<template>
  <er-button :plain="true" @click="open2">Success</er-button>
  <er-button :plain="true" @click="open3">Warning</er-button>
  <er-button :plain="true" @click="open1">Message</er-button>
  <er-button :plain="true" @click="open4">Error</er-button>
</template>
