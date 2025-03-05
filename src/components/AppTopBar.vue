<script lang="ts" setup>
import { Ref } from "vue";
import { isDarkKey } from "@/symbols";
import { supabase } from "@/services/supabase";
import { watch, ref, onMounted } from "vue";

const user = supabase.auth.user();

const isSignIn = ref(!!supabase.auth.user());


/* modelValue here refers to whether or not to show side nav drawer */
const props = defineProps<{
  modelValue: boolean;
  tokens: number;
}>();


defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isDark = inject(isDarkKey) as Ref<boolean>;
const toggleDark = useToggle(isDark);
</script>

<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between p-3 shadow bg-gradient-to-l md:bg-gradient-to-r from-yellow-200 via-lime-400 to-green-600 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
    <div class="flex items-center">
      <v-icon-button @click="$emit('update:modelValue', !modelValue)">
        <i-carbon-menu class="h-6 w-6" />
      </v-icon-button>
    </div>
    <div class="flex items-center space-x-4">
      <div v-if="isSignIn" class="flex items-center space-x-1 cursor-pointer" title="User Remaining Tokens">
        <span>Tokens: {{ props.tokens }}</span>
        <i class="fa-solid fa-gem"></i>
      </div>
      <router-link to="/signin" v-else>
        <div class="flex items-center space-x-1 cursor-pointer" title="Sign up now and get 250 tokens free">
          <span>Sign Up Now & Get 250 Tokens FREE</span>
        </div>
      </router-link>
      <v-icon-button @click="toggleDark()" title="Switch Theme">
        <i-carbon-sun class="h-6 w-6 cursor-pointer dark:hidden" />
        <i-carbon-moon class="hidden h-6 w-6 cursor-pointer dark:block" />
      </v-icon-button>
    </div>
  </header>
</template>
