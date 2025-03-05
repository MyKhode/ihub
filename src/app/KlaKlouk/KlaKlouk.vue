<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import KlaKloukCard from '@/app/KlaKlouk/KlaKloukCard.vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')
const messages = ref([])
const newMessage = ref('')

//start bet code
const symbols = ['deer', 'calabash', 'rooster', 'fish', 'crab', 'shrimp']
const bets = ref({})
const betAmount = ref(5)
const balance = ref(1000)

function clearBets(symbol) {
    if (bets.value[symbol]) {
        balance.value += bets.value[symbol] // Refund the bet
        delete bets.value[symbol] // Remove the bet
        console.log(`Cleared bet for: ${symbol}`, bets.value)
    }
}


function placeBet(symbol) {
    if (gameState.value.status === 'waiting') {
        if (balance.value >= betAmount.value) {
            if (!bets.value[symbol]) {
                bets.value[symbol] = 0
                console.log(bets.value)
            }
            bets.value[symbol] += betAmount.value
            balance.value -= betAmount.value
        }


    }
}
function calculateWinnings(results) {
    if (!Array.isArray(results)) {
        console.error("Invalid results received:", results);
        return;
    }

    let winnings = 0;
    winningSymbols.value = []; // Clear previous winning symbols

    results.forEach((result, index) => {
        setTimeout(() => {
            winningSymbols.value = [result]; // Show one at a time
            console.log(`Showing result: ${result}`);

            if (bets.value[result]) {
                const count = results.filter(r => r === result).length;
                winnings += bets.value[result] * count;
                delete bets.value[result];
            }

            if (index === results.length - 1) {
                // Refund remaining bets after last result
                setTimeout(() => {
                    Object.keys(bets.value).forEach(symbol => {
                        balance.value += bets.value[symbol];
                    });
                    bets.value = {};
                    console.log("All bets cleared, ready for new round", bets.value);
                    messages.value.unshift("🎲 Dice Result: " + results);
                }, 2000);
            }
        }, index * 2000); // Delay each result by 2s
    });

    balance.value += winnings;
    
    setTimeout(() => {
        clearWinningSymbols();
    }, 6000); // Adjust the delay as needed

    console.log(`Results: ${results.join(', ')}, Winnings: ${winnings}`);
}




function clearWinningSymbols() {
    winningSymbols.value = []; // Clear the displayed winning symbols
    console.log("Winning symbols cleared.");
}


const gameState = ref({
    status: 'waiting',
    countdown: 10,
    results: null
})

// Send message function
const sendMessage = () => {
    if (newMessage.value.trim()) {
        socket.emit('chat message', newMessage.value)
        newMessage.value = ''
        startAnimation();
    }
}

// Start dice roll
const rollDice = () => {
    socket.emit('roll-dice')
}

watch(
    () => betAmount.value,
    (newValue) => {
        if (newValue < 0) betAmount.value = 0
        if (newValue > balance.value) betAmount.value = balance.value
    }
)

// Lifecycle hooks
onMounted(() => {
    socket.on('chat message', (message) => {
        messages.value.unshift(message)
    })

    socket.on('dice-results', (data) => {
        console.log("Received dice results:", data, typeof data);
        calculateWinnings(data);
        winningSymbols.value = data
    });


    socket.on('game-state', (state) => {
        gameState.value = state
    })
})

onBeforeUnmount(() => {
    socket.disconnect()
})


// -----------------------------------------------
const currentSymbol = ref(symbols[0]) // Track the current symbol
const winningSymbols = ref([]) // Track the winning symbols
let animationInterval = null // Store the interval ID

// Function to start the animation
const startAnimation = () => {
    animationInterval = setInterval(() => {
        const currentIndex = symbols.indexOf(currentSymbol.value)
        currentSymbol.value = symbols[(currentIndex + 1) % symbols.length]
    }, 400) // Change symbol every 400ms
}

// Function to stop the animation
const stopAnimation = () => {
    if (animationInterval) {
        clearInterval(animationInterval)
        animationInterval = null
        currentSymbol.value = symbols[0] // Reset to the first symbol
    }
}

// Watch for game state changes
watch(
    () => gameState.value.status,
    (newStatus) => {
        if (newStatus === 'countdown') {
            startAnimation() // Start animation during countdown
            console.log("Countdown started, running animation...")
        } else if (newStatus === 'waiting') {

            console.log("Waiting for bets, no animation...")
        }
    }
)

onMounted(() => {
    stopAnimation() // Ensure no animation runs on initial load
})

onBeforeUnmount(() => {
    stopAnimation() // Clean up on unmount
})

</script>


<template>
    <div class="flex flex-col items-center justify-center">
        <!-- Game Controls -->
        <div class="mt-5 text-center space-y-4">
            <button @click="rollDice" :disabled="gameState.status !== 'waiting'"
                class="px-6 py-2 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors">
                {{ gameState.status === 'countdown'
                    ? `Rolling in ${gameState.countdown}s...`
                    : 'Roll Dice' }}
            </button>


            <!-- <div v-if="gameState.results" class="text-white text-xl animate-pulse">
                Results:
                <span class="text-yellow-400">
                    {{ gameState.results.join(', ') }}
                </span>
            </div> -->
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4 mt-5 select-none">
            <KlaKloukCard v-for="symbol in symbols" :key="symbol" :imageUrl="`/public/images/${symbol}.svg`"
                :imageAlt="symbol" :title="symbol" :betAmount="bets[symbol] || 0" @place-bet="placeBet"
                @clear-bet="clearBets" :class="{
                    'highlighted': gameState.status === 'countdown' && currentSymbol === symbol,
                    'scale-up': winningSymbols.includes(symbol)
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
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

.scale-up {
    animation: scaleUp 3s ease-in-out;
    /* Set to 3s for testing */
    animation-fill-mode: forwards;
    /* Keeps the final state of the animation */
    border: 4px solid red;
}

@keyframes scaleUp {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}


.KlaKloukCard {
    transition: transform 0.3s ease-in-out;
}
</style>