<template>
    <div
        @click="preventDefault($event)"
        id="hub-notification"
        aria-live="assertive"
        class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50 invisible"
    >
        <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
            <transition
                enter-active-class="transform ease-out duration-300 transition"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                >
                    <div class="p-4">
                        <div class="flex items-start">
                            <div id="notify-icon" class="flex-shrink-0">
                                <CheckCircleIcon
                                    class="h-6 w-6 text-green-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p
                                    id="notify-heading"
                                    class="text-sm font-medium text-gray-900"
                                >
                                    Successfully saved!
                                </p>
                                <p id="notify-message" class="mt-1 text-sm text-gray-500">
                                    Anyone with a link can now view this file.
                                </p>
                            </div>
                            <div class="ml-4 flex flex-shrink-0">
                                <button
                                    type="button"
                                    @click="closeNotification"
                                    class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span class="sr-only">Close</span>
                                    <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
    <div
        @click="preventDefault($event)"
        id="hub-loading"
        class="pointer-events-none hidden fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-200 opacity-75 flex flex-col items-center justify-center"
    >
        <div
            class="w-12 h-12 rounded-full animate-spin border-8 border-solid border-indigo-800 border-t-transparent shadow-md"
        ></div>
        <h2 class="pt-2 text-center text-black text-xl font-semibold">
            Loading...
        </h2>
        <p class="w-1/3 text-center text-black">
            This may take a few seconds, please don't close this page.
        </p>
    </div>
    <Suspense>
        <template #default>
            <RouterView />
        </template>
        <template #fallback>
            <span>Loading...</span>
        </template>
    </Suspense>
</template>


<script setup lang="ts">
import { useRouter } from "vue-router";
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/20/solid";

let router = useRouter();

function preventDefault(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
}

function closeNotification() {
    let notify = document.querySelector("#hub-notification");
    if (notify) {
        notify.classList.add("invisible");
    }
}

/// <reference types="vite-svg-loader" />
</script>