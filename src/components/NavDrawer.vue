<template>
  <!-- background blur on smaller screens -->
  <transition enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div
      class="absolute z-40 h-full w-full bg-black bg-opacity-50 backdrop-blur-sm backdrop-filter transition-opacity lg:hidden"
      v-if="modelValue"
    ></div>
  </transition>

  <!-- nav drawer -->
  <transition
    enter-from-class="-translate-x-full"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="modelValue"
      ref="navContainer"
      class="nav-container bg-gradient-to-y from-slate-200 via-slate-400 to-slate-600 dark:bg-gradient-to-t dark:from-slate-900 dark:to-slate-700 fixed z-50 flex h-full max-h-full w-64 flex-col justify-between divide-y overflow-y-auto shadow-lg transition-transform dark:shadow-none"
    >
      <nav class="py-2 text-slate-900 dark:text-slate-50 font-bold">
        <router-link to="/" class="nav-button">
          RD-LAB CENTER
          <i-simple-icons-vuedotjs class="ml-2 h-4 w-4" />
          <i-simple-icons-supabase class="ml-2 h-4 w-4" />
        </router-link>
      </nav>

      <nav class="flex flex-shrink-0 flex-grow flex-col space-y-2 py-2 text-gray-900 dark:text-slate-400">
        <router-link
          v-for="{ text, to, icon } in navLinks"
          v-wave
          class="nav-button"
          exact-active-class="rounded-md text-gray-900 dark:text-white bg-gradient-to-r from-gray-400 to-gray-200 dark:from-slate-300 dark:to-slate-500"
          :to="to"
        >
          <span class="iconify mr-2 h-4 w-4" :data-icon="icon"></span>
          <span>{{ text }}</span>
        </router-link>
      </nav>

      <nav class="py-2" v-if="isSignIn">
        <button @click="signOut" class="nav-button w-full text-slate-50">
          <i-carbon-logout class="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </nav>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import { supabase } from "@/services/supabase";

const isSignIn = ref(!!supabase.auth.user());

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

/* close the nav whenever clicked outside on small screens */
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greater("lg");
const navContainer = ref(null);
onClickOutside(navContainer, () => {
  if (!lgAndLarger.value) emit("update:modelValue", false);
});

/* main navigation links for side drawer */
const navLinks = [
  {
    text: "Home",
    to: "/",
    icon: "fluent-color:home-32",
  },
  {
    text: "All Apps",
    to: "/apps",
    icon: "fluent-color:diversity-16",
  },
  {
    text: "Kla Klouk",
    to: "/games/kla-klouk",
    icon: "noto:game-die",
  },
  {
    text: "Get TikTok Sub",
    to: "/apps/extract-subtitle-from-tiktok-video",
    icon: "fluent-color:document-text-28",
  },
  {
    text: "Token Top Up",
    to: "/top-up",
    icon: "mingcute:binance-coin-bnb-fill",
  },
  {
    text: "Notifications",
    to: "/notifications",
    icon: "fluent-color:mail-alert-32",
  },
  {
    text: "Profile",
    to: "/profile",
    icon: "fluent-color:person-available-24",
  },
];

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
}
</script>

<style scoped>
/* .nav-container {
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://images.unsplash.com/photo-1632213702844-1e0615781374?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1632&q=80");
} */

.nav-button {
  @apply flex items-center rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-600 duration-500 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500;
}
</style>
