<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  buttonColor: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    default: "white",
  },
  url: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "Button",
  },
});

const classes = computed(() => `
  bg-${props.buttonColor}-100 text-${props.textColor} 
  text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm 
  dark:bg-${props.buttonColor}-900 dark:text-${props.textColor}
`);
</script>

<template>
  <component :is="url ? 'a' : 'span'" :href="url" :class="classes">
    {{ title }}
  </component>
</template>