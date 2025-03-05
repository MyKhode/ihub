<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

// Props for the product
const props = defineProps<{
    title: string;
    price: number;
    tokens: string;
}>();

// Store reference and user sign-in status
const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());

// QR code state
const qrCodeData = ref<string | null>(null);

// Function to handle Buy Now button click
const handleBuyNow = async () => {
    if (isSignIn.value) {
        try {
            // Call the backend API to generate the KHQR QR code
            const response = await axios.post('http://localhost:7777/generate-khqr', {
                amount: props.price,
                transactionId: `txn_${new Date().getTime()}`, // Generating a unique transaction ID
            });

            if (response.data.qrCodeData) {
                // Set the QR code data to be displayed
                qrCodeData.value = response.data.qrCodeData;
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    } else {
        alert("Please sign in to make a purchase.");
    }
};
</script>
<template>
    <div>
        <div
            class="flex flex-col rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm p-8 my-0 border border-slate-300 dark:border-slate-600">
            <div
                class="pb-8 m-0 mb-8 text-center text-slate-900 dark:text-slate-100 border-b border-slate-300 dark:border-slate-600">
                <p class="text-sm uppercase font-semibold text-slate-700 dark:text-slate-300">
                    {{ props.title }}
                </p>
                <h1 class="flex justify-center gap-1 mt-4 font-bold text-slate-900 dark:text-white text-6xl">
                    <span class="text-3xl"></span>
                    {{ props.price.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}
                    <!-- <span class="self-end text-3xl">Plan</span> -->
                </h1>
            </div>
            <div class="p-0">
                <ul class="flex flex-col gap-4">
                    <li class="flex items-center gap-4">
                        <span
                            class="p-1 border rounded-full border-slate-400 dark:border-slate-500 bg-slate-300 dark:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-4 h-4 text-slate-700 dark:text-slate-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                            </svg>
                        </span>
                        <p class="text-slate-700 dark:text-slate-300">
                            {{ props.price.toLocaleString("en-US", { style: "currency", currency: "USD" }) }} = {{
                            props.tokens }} tokens
                        </p>
                    </li>

                    <li class="flex items-center gap-4">
                        <span
                            class="p-1 border rounded-full border-slate-400 dark:border-slate-500 bg-slate-300 dark:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-4 h-4 text-slate-700 dark:text-slate-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                            </svg>
                        </span>
                        <p class="text-slate-700 dark:text-slate-300">
                            No Refunds
                        </p>
                    </li>

                </ul>
            </div>
            <div class="p-0 mt-12">
                <button
                    class="min-w-32 w-full rounded-md bg-slate-900 dark:bg-white py-2 px-4 border border-transparent text-center text-sm text-white dark:text-slate-600 transition-all shadow-md hover:shadow-lg focus:bg-slate-900/90 dark:focus:bg-white/90 focus:shadow-none active:bg-slate-900/90 dark:active:bg-white/90 hover:bg-slate-900/90 dark:hover:bg-white/90 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button" @click="handleBuyNow">
                    Buy Now
                </button>
            </div>
            <!-- Display QR Code if available -->
            <div v-if="qrCodeData" class="mt-8">
                <img :src="qrCodeData" alt="KHQR Code" />
            </div>
        </div>
    </div>
</template>