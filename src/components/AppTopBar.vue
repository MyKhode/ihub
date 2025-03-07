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
const isNotificationFromPurchase = ref(false);

// 🔥 Reactive Notification State
const notification = ref(false);
const notificationMessage = ref("Hi, welcome to Research and Development Center");
const typeNotification = ref("success");


/**
 * Fetch user tokens from database
 */
const fetchToken = async (): Promise<void> => {

  if (isNotificationFromPurchase.value == false) typeNotification.value = "happy";;

  if (!user) return; // Ensure user is signed in

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("token")
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    if (data) token.value = data.token;

    // console.log("User Tokens:", token.value);

    // 🔥 Update Notification Reactively
    if (isNotificationFromPurchase.value == true) {
      notificationMessage.value = `You have purchased ${token.value} tokens!`;
    }
    else {
      notificationMessage.value = `Your current tokens now is = ${token.value} ...`;
    }
    notification.value = true;

    // console.log("Notification value:", notification.value);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      notification.value = false;
    }, 4000);

    isNotificationFromPurchase.value = false;

  } catch (err) {
    console.error("Error fetching token:", err);
  }
};

/**
 * Handles custom event
 */
const EmojiEvent = async (data: any) => {
  // console.log("Received event:", data);
  isNotificationFromPurchase.value = false;
  await fetchToken();
};
const handlePurchaseTokenEvent = async (data: any) => {
  // console.log("Received event:", data);
  isNotificationFromPurchase.value = true;
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
    class="sticky top-0 z-30 flex items-center justify-between p-3 shadow bg-gradient-to-l md:bg-gradient-to-r from-yellow-200 via-lime-400 to-green-600 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">

    <!-- Menu Button -->
    <v-icon-button @click="emit('update:modelValue', !props.modelValue)">
      <i-carbon-menu class="h-6 w-6" />
    </v-icon-button>
    <Notification v-if="notification" :value="notificationMessage" :typeNotification="typeNotification" :isNotificational="notification" />

    <!-- User Token Info & Theme Toggle -->
    <div class="flex items-center space-x-4">
      <div v-if="isSignIn" class="flex items-center space-x-1 cursor-pointer" title="User Remaining Tokens">
        <span>Tokens: {{ token }}</span>
        <i class="fa-solid fa-gem"></i>
      </div>

      <router-link v-else to="/signin">
        <div class="flex items-center space-x-1 cursor-pointer" title="Sign up now and get 250 tokens free">
          <span>Sign Up Now & Get 250 Tokens FREE</span>
        </div>
      </router-link>

      <!-- Theme Switch -->
      <v-icon-button @click="toggleDark()" title="Switch Theme">
        <i-carbon-sun class="h-6 w-6 cursor-pointer dark:hidden" />
        <i-carbon-moon class="hidden h-6 w-6 cursor-pointer dark:block" />
      </v-icon-button>
    </div>
  </header>
</template>
