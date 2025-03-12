<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import KlaKloukCard from '@/app/KlaKlouk/KlaKloukCard.vue'
import { io } from 'socket.io-client'
import Notification from '@/components/Notification.vue'
import { useAuthStore } from '@/stores/auth'
import { eventBus } from '@/eventBus'
import Breadcrumb from '@/components/Breadcrumb.vue';



const { supabase } = useAuthStore()
const user = supabase.auth.user()

const isServerError = ref(false)
const errorMessage = ref('Unable to connect to the server. Please try again later.')

const socket = io('http://localhost:3001')
const messages = ref([])
const newMessage = ref('')

// Betting logic
const symbols = ['deer', 'calabash', 'rooster', 'fish', 'crab', 'shrimp']
const bets = ref({})
const betAmount = ref(5)
const balance = ref(0)
const currentToken = ref(0)

const dice_result_msg = ref([]);

// Fetch user token from Supabase
const fetchToken = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
        .from("user_profiles")
        .select("token")
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching token:", error);
        return;
    }

    if (data) {
        balance.value = data.token;
        currentToken.value = data.token;
    }
}

// Function to update the token in Supabase after winnings
const updateUserToken = async (newBalance) => {
    if (!user?.id) return;

    const { error } = await supabase
        .from("user_profiles")
        .update({ token: newBalance })
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating token:", error);
    }
}

// Game state tracking
const gameState = ref({
    status: 'waiting',
    countdown: 10,
    results: null
})

// Function to clear bets and refund
const clearBets = (symbol) => {
    if (bets.value[symbol]) {
        balance.value += bets.value[symbol];
        // currentToken.value += bets.value[symbol];
        delete bets.value[symbol];
        // console.log(`Cleared bet for: ${symbol}`, bets.value);
    }
}

// Function to place a bet
const placeBet = async (symbol) => {
    await fetchToken(); // Ensure latest token balance is fetched

    if (gameState.value.status !== 'waiting' && gameState.value.countdown <= 2) return;

    if (betAmount.value > balance.value || betAmount.value > currentToken.value) {
        console.warn("Not enough balance to place bet!");
        return;
    }

    if (!bets.value[symbol]) {
        bets.value[symbol] = 0;
    }

    bets.value[symbol] += betAmount.value;
    balance.value -= betAmount.value; // Deduct balance
};

const calculateWinnings = async (results) => {
    if (!Array.isArray(results)) {
        console.error("Invalid results received:", results);
        return;
    }

    let initialBalance = currentToken.value;
    console.log("Initial Balance:", initialBalance);
    let winnings = 0;
    let winTokenBets = 0;
    let lostTokenBets = 0;
    winningSymbols.value = [];

    // Track winning and lost bets
    const tempBets = { ...bets.value };

    results.forEach((result) => {
        if (tempBets[result]) {
            const count = results.filter(r => r === result).length; // Count occurrences
            const winAmount = tempBets[result] * count; // Multiply bet by occurrence count

            winnings += winAmount;
            winTokenBets += winAmount;
            delete tempBets[result]; // Remove winning bet
        }
    });

    // Remaining bets are lost
    Object.keys(tempBets).forEach(symbol => {
        lostTokenBets += tempBets[symbol];
    });

    // Update balance correctly
    balance.value = initialBalance - lostTokenBets + winTokenBets;

    // Update user token in Supabase
    await updateUserToken(balance.value);

    // Clear bets
    bets.value = {};
    messages.value.unshift(`🎲 Dice Result: ${results}`);
    eventBus.emit("emoji-event", winnings);

    setTimeout(() => {
        clearWinningSymbols();
    }, 8000);

    console.log(`Results: ${results.join(', ')}, Winnings: ${winnings}, Lost Bets: ${lostTokenBets}, Balance: ${balance.value}`);
};


// Function to clear winning symbols
const clearWinningSymbols = () => {
    winningSymbols.value = [];
    // console.log("Winning symbols cleared.");
}

// Send chat message
const sendMessage = () => {
    if (newMessage.value.trim()) {
        socket.emit('chat message', newMessage.value);
        newMessage.value = '';
        startAnimation();
    }
}

// Start dice roll
const rollDice = () => {
    socket.emit('roll-dice');
}

// Watchers
watch(() => betAmount.value, (newValue) => {
    if (newValue < 0) betAmount.value = 0;
    if (newValue > balance.value) betAmount.value = balance.value;
})

// Lifecycle hooks
onMounted(async () => {
    await fetchToken();

    socket.on('chat message', (message) => {
        messages.value.unshift(message);
    });

    socket.on('dice-results', (data) => {
        console.log("Received dice results:", data);
        calculateWinnings(data);
        dice_result_msg.value = data;
        winningSymbols.value = data;
    });

    socket.on('connect_error', (err) => {
        console.error('Connection error:', err);
        isServerError.value = true;
        errorMessage.value = 'Unable to connect to the server. Please try again later.';
        cleanupSocket();
    });

    socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        isServerError.value = true;
        errorMessage.value = 'You have been disconnected from the server.';
        cleanupSocket();
    });

    socket.on('game-state', (state) => {
        gameState.value = state;
    });
});

function cleanupSocket() {
    socket.off('chat message');
    socket.off('dice-results');
    socket.off('game-state');
    stopAnimation();
    // console.log("Socket listeners removed due to server error.");
}

