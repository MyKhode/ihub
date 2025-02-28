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
    title: "Khmer Telegram Chatbot",
    description: "A declarative, efficient, and flexible JS library for building user interfaces.",
    image: "https://www.ikhode.site/_astro/avatar.CIVzSjiG_Z1VvrYM.webp"
  },
  {
    id: 2,
    username: "MyKhode",
    title: "Vue",
    description: "A progressive framework for building user interfaces.",
    image: "https://picsum.photos/40/40?random=2"
  },
  {
    id: 3,
    username: "MyKhode",
    title: "Angular",
    description: "A platform for building mobile and desktop web applications.",
    image: "https://picsum.photos/40/40?random=3"
  },
  {
    id: 4,
    username: "MyKhode",
    title: "Svelte",
    description: "A radical new approach to building user interfaces.",
    image: "https://picsum.photos/40/40?random=4"
  },
  {
    id: 5,
    username: "MyKhode",
    title: "Ember",
    description: "A framework for building ambitious web applications.",
    image: "https://picsum.photos/40/40?random=5"
  },
  {
    id: 6,
    username: "MyKhode",
    title: "Backbone",
    description: "Provides the minimal structure needed for web applications.",
    image: "https://picsum.photos/40/40?random=6"
  }
]);
</script>
<template>
  <div>
    <section
      class="h-fit flex flex-col lg:flex-row items-center justify-center text-white  md:pt-15">
      <div
        class="w-full lg:w-1/2 text-center lg:text-left space-y-6 p-20 px-0 md:px-20">
        <span class="text-4xl truncate">🔥</span>
        <h1
          class="text-3xl md:text-4xl text-black font-bold dark:text-white">Building
          a Better
          Future with AI Technology.</h1>
        <p class="text-lg text-gray-400 max-w-lg">
          A platform where developers and enthusiasts collaborate to create
          powerful Vue.js applications, share components, and contribute to
          open-source projects.
        </p>
        <div
          class=" items-center justify-center lg:justify-start space-x-2 mt-6">
          <router-link to="/signin" v-if="!isSignIn">
            <VButton buttonColor="red"
              type="submit" class="w-fit px-12 py-2.5">
              Sign In
            </VButton>
          </router-link>
          <router-link to="/signin" v-if="isSignIn">
            <VButton buttonColor="red"
              type="submit" class="w-fit px-12 py-2.5">
              Account
            </VButton>
          </router-link>
          <a href="https://bio.ikhode.site" target="_blank" rel="noopener noreferrer"><button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Admin Contact</button></a>
        </div>
      </div>

      <div class="hidden lg:flex w-1/2 justify-center">
        <div
          class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <div class="flex justify-between items-center mb-4">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white">Popular
              AI APP</h3>
            <input type="text" placeholder="Search..."
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none">
          </div>
          <ul class="space-y-3">
            <li
              class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
              <span class="text-gray-900 dark:text-white">vue-router</span>
              <span class="text-gray-500 dark:text-gray-400">📦 15.2K</span>
            </li>
            <li
              class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
              <span class="text-gray-900 dark:text-white">vuex</span>
              <span class="text-gray-500 dark:text-gray-400">📦 12.8K</span>
            </li>
            <li
              class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
              <span class="text-gray-900 dark:text-white">pinia</span>
              <span class="text-gray-500 dark:text-gray-400">📦 8.9K</span>
            </li>
            <li
              class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
              <span class="text-gray-900 dark:text-white">vuetify</span>
              <span class="text-gray-500 dark:text-gray-400">📦 20.1K</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <div class=" w-full h-px max-w-6xl mx-auto my-44 mt-0 pt-0"
      style="background-image: linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%);">
    </div>

    <div>
      <h1 class="font-bold text-center text-2xl md:text-3xl lg:text-4xl">Our
        Open Source</h1>
      <p
        class="text-center text-sm md:text-base lg:text-lg max-w-3xl mx-auto mt-3 text-gray-500 dark:text-gray-400">
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
        <a
          v-for="item in items"
          :key="item.id"
          href="#"
          class="w-72 bg-slate-900 border rounded-lg border-gray-700 p-5 shadow hover:bg-gray-700 transition">
          <!-- Header -->
          <div class="flex flex-row">
            <img :src="item.image" class="rounded h-12" />
            <p class="ml-3">
              <span
                class="text-gray-500 font-semibold">{{item.username}}/</span>
              <span class="text-gray-300 font-semibold">{{ item.title }}</span>
            </p>
          </div>

          <!-- Content -->
          <p class="text-xs text-gray-500 mt-3">
            {{ item.description }}
          </p>
        </a>
      </div>
    </div>
  </div>
</template>
