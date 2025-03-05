<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import standardCard from "@/components/StandardCard.vue";

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());

const user = supabase.auth.user();
const token = ref(0);

async function fetchToken() {
  const { data: user_token } = await supabase
    .from("user_profiles")
    .select("token")
    .eq("user_id", user?.id)
    .single();
  if (user_token) {
    token.value = user_token.token;
  }
  console.log(token.value)
}


/* after navigation on small screens, close the nav drawer */
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater("lg");
const open = ref(false);
const route = useRoute();
watch(route, () => {
  if (!lgAndLarger.value) open.value = false;
});



onMounted(() => {
  open.value = lgAndLarger.value;
  fetchToken();
});
</script>

<template>
  <div class="flex h-full w-full max-w-full transition-colors">
   
    <NavDrawer v-model="open" />
    <div
      class="flex h-full max-h-full max-w-full flex-grow flex-col bg-zinc-100 text-zinc-900 transition-all dark:bg-zinc-900 dark:text-zinc-100"
      :class="{ 'lg:pl-64': open }">
      <AppTopBar v-model="open" :tokens="token" />
      <main class="flex-grow overflow-auto px-0 lg:px-4 py-2 bg-linear-to-r bg-gradient-to-b md:bg-gradient-to-r md:dark:bg-gradient-to-r dark:bg-gradient-to-t from-yellow-200 via-lime-400 to-green-600 dark:from-slate-900 dark:to-slate-700">
        <router-view />
      </main>
      <AppFooter />
      <!-- <div class="absolute "></div> -->
      <!-- <div class="absolute z-0 inset-0 h-full w-full  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"> </div> -->
    </div>
  </div>
</template>
