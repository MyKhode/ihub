<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import FileDownload from "@/components/FileDownload.vue";

const videoUrl = ref("");
const subtitles = ref("");
const loading = ref(false);
const errorMessage = ref("");

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
      "http://localhost:2025/get_subtitle",
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
  <div class="flex flex-col gap-4 py-20 max-w-2xl mx-auto h-[82vh] overflow-y-scroll overflow-x-hidden">
    <FileDownload />
    <FileDownload />
    <FileDownload />
    <FileDownload />
    <FileDownload />
    <FileDownload />
    <FileDownload />
    <FileDownload />
    <FileDownload />
  </div>
  <div class="absolute bottom-0 md:bottom-20 left-0 right-0 max-w-2xl mx-auto">
    <form>
      <label for="chat" class="sr-only">Your message</label>
      <div class="flex items-center py-2 px-3 bg-gray-50 rounded-sm lg:rounded-lg dark:bg-gray-700">
        <button type="button"
          class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
        <button type="button"
          class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
        <textarea id="chat" rows="1"
          class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."></textarea>
        <button
          class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </form>

    <p class="mt-5 text-sm text-gray-500 dark:text-gray-400 hidden md:block text-sm lg:text-base">This textarea chatroom
      component is part of a larger, open-source library of Tailwind CSS
      components. Learn
      more
      by going to the official <a class="text-blue-600 hover:underline" href="#" target="_blank">Flowbite
        Documentation</a>.
    </p>
  </div>
</template>

<style>
body {
  background-color: #f3f4f6;
}
</style>