<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import FileDownload from "@/components/FileDownload.vue";
import { time } from "console";

const videoUrl = ref("");
const subtitles = ref("");
const loading = ref(false);
const errorMessage = ref("");

const chatMsgSavedData = ref([
    {
        id: 1,
        message: "Hello, how can I help you?",
        sender: "bot",
        time: "12:00",
        nameFile: "file1.txt",
        size: "2.5 MB",
        line: "1"
    }
]);

const extractVideoId = (url: string) => {
    const match = url.match(/tiktok\.com\/(?:.*?video\/|v\/)(\d+)/);
    return match ? match[1] : null;
};
const fetchSubtitles = async () => {
    const videoId = extractVideoId(videoUrl.value);
    if (!videoId) {
        errorMessage.value = "Invalid TikTok URL. Please enter a valid video link.";
        return;
    }

    errorMessage.value = "";
    loading.value = true;
    subtitles.value = "";

    try {
        const response = await axios.post(
            "http://192.168.100.2:2025/get_subtitle",
            {
                url: videoUrl.value,  // Send the full TikTok URL
                lang: "khm-KH",  // Specify the language
            }
        );

        if (response.data.download_url) {
            subtitles.value = "Subtitles are ready! Click below to download.";
            // Optionally, automatically create a link for the user to download
            const downloadLink = document.createElement('a');
            downloadLink.href = response.data.download_url;
            // downloadLink.download = true; // Forces the browser to download the file
            downloadLink.click(); // Trigger download
        }
    } catch (error) {
        errorMessage.value = "Failed to fetch subtitles. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col w-full h-full justify-start mt-5 lg:mt-0 lg:justify-center items-center">
        <div class="w-full px-3 md:px-60 lg:px-70">
            <div class="w-full pb-5 justify-center items-center">
                <h1 class="font-bold text-start text-2xl md:text-3xl lg:text-4xl">Extract Subtitle Generator (Specialized for Khmer Language)</h1>
                <p class="text-start text-gray-500 dark:text-gray-400 text-sm md:text-base lg:text-lg">KhGetSub is a web application that can download subtitles directly from Tiktok, Youtube, VIU, Viki, Vlive and more. We supports downloading all subtitles/captions formats such as subtitle or SRT format.</p>
            </div>
            <div class="relative w-full justify-center items-center">
                <label for="aiPromt" class="sr-only">ai prompt</label>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"
                    class="absolute left-3 bottom-[calc(50%-25px)] size-4 -translate-y-1/2 fill-black dark:fill-white">
                    <path fill-rule="evenodd"
                        d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
                        clip-rule="evenodd" />
                </svg>
                <input id="aiPromt" type="text"
                    class="w-full z-5 border-outline bg-neutral-50 border border-neutral-300 rounded-sm px-2 py-2 pl-10 pr-24 text-sm text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-75 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:focus-visible:outline-white"
                    name="prompt" placeholder="Paste your TikTok video link ..." />
                <button type="button"
                    class="absolute right-3 bottom-[calc(50%-35px)] -translate-y-1/2 cursor-pointer bg-black rounded-sm px-2 py-1 text-xs tracking-wide text-neutral-100 transition hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:opacity-100 active:outline-offset-0 dark:bg-white dark:text-black dark:focus-visible:outline-white">
                    Generate
                </button>

                <!-- <div
                    class="absolute z-0 hidden md:block top-[-40px] left-[-40px] rounded-3xl w-[calc(100%+70px)] h-30 border-4 border-slate-500 border-opacity-75">
                </div>
                <div
                    class="absolute z-0 hidden md:block top-[-70px] left-[-100px] rounded-4xl w-[calc(120%)] h-45 border-4 border-slate-500 border-opacity-50">
                </div> -->
            </div>

            <div class="w-full h-20 mt-5">
                <TagLink buttonColor="cyan" title="@kla_klouk" textColor="white" url="https://www.tiktok.com/@kla_klouk"/>    
                <TagLink buttonColor="pink" title="@open_source_code" textColor="white" url="https://www.tiktok.com/@kla_klouk"/>    
                <TagLink buttonColor="indigo" title="@tiktok" textColor="white" url="https://www.tiktok.com/@kla_klouk"/>    
            </div>
        </div>
    </div>

</template>