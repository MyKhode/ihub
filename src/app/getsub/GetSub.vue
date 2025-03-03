<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

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
    const response = await axios.get(`http://127.0.0.1:5000/get_subtitles?u=${videoId}&format=srt&hl=khm`);
    subtitles.value = response.data;
  } catch (error) {
    errorMessage.value = "Failed to fetch subtitles. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold text-center mb-4">TikTok Subtitle Extractor</h1>
    <p class="text-gray-600 text-center mb-4">Enter a TikTok video link to fetch its subtitles.</p>
    
    <div class="mb-4">
      <label for="videoUrl" class="block text-sm font-medium text-gray-700">TikTok Video URL</label>
      <input v-model="videoUrl" type="text" id="videoUrl" class="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Paste TikTok link here...">
    </div>
    
    <button @click="fetchSubtitles" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
      {{ loading ? "Fetching..." : "Get Subtitles" }}
    </button>
    
    <p v-if="errorMessage" class="text-red-500 mt-2 text-center">{{ errorMessage }}</p>
    
    <div v-if="subtitles" class="mt-6 p-4 border rounded-md bg-gray-100">
      <h2 class="text-lg font-semibold">Subtitles:</h2>
      <pre class="text-sm whitespace-pre-wrap">{{ subtitles }}</pre>
    </div>
  </div>
</template>

<style>
body {
  background-color: #f3f4f6;
}
</style>