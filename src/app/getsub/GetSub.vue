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
  <div class="relative w-full">
    <div class="flex flex-col gap-4 py-20 max-w-2xl mx-auto h-[81vh] overflow-y-scroll overflow-x-hidden">
      <FileDownload />
      <FileDownload />
      <FileDownload />
      <FileDownload />
    </div>
    <div class="absolute z-25 bottom-0 left-0 right-0 max-w-2xl mx-auto">
      <div>
        <form>
          <label for="chat" class="sr-only">Your message</label>
          <div class="flex items-center py-2 px-3 bg-gray-50 rounded-sm lg:rounded-lg dark:bg-gray-700">
            <button
              class="inline-flex justify-center p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" title="Our TikTok Official Account">
              <i class="fa-brands fa-tiktok"></i>
            </button>
            <button type="button" disabled
              class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-not-allowed hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
              🔥
            </button>

            <textarea id="chat" rows="1"
              class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type your video url here..." v-model="videoUrl" required></textarea>
            <button @click.prevent ="fetchSubtitles" type="submit"
              class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<style>
body {
  background-color: #f3f4f6;
}
</style>