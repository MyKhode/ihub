<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());

const items = ref([
  {
    id: 1,
    username: "MyKhode",
    title: "Extract Subtitle From Tikok Video",
    description: "A declarative, efficient, and flexible JS library for building user interfaces.",
    image: "https://www.ikhode.site/_astro/avatar.CIVzSjiG_Z1VvrYM.webp",
    route: "/extract-subtitle-from-tiktok-video"
  },
]);
</script>

<template>  
    <div class="self-center text-xl font-medium mb-4">All Apps</div>

    <section>
      <div>
        <h1 class="font-bold text-center text-2xl md:text-3xl lg:text-4xl">Free & Paid Application Tool</h1>
        <p class="text-center text-sm md:text-base lg:text-lg max-w-3xl mx-auto mt-3 text-gray-500 dark:text-gray-400">
          These are some of the open source projects that we have contributed to.
          If you have an open source project that you would like us to contribute
          to, please let us know.
        </p>
        <div class=" w-full h-px max-w-6xl mx-auto my-5"
          style="background-image: linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%);">
        </div>
      </div>

      <div class="h-screen flex flex-col items-center ">
        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink v-for="item in items" :key="item.id" :to="item.route"
            class="w-86 lg:w-98 bg-gradient-to-r from-slate-300 to-slate-500 dark:bg-gradient-to-l dark:from-slate-900 dark:to-slate-700 border rounded-lg border-gray-700 p-5 shadow hover:bg-gradient-to-r hover:from-yellow-200 hover:via-lime-400 hover:to-green-600 dark:hover:bg-gray-700 dark:hover:bg-gradient-to-r hover:border-cyan-50 dark:hover:border-cyan-50  transition">
            <!-- Header -->
            <div class="flex flex-row">
              <img :src="item.image" class="rounded-sm h-5" />
              <p class="ml-3 truncate">
                <span class="text-sm text-gray-500 font-semibold">{{ item.username }}/</span>
                <span class="text-sm text-gray-300 font-semibold">{{ item.title }}</span>
              </p>
            </div>

            <!-- Content -->
            <p class="text-xs truncate text-gray-500 mt-3">
              {{ item.description }}
            </p>
          </RouterLink>
        </div>
      </div>
    </section>
</template>