<template>
  <div  @click="$emit('place-bet', title, handleClick)"
    class="relative w-28 h-28 md:w-56 md:h-56 lg:w-64 lg:h-64 cursor-pointer rounded-lg border-4 lg:border-8 border-yellow-500 flex items-center justify-center hover:bg-zinc-600 dark:hover:bg-zinc-800"
    :class="{ 'bg-gray-700 scale-95': isClicked }" :title="title">

    <button type="button" v-if = "betAmount > 0"  @click.stop="$emit('clear-bet', title)" 
      class="z-2 absolute border-2 border-white top-[20px] right-[20px] rounded-md cursor-pointer inline-flex items-center justify-center text-gray-400 hover:border-yellow-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
      <i class="fa-solid fa-xmark text-white text-sm w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 flex items-center justify-center"></i>
    </button>

    <h1 class="absolute top-0 left-1 lg:top-4 lg:left-4 text-white z-3">
      {{ betAmount }} <span class="hidden md:inline"> {{ title }}</span>
    </h1>

    <div class="relative">
      <img :src="imageUrl" :alt="imageAlt" class="w-20 h-20 lg:hover:w-24 lg:hover:h-24 transition-all duration-100">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    imageAlt: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Animal Roll'
    },
    betAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isClicked: false,
      isMobile: false
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
  },
  watch: {
    imageUrl() {
      this.checkMobile()
    },
    imageAlt() {
      this.checkMobile()
    },
    title() {
      this.checkMobile()
    },
    betAmount() {
      this.checkMobile()
    }
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 1024 // Tailwind's lg breakpoint
    },
    clearBets () {
      this.$emit('bet:clear');
    },
    handleClick() {
      if (this.isMobile) {
        this.isClicked = true
        setTimeout(() => {
          this.isClicked = false
        }, 200)
      }
      // Add your actual click handling logic here
    }
  }
}
</script>
