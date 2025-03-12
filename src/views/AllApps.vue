<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Breadcrumb from "@/components/Breadcrumb.vue"; // Import the Breadcrumb component

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());

const tools = ref([
  {
    id: 1,
    title: "Extract TikTok Subtitle Video",
    description: "A declarative, efficient, and flexible JS library for building user interfaces.",
    icon: "fluent-color:document-text-28",
    color: "text-cyan-500",
    route: "/apps/extract-subtitle-from-tiktok-video"
  },
  {
    id: 1,
    title: "Kla Klouk",
    description: "A declarative, efficient, and flexible JS library for building user interfaces.",
    icon: "noto:game-die",
    color: "text-yellow-500",
    route: "/games/kla-klouk"
  },
  {
    id: 1,
    title: "Extract TikTok Subtitle Video",
    description: "A declarative, efficient, and flexible JS library for building user interfaces.",
    icon: "skill-icons:gamemakerstudio",
    color: "text-cyan-500",
    route: "/apps/extract-subtitle-from-tiktok-video"
  },
  {
    id: 1,
    title: "Kla Klouk",
    description: "A declarative, efficient, and flexible JS library for building user interfaces.",
    icon: "noto-v1:pineapple",
    color: "text-yellow-500",
    route: "/games/kla-klouk"
  },


])

const breadcrumbs = ref([
  { name: "Home", url: "/" },
  { name: "All Apps", url: "/apps" },
]);
</script>

<template>
  <section class="z-9 relative h-screen">
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-white dark:stroke-zinc-200/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true">
      <defs>
        <pattern id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc" width="200" height="200" x="50%" y="-1"
          patternUnits="userSpaceOnUse">
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" stroke-width="8" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
    </svg>

    <!-- Breadcrumb Component -->
    <Breadcrumb :breadcrumbs="breadcrumbs" />

    <section
      class="h-fit px-2 md:px-5 lg:px-8 flex flex-col lg:flex-row items-center justify-center text-white md:pt-5">
      <div class="flex flex-col w-full justify-center items-center pb-10 ">
        <div class="my-3">
          <h1
            class="w-full md:w-[80vw] px-1 md:px-8 lg:px-26 font-bold text-start py-3 text-2xl md:text-3xl lg:text-4xl text-black dark:text-white">
            Free & Paid Application</h1>
          <p
            class="w-full md:w-[80vw] px-1 md:px-8 lg:px-26 text-start text-sm md:text-base lg:text-lg text-gray-500 dark:text-gray-400">
            These are some of the open source projects that we have contributed to.
            If you have an open source project that you would like us to contribute
            to, please let us know.
          </p>
        </div>
        <div class="w-full md:w-[80vw] px-2 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div v-for="tool in tools" class="">
            <router-link :to="tool.route" :title="tool.title"
              class="cursor-pointer px-2 border-2 border-slate-500 border-opacity-60 rounded-lg h-23 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-cyan-50 duration-500 flex items-center justify-start">
              <div
                class="w-18 h-18 border-2 border-slate-100 rounded-lg hover:bg-slate-400 bg-slate-500 duration-300 justify-center items-center flex">
                <!-- <i class="fa-brands w-18 text-center text-2xl" :class="tool.color + ' ' + tool.icon"></i> -->
                <span class="iconify text-6xl w-18" :data-icon="tool.icon" :class="tool.color"></span>
              </div>
              <div class="flex flex-col w-full h-auto justify-start pt-2 py-3">
                <h1 class="text-start px-3 text-sm md:text-base lg:text-x text-black dark:text-white">
                  {{ tool.title }}
                </h1>
                <p class="text-start text-gray-500 dark:text-gray-400 px-3 text-xs line-clamp-2">
                  {{ tool.description }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>