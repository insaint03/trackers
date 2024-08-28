<script setup>
import { ref } from 'vue'
import Tester from './components/Tester.vue'
import tests from './tests.js'

const cases = ref(tests);

</script>

<template>
  <header>GTM Lookup tester</header>
  <main>
    <div v-for="(tc,ti) in cases" :key="`test-${ti}.${tc.title}`">
      <Tester v-bind="tc" />
    </div>
  </main>
</template>

<style scoped>
</style>
