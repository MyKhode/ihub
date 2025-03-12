<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const tool_items = ref([
  {
    id: 1,
    name: "Khmer Telegram Chatbot",
    click: "15.7k"
  },
  {
    id: 2,
    name: "Extract Subtitle From Tikok Video",
    click: "3.1k"
  },
  {
    id: 3,
    name: "Angular",
    click: 0
  },
  {
    id: 4,
    name: "Svelte",
    click: "0"
  },
]);

// const onClick = (id: number) => {
//   const item = toolitems.value.find(item => item.id === id);
//   if (item) item.click++;
// };
const items = ref([
  {
    id: 1,
    username: "MyKhode",
    title: "Extract Subtitle From Tikok Video",
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
</script>
<template>
  <section>
    <!-- component -->
    <div class="relative w-full isolate overflow-hidden">
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
      <div
        class="absolute animate-[pulse_5s_ease-in-out_infinite] left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true">
        <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)">
        </div>
      </div>
      <div
        class="w-full md:w-[80vw] mx-auto px-3 md:px-6 pb-5 md:pb-10 pt-0 md:pt-10 sm:pb-32 lg:flex lg:px-2 lg:py-15">
        <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <!-- <img class="h-11" src="https://isren.org/storage/isren-network.png" alt="Your Company"> -->
          <span class="iconify text-9xl mt-10 absolute" data-icon="meteocons:pollen-grass-fill"></span>
          <div class="mt-10 md:mt-3 lg:mt-6">
            <div class="inline-flex space-x-6 cursor-pointer">
              <RouterLink to="/about"
                class="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-cyan-500 ring-1 ring-inset ring-indigo-500/20">
                What's
                new
              </RouterLink>
              <RouterLink to="/about"
                class="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-800 dark:text-gray-300">
                <span>About us</span>
                <svg class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd" />
                </svg>
              </RouterLink>
            </div>
          </div>
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-slate-700 dark:text-white sm:text-6xl">YOUR GATEWAY TO
            THE WORLD OF
            KNOWLEDGE</h1>
          <p class="mt-6 text-lg leading-8 text-slate-800 dark:text-gray-300">Explore the depths of scientific and
            research work and stay
            informed of the latest developments in knowledge..</p>
          <div class="mt-10 flex items-center gap-x-6">

            <router-link to="/apps"
              class="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
              Get started
            </router-link>
            <a href="#" class="text-sm font-semibold leading-6 text-gray-800 dark:text-white">Learn more <span
                aria-hidden="true">→</span></a>
          </div>
        </div>
        <div class="mx-auto items-center ml-auto mr-32 mt-16 hidden md:flex">
          <BrandLogoAnimation />
        </div>
      </div>
    </div>
  </section>
  <div>
    <section
      class="h-fit px-2 md:px-5 pt-0 md:pt-5 lg:px-8 flex flex-col lg:flex-row items-center justify-center text-white">
      <div class="flex flex-col w-full justify-center items-center pb-10 ">
        <h1
          class="w-full md:w-[80vw] px-1 md:px-8 lg:px-26 font-bold text-start py-3 text-2xl md:text-3xl lg:text-4xl text-black dark:text-white">
          Quick starts</h1>
        <div class="w-full md:w-[80vw] px-2 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div v-for="tool in tools" class="">
            <router-link :to="tool.route" :title="tool.title"
              class="cursor-pointer px-2 border-2 border-slate-500 border-opacity-60 rounded-lg h-23 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-cyan-50 duration-500 flex items-center justify-start">
              <div
                class="w-18 h-18 border-2 border-slate-100 rounded-lg hover:bg-slate-400 bg-slate-500 duration-300 justify-center items-center flex">
                <!-- <i class="fa-brands w-18 text-center text-2xl" :class="tool.color + ' ' + tool.icon"></i> -->
                <span class="iconify text-6xl w-18" :data-icon="tool.icon" :class="tool.color"></span>
              </div>
              <div class="flex flex-col w-full h-20 justify-start pt-2">
                <h1 class="text-start truncate px-3 text-sm md:text-base lg:text-x text-black dark:text-white">
                  {{ tool.title.length > 27 ? tool.title.slice(0, 30) + '...' : tool.title }}
                </h1>
                <p class="text-start text-gray-500 dark:text-gray-400 px-3 text-xs line-clamp-2">
                  {{ tool.description.length > 77 ? tool.description.slice(0, 75) + '...' : tool.description }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <div class="w-full h-px max-w-6xl mx-auto my-0 mt-0 md:mt-8 pt-0"
      style="background-image: linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%);">
    </div>

    <section class="w-full md:w-[80vw] mx-auto px-4 md:px-10 py-0 md:py-10">
      <Feature />
    </section>

    <section class="px-2 md:px-5 py-10 w-full items-center justify-center flex flex-col">
      <div class="w-full md:w-[80vw] px-3 md:px-10">
        <h1 class="font-bold text-start text-2xl md:text-3xl lg:text-4xl">Free Source Code</h1>
        <p class="text-start text-sm md:text-base lg:text-lg mx-auto mt-3 text-gray-500 dark:text-gray-400">
          These are some of the open source projects that we have contributed to.
          If you have an open source project that you would like us to contribute
          to, please let us know.
        </p>
        <div class=" w-full h-px max-w-6xl mx-auto my-5"
          style="background-image: linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%);">
        </div>
      </div>

      <div class="w-full md:w-[80vw] px-3 md:px-10 flex flex-col items-center ">
        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a v-for="item in items" :key="item.id" href="#"
            class="bg-gradient-to-r from-slate-300 to-slate-500 dark:bg-gradient-to-l dark:from-slate-900 dark:to-slate-700 border rounded-lg border-gray-700 p-5 shadow-lg hover:shadow-cyan-500/40 hover:from-slate-200 hover:via-slate-400 hover:to-slate-500 dark:hover:bg-gray-700 hover:border-cyan-50 dark:hover:border-cyan-50 duration-500">
            <!-- Header -->
            <div class="flex flex-row">
              <img :src="item.image" class="rounded h-12" />
              <p class="ml-3">
                <span class="text-gray-500 font-semibold">{{ item.username }}/</span>
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
    </section>
    <section class="px-2 md:px-5 py-10 w-full items-center justify-center flex flex-col">
      <div class="w-full md:w-[80vw] px-3 md:px-10">
        <h1 class="font-bold text-start text-2xl md:text-3xl lg:text-4xl">Why Us?</h1>
        <p class="text-start text-sm md:text-base lg:text-lg mx-auto mt-3 text-gray-500 dark:text-gray-400">
          We provide a fast transaction, secure payment, and a user-friendly interface. You can top up your balance
          quickly and easily, and you can also track your transactions in real-time. We also provide a secure payment
          system, so you don't have to worry about your money. Our user-friendly interface makes it easy for you to
          manage your balance and make transactions.
        </p>
        <div class=" w-full h-px max-w-6xl mx-auto my-5"
          style="background-image: linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%);">
        </div>
      </div>

      <div class="h-screen w-full md:w-[80vw] px-3 md:px-10 flex flex-col items-center ">
        <ServiceCard class="w-full grid md:flex justify-center md:justify-start items-center" />
      </div>
    </section>
  </div>
</template>
