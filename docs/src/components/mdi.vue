<script setup>
defineProps({
  path: String,
})
</script>

<template>
  <span :class="['mdi', `mdi-${path}`]"></span>
</template>
