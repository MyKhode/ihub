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
        <span class="nav-button">
          RD-LAB CENTER
          <i-simple-icons-vuedotjs class="ml-2 h-4 w-4" />
          <i-simple-icons-supabase class="ml-2 h-4 w-4" />
        </span>
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
    text: "home",
    to: "/",
    icon: "heroicons-outline:home",
  },
  {
    text: "all apps",
    to: "/apps",
    icon: "game-icons:abstract-050",
  },
  {
    text: "kla klouk",
    to: "/kla-klouk",
    icon: "game-icons:dice-fire",
  },
  {
    text: "get tiktok sub",
    to: "/extract-subtitle-from-tiktok-video",
    icon: "game-icons:spell-book",
  },
  {
    text: "token top up",
    to: "/profile",
    icon: "mingcute:binance-coin-bnb-fill",
  },
  {
    text: "Profile",
    to: "/profile",
    icon: "heroicons-outline:user",
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
  @apply flex items-center rounded p-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500;
}
</style>
