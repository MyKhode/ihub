<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";

/* after navigation on small screens, close the nav drawer */
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater("lg");
const open = ref(false);
const route = useRoute();
watch(route, () => {
  if (!lgAndLarger.value) open.value = false;
});

onMounted(() => {
  if (lgAndLarger.value) open.value = false;
});
</script>

<template>
  <div class="flex h-full w-full max-w-full transition-colors">
   
    <NavDrawer v-model="open" />
    <div
      class="flex h-full max-h-full max-w-full flex-grow flex-col bg-zinc-100 text-zinc-900 transition-all dark:bg-zinc-900 dark:text-zinc-100"
      :class="{ 'lg:pl-64': open }">
      <AppTopBar v-model="open" />
      <main class="flex-grow overflow-auto px-4 py-2 bg-linear-to-r bg-gradient-to-b md:bg-gradient-to-r from-yellow-200 via-lime-400 to-green-600 dark:from-slate-900 dark:to-slate-700">
        <router-view />
      </main>
      <AppFooter />
      <!-- <div class="absolute "></div> -->
      <!-- <div class="absolute z-0 inset-0 h-full w-full  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"> </div> -->
    </div>
  </div>
</template>
