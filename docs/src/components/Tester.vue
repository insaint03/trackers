<script setup>
import { onMounted, ref, computed, defineProps } from 'vue'
import mdi from './mdi.vue'

const pass = ref(undefined);
const traces = ref([]);
const status = computed(()=>{
  const v = pass.value;
  if(v) { return 'pass'; }
  else if(v===false || v===null) { return 'fail'; }
  else { return 'yet'; }
});
const icon = computed(()=>({
    pass: 'check-circle',
    fail: 'close-circle',
    yet: 'alert-circle',
  }[status.value]));

const props = defineProps({
  title: String,
  desc: String,
  test: Function,
})

onMounted(async () => {
  // run test here
  try {
    const rs = await props.test();
    pass.value = !!rs;
  } catch(ex) {
    pass.value = false;
    traces.value = ex.stack.split('\n');
    console.error(ex);
  }
})

</script>

<template>
  <div class="list-block">
    <div class="list-title">
      <mdi :path="icon" :class="status" />
      <span class="list-title-text" :class="status">{{ title }}</span>
    </div>
    <div class="list-content">
      <p>{{ desc }}</p>
      <div class="list-content-trace" v-show="0<traces.length">

      </div>
    </div>
  </div>
</template>

<style scoped>
.list-block {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  margin: 1em;
  padding: 1em;
}
.list-title {
  display: flex;
  align-items: start;
}
.list-title .pass {
  color: green;
}
.list-title .yet {
  color: orange;
}
.list-title .fail {
  color: red;
}
.list-title-text {
  margin-left: 1em;
}
.list-content {
  margin-top: 1em;
  text-align: left;
}
.list-content-trace {
  margin-top: 1em;
  font-family: monospace;
  white-space: pre;
}

</style>