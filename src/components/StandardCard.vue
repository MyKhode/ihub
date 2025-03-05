<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { emit } from "process";

const props = defineProps<{
    title: string;
    price: number;
    tokens: string;
}>();

const { supabase } = useAuthStore();
const isSignIn = ref(!!supabase.auth.user());
const qrCodeData = ref<string | null>(null);
const transactionId = ref<string | null>(null);
let socket: WebSocket | null = null;

const user = supabase.auth.user();


const countdownTime = ref(60);
const isCountdownActive = ref(false);
let countdownTimer: ReturnType<typeof setTimeout> | null = null;

const startCountdown = () => {
    isCountdownActive.value = true;
    countdownTime.value = 60; // Reset countdown

    const tick = () => {
        if (countdownTime.value > 0) {
            countdownTime.value--;
            countdownTimer = setTimeout(tick, 1000);
        } else {
            isCountdownActive.value = false;
        }
    };

    tick();
};

const resetCountdown = () => {
    if (countdownTimer) {
        clearTimeout(countdownTimer);
    }
    countdownTime.value = 60;
    isCountdownActive.value = false;
};



const handleBuyNow = async () => {
    if (isSignIn.value) {
        try {
            transactionId.value = `txn_${new Date().getTime()}`;
            const response = await axios.post("http://localhost:7777/generate-khqr", {
                amount: props.price,
                transactionId: transactionId.value,
            });

            if (response.data.qrCodeData) {
                qrCodeData.value = response.data.qrCodeData;
                startCountdown();
                isCountdownActive.value = true;
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    } else {
        alert("Please sign in to make a purchase.");
    }
};


onMounted(() => {
    socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "payment_success" && data.transactionId === transactionId.value) {
            resetCountdown();
            isCountdownActive.value = false;

            alert(`Payment successful! Amount: ${data.amount}`);

            // Convert payment amount to tokens
            const newTokens = data.amount * 4000;

            // Fetch current tokens
            const { data: userToken, error } = await supabase
                .from("user_profiles")
                .select("token")
                .eq("user_id", user?.id)
                .single();

            if (error) {
                console.error("Error fetching user token:", error);
                return;
            }

            // Convert token from text to number (default to 0 if null)
            const currentTokens = userToken?.token ? parseInt(userToken.token, 10) : 0;

            // Calculate the new token balance
            const updatedTokens = currentTokens + newTokens;

            // Update token balance in Supabase (convert number back to string for storage)
            const { error: updateError } = await supabase
                .from("user_profiles")
                .update({ token: updatedTokens.toString() }) // Convert back to string
                .eq("user_id", user?.id);

            if (updateError) {
                console.error("Error updating tokens:", updateError);
            } else {
                console.log(`Tokens updated successfully! New Balance: ${updatedTokens}`);
            }
        }
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };
});

const saveQRCode = () => {
    if (!qrCodeData.value) return;

    const link = document.createElement("a");
    link.href = qrCodeData.value;
    link.download = "khqr_code.png"; // Filename for the saved QR code
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



onUnmounted(() => {
    if (socket) {
        socket.close();
    }
});
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
            <!-- QR Code Display -->
            <div v-if="qrCodeData && isCountdownActive"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-5">

                <div
                    class="relative bg-white dark:bg-slate-800 p-5 md:p-10 rounded-lg border border-slate-300 dark:border-slate-600 w-full max-w-md shadow-lg">
                    <!-- QR Code Image -->
                    <img :src="qrCodeData" alt="KHQR Code" class="w-full h-auto max-w-xs mx-auto" />

                    <!-- Close Button -->
                    <button @click="qrCodeData = null; resetCountdown()"
                        class="absolute top-2 right-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                        <i class="fa-solid fa-xmark text-slate-700 dark:text-slate-300 px-1"></i>
                    </button>

                    <!-- Countdown Timer -->
                    <p v-if="isCountdownActive" class="text-center text-red-500 text-sm md:text-lg mt-2">
                        Payment expires in {{ countdownTime }}s
                    </p>

                    <!-- Save QR Code Button -->
                    <button @click="saveQRCode"
                        class="mt-4 flex items-center justify-center gap-2 w-full bg-yellow-600 text-white py-2 rounded-md shadow-md hover:bg-yellow-700">
                        <i class="fa-solid fa-download"></i> Save QR Code
                    </button>
                </div>
            </div>


        </div>
    </div>
</template>