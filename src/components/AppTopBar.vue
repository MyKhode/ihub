<script lang="ts" setup>
import { Ref, inject, ref, onMounted, onUnmounted, watch } from "vue";
import { isDarkKey } from "@/symbols";
import { supabase } from "@/services/supabase";
import { eventBus } from "@/eventBus";
import Notification from "./Notification.vue";

// Define Props
const props = defineProps<{ modelValue: boolean }>();

// Define Emits
const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

// Theme Mode
const isDark = inject(isDarkKey) as Ref<boolean>;
const toggleDark = () => (isDark.value = !isDark.value);

// User Authentication & Tokens
const user = supabase.auth.user();
const isSignIn = ref(!!user);
const token = ref<number>(0);
// const isNotificationFromPurchase = ref(false);

// 🔥 Reactive Notification State
// const notification = ref(false);
// const notificationMessage = ref("Hi, welcome to Research and Development Center");
// const typeNotification = ref("success");

const isLoading = ref(false);


/**
 * Fetch user tokens from database
 */
const fetchToken = async (): Promise<void> => {

  // if (isNotificationFromPurchase.value == false) typeNotification.value = "happy";;
  isLoading.value = true;
  if (!user) return; // Ensure user is signed in

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("token")
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    if (data) token.value = data.token;

    isLoading.value = false;

    // console.log("User Tokens:", token.value);

    // 🔥 Update Notification Reactively
    // if (isNotificationFromPurchase.value == true) {
    //   notificationMessage.value = `You have purchased ${token.value} tokens!`;
    // }
    // else {
    //   notificationMessage.value = `Your current tokens now is = ${token.value} ...`;
    // }
    // notification.value = true;

    // // console.log("Notification value:", notification.value);

    // // Auto-hide after 2 seconds
    // setTimeout(() => {
    //   notification.value = false;
    // }, 2000);

    // isNotificationFromPurchase.value = false;


  } catch (err) {
    console.error("Error fetching token:", err);
  }
};

/**
 * Handles custom event
 */
const EmojiEvent = async (data: any) => {
  // console.log("Received event:", data);
  // isNotificationFromPurchase.value = false;
  await fetchToken();
};
const handlePurchaseTokenEvent = async (data: any) => {
  // console.log("Received event:", data);
  // isNotificationFromPurchase.value = true;
  await fetchToken();
};

// Lifecycle Hooks
onMounted(() => {
  fetchToken();
  eventBus.on("emoji-event", EmojiEvent);
  eventBus.on("purchase-token-event", handlePurchaseTokenEvent);
});

onUnmounted(() => {
  eventBus.off("emoji-event", EmojiEvent);
  eventBus.off("purchase-token-event", handlePurchaseTokenEvent);
});
</script>


<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between p-3 shadow bg-gradient-to-l md:bg-gradient-to-r bg-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
    <!-- Menu Button -->
    <v-icon-button @click="emit('update:modelValue', !props.modelValue)">
      <span class="iconify text-3xl font-semibold text-gray-900 dark:text-white" data-icon="mingcute:menu-fill"></span>
    </v-icon-button>
    <!-- <Notification v-if="notification" :value="notificationMessage" :typeNotification="typeNotification"
      :isNotificational="notification" /> -->

    <!-- User Token Info & Theme Toggle -->
    <div class="flex items-center space-x-4">
      <div v-if="isSignIn" title="User Remaining Tokens">
        <div role="status" v-if="isLoading">
          <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-rose-600"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="mx-3">Loading...</span>
        </div>
        <router-link v-else to="/top-up" class="flex items-center space-x-1 cursor-pointer">
          <span>{{ new Intl.NumberFormat('en-KH', { style: 'currency', currency: 'KHR' }).format(token) }}</span>
          <span class="iconify text-2xl font-semibold text-gray-900 dark:text-white"
            data-icon="mingcute:binance-coin-bnb-fill"></span>
        </router-link>
      </div>

      <router-link v-else to="/signin">
        <div class="flex items-center space-x-1 cursor-pointer" title="Sign up now and get 250 tokens free">
          Sign Up
        </div>
      </router-link>

      <!-- Theme Switch -->
      <!-- <v-icon-button @click="toggleDark()" title="Switch Theme">
        <i-carbon-sun class="h-6 w-6 cursor-pointer dark:hidden" />
        <i-carbon-moon class="hidden h-6 w-6 cursor-pointer dark:block" />
      </v-icon-button> -->
      <button @click="toggleDark()" class="flex items-center space-x-1 cursor-pointer" title="Sign Out">
        <span class="iconify text-4xl font-semibold text-gray-900 dark:text-white dark:hidden"
          data-icon="meteocons:haze-day-fill"></span>
        <span class="iconify text-4xl font-semibold text-gray-900 dark:text-white hidden dark:block"
          data-icon="meteocons:haze-night-fill"></span>
      </button>
    </div>
  </header>
</template>
