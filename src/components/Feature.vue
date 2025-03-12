<script lang="ts" setup>
import { Ref, inject, ref, onMounted, onUnmounted, watch } from "vue";

const tools = ref([
    {
        title: "Get Sub KH",
        description: "Extract TikTok Subtitle Video is a tool that can extract subtitle from tiktok video.",
        image_url: "https://pictory.ai/wp-content/uploads/2024/02/subtitle-generator.jpg",
        color: "text-cyan-500",
        route: "/apps/extract-subtitle-from-tiktok-video"
    },
    {
        title: "Kla Klouk",
        description: "Fish Prawn Crab Dice Game is a game that can play Fish Prawn Crab Dice Game.",
        image_url: "https://m.media-amazon.com/images/I/4116Xk+PROL.jpg",
        color: "text-cyan-500",
        route: "/games/kla-klouk"
    },
    {
        title: "Get Sub KH",
        description: "Extract TikTok Subtitle Video is a tool that can extract subtitle from tiktok video.",
        image_url: "https://blog.codacy.com/hubfs/coding%20standards_thumbnail.jpeg",
        color: "text-cyan-500",
        route: "/apps/extract-subtitle-from-tiktok-video"
    },
])
const description = ref("The product can provide user experiences by understanding individual preferences and tailoring recommendations or content based on user behavior and historical data.")
</script>
<template>
    <section id="features" class="w-full container mx-auto space-y-6 py-8 md:py-12 lg:py-0">

        <div class="mx-auto flex flex-col items-start space-y-4 text-start">

            <h2 class="text-slate-800 dark:text-slate-50 font-bold text-3xl leading-[1.1] sm:text-3xl md:text-4xl">Features</h2>

            <p class="block md:hidden max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                {{ description.length > 75 ? description.slice(0, 72) + '...' : description }}
            </p>
            <p class="hidden md:block max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                {{ description.length > 150 ? description.slice(0, 155) + '...' : description }}
            </p>

        </div>

        <div class="mx-auto grid cursor-pointer justify-center gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <RouterLink v-for="tool in tools" :to="tool.route" class="relative max-w-lg h-40 md:h-[15rem] flex flex-col my-0 bg-slate-300 dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-200/20 hover:border-slate-50 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-500/20 hover:shadow-lg hover:shadow-cyan-500/10 duration-500">
                <div class="px-1.5 md:px-2 pt-1">
                    <h6 class="mb-2 text-slate-800 dark:text-slate-50 text-base md:text-xl font-semibold">
                        {{ tool.title }}
                    </h6>
                    <p class="block md:hidden text-slate-800 dark:text-slate-50 text-xs md:text-sm leading-normal font-light">
                        {{ tool.description.length > 40 ? tool.description.slice(0, 39) + '...' : tool.description }}
                    </p>
                    <p class="hidden md:block text-slate-800 dark:text-slate-50 text-xs md:text-sm leading-normal font-light">
                        {{ tool.description}}
                    </p>
                </div>
                <div class="relative bg-black h-40 md:h-[15rem] m-1 md:m-2.5 justify-center flex items-end overflow-hidden text-white rounded-md">
                    <img :src="tool.image_url" class="absolute w-full h-full object-cover"
                        alt="card-image" />
                </div>
            </RouterLink>
        </div>

    </section>
</template>