onBeforeUnmount(() => {
    socket.disconnect();
});

// Animation logic
const currentSymbol = ref(symbols[0]);
const winningSymbols = ref([]);
let animationInterval = null;

const startAnimation = () => {
    animationInterval = setInterval(() => {
        const currentIndex = symbols.indexOf(currentSymbol.value);
        currentSymbol.value = symbols[(currentIndex + 1) % symbols.length];
    }, 700);
}

const stopAnimation = () => {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        currentSymbol.value = symbols[0];
    }
}

watch(() => gameState.value.status, (newStatus) => {
    if (newStatus === 'countdown') {
        startAnimation();
        // console.log("Countdown started, running animation...");
    } else if (newStatus === 'waiting') {
        // console.log("Waiting for bets, no animation...");
    }
});

onMounted(() => {
    stopAnimation();
});

onBeforeUnmount(() => {
    stopAnimation();
});

const breadcrumbs = ref([
  { name: "Home", url: "/" },
  { name: "All Apps", url: "/apps" },
  { name: "Fish Prawn Crab Dice Game", url: "/games/kla-klouk" },
]);
</script>

<template>
    <div class="relative flex flex-col items-center justify-center h-[100vh]">
        <Breadcrumb :breadcrumbs="breadcrumbs" class="absolute top-0 left-0 md:top-5 md:left-5"/>
        <!-- <ServerErrorAlert v-if="isServerError" :message="errorMessage" /> -->
        <Notification v-if="isServerError" :isNotificational="true" :value="errorMessage" :typeNotification="'error'" />
        <!-- Game Controls -->
        <div
            class="mt-15 lg:mt-0 flex flex-col items-center justify-center text-center space-y-1 lg:flex-row md:space-y-0 lg:gap-2">
            <!-- Roll Dice Button -->
            <button @click="rollDice" :disabled="gameState.status !== 'waiting'"
                class="px-6 py-2 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors">
                {{ gameState.status === 'countdown' ? `Rolling in ${gameState.countdown}s...` : 'Roll Dice 🎲' }}
            </button>

            <!-- Dice Result Images (only when waiting) -->
            <div v-if="gameState.status === 'waiting'" class="flex items-center justify-center gap-2">
                <img v-for="(symbol, i) in dice_result_msg" :key="i" :src="`/images/${symbol}.svg`" :alt="symbol" title="dice result image"
                    class="w-10 h-10 border-2 border-yellow-500 rounded-md p-1.5 cursor-pointer hover:bg-slate-100 transition-all">
            </div>

            <!-- Countdown Placeholder Images -->
            <div v-if="gameState.status === 'countdown' || gameState.countdown > 0" class="flex items-center justify-center gap-2">
                <img src="/public/images/question_mark.png" alt="dice kla klouk question mark box?" title="dice kla klouk question mark box?" class="w-10 h-10 cursor-pointer animate-pulse">
                <img src="/public/images/question_mark.png" alt="dice kla klouk question mark box?" title="dice kla klouk question mark box?" class="w-10 h-10 cursor-pointer animate-pulse">
                <img src="/public/images/question_mark.png" alt="dice kla klouk question mark box?" title="dice kla klouk question mark box?" class="w-10 h-10 cursor-pointer animate-pulse">
            </div>
        </div>


        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4 mt-5 select-none">
            <KlaKloukCard v-for="symbol in symbols" :key="symbol" :imageUrl="`/public/images/${symbol}.svg`"
                :imageAlt="symbol" :title="symbol" :betAmount="bets[symbol] || 0" @place-bet="placeBet"
                @clear-bet="clearBets" :class="{
                    'highlighted': gameState.status === 'countdown' && currentSymbol === symbol,
                    'scale-up': winningSymbols.includes(symbol),
                    'border-gray-400': winningSymbols.length > 0 && !winningSymbols.includes(symbol)
                }" class="klaklouk" />
        </div>

        <div class="flex flex-col items-center space-y-4 w-full max-w-2xl mx-auto p-4">
            <div class="flex items-center gap-3 w-full">
                <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..."
                    class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                <button @click="sendMessage"
                    class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Send
                </button>
            </div>

            <div class="w-full space-y-2 ">
                <div v-for="(msg, index) in messages" :key="index"
                    class="p-4 cursor-pointer border-b border-gray-300 dark:border-gray-700 transition-colors duration-200"
                    title="User Message">
                    <p class="text-gray-800 dark:text-white text-sm md:text-base">{{ msg }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
/* prevent double click to zoom in or out */
html {
    touch-action: manipulation;
}

.highlighted {
    background-color: rgba(255, 215, 0, 0.5);
    transition: background-color 0.5s ease-in-out;
    border: 2px solid gold;
    box-shadow: 0 0 10px gold;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.02);
    }

    100% {
        transform: scale(1);
    }
}

.scale-up {
    animation: scaleUp 4s ease-in-out;
    /* Set to 3s for testing */
    animation-fill-mode: forwards;
    /* Keeps the final state of the animation */
    border: 8px solid green;
}

.dark .scale-up {
    border: 8px solid green;
}

@keyframes scaleUp {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.02);
    }
    75% {
        transform: scale(1.06);
    }
    100% {
        transform: scale(1);
    }
}


.KlaKloukCard {
    transition: transform 0.3s ease-in-out;
}
</style>