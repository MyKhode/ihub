<script setup lang="ts">
const services = ref([
    {
        icon: '<path d="M8.66699 12.8162L11.3501 15.4993C11.5616 15.7107 11.9043 15.7109 12.1158 15.4997L17.8753 9.75033M13.0003 23.8337C7.01724 23.8337 2.16699 18.9834 2.16699 13.0003C2.16699 7.01724 7.01724 2.16699 13.0003 2.16699C18.9834 2.16699 23.8337 7.01724 23.8337 13.0003C23.8337 18.9834 18.9834 23.8337 13.0003 23.8337Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        title: 'Fast Transaction',
        description: 'Provides faster transaction, so money arrives in realtime'
    },
    {
        icon: '<path d="M8.66699 12.8162L11.3501 15.4993C11.5616 15.7107 11.9043 15.7109 12.1158 15.4997L17.8753 9.75033M13.0003 23.8337C7.01724 23.8337 2.16699 18.9834 2.16699 13.0003C2.16699 7.01724 7.01724 2.16699 13.0003 2.16699C18.9834 2.16699 23.8337 7.01724 23.8337 13.0003C23.8337 18.9834 18.9834 23.8337 13.0003 23.8337Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        title: 'Secure Payment',
        description: 'Provides secure payment, so you can trust us'
    },
    {
        icon: '<path d="M8.66699 12.8162L11.3501 15.4993C11.5616 15.7107 11.9043 15.7109 12.1158 15.4997L17.8753 9.75033M13.0003 23.8337C7.01724 23.8337 2.16699 18.9834 2.16699 13.0003C2.16699 7.01724 7.01724 2.16699 13.0003 2.16699C18.9834 2.16699 23.8337 7.01724 23.8337 13.0003C23.8337 18.9834 18.9834 23.8337 13.0003 23.8337Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        title: 'Easy Integration',
        description: 'Provides easy integration, so you can start right away'
    }
])
</script>

<template>
    <div class="w-full flex flex-col md:flex-row grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="(service, index) in services" :key="index"
            class="relative cursor-pointer max-w-xs border border-solid border-gray-200 dark:border-slate-100/30 dark:hover:border-slate-50 shadow-lg hover:bg-slate-400/10 hover:border-cyan-50 rounded-2xl p-4 transition-all duration-500 col-span-12  xl:p-7   lg:col-span-3 md:col-span-6 ">
            <div class=" mb-6 ">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"
                    v-html="service.icon"></svg>
            </div>
            <h4 class="text-base font-semibold text-gray-900 dark:text-gray-200 mb-2 capitalize transition-all duration-500 ">
                {{ service.title }}
            </h4>
            <p class="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 ">
                {{ service.description }}
            </p>
        </div>
    </div>
</template>
