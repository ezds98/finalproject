<template>
    <div class="min-h-full pb-10 flex bg-gray-100">
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog as="div" class="fixed inset-0 flex z-40 md:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                                 enter-from="opacity-0" enter-to="opacity-100"
                                 leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                                 leave-to="opacity-0">
                    <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </TransitionChild>
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                                 enter-from="-translate-x-full" enter-to="translate-x-0"
                                 leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                                 leave-to="-translate-x-full">
                    <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                        <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                         enter-to="opacity-100" leave="ease-in-out duration-300"
                                         leave-from="opacity-100" leave-to="opacity-0">
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button type="button"
                                        class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        @click="sidebarOpen = false">
                                    <span class="sr-only">Close sidebar</span>
                                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div class="flex-shrink-0 flex items-center px-4">
                            <img class="h-8 w-auto"
                                 src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                                 alt="Workflow" />
                        </div>
                        <div class="mt-5 flex-1 h-0 overflow-y-auto">
                            <nav class="px-2 space-y-1">
                                <a @click="routeToItem(item)" v-for="item in navigation" :key="item.name"
                                   :class="[item.current ? 'bg-gray-100 text-gray-900 cursor-pointer' : 'cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']">
                                    <component :is="item.icon"
                                               :class="[item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-4 flex-shrink-0 h-6 w-6']"
                                               aria-hidden="true" />
                                    {{ item.name }}
                                </a>
                            </nav>
                        </div>
                    </div>
                </TransitionChild>
                <div class="flex-shrink-0 w-14" aria-hidden="true">
                    <!-- Dummy element to force sidebar to shrink to fit close icon -->
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden md:flex md:flex-shrink-0">
            <div class="flex flex-col w-64">
                <!-- Sidebar component, swap this element with another sidebar if you like -->
                <div class="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
                    <div class="flex items-center flex-shrink-0 px-4 font-black justify-center">
                        YOUR DASHBOARD
                    </div>
                    <div class="mt-5 flex-grow flex flex-col">
                        <nav class="flex-1 px-2 bg-white space-y-1 sticky top-0">
                            <a @click="routeToItem(item)" v-for="item in navigation" :key="item.name"
                               :class="[item.current ? 'bg-gray-100 text-gray-900 cursor-pointer' : 'cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']">
                                <component :is="item.icon"
                                           :class="[item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 flex-shrink-0 h-6 w-6']"
                                           aria-hidden="true" />
                                {{ item.name }}
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-0 flex-1">
            <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                <button type="button"
                        class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
                <div class="flex-1 px-4 flex justify-between">
                    <div class="flex-1 flex">

                    </div>
                    <div class="ml-4 flex items-center md:ml-6">
                        <button type="button"
                                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span class="sr-only">View notifications</span>

                        </button>

                        <!-- Profile dropdown -->
                        <Menu as="div" class="ml-3 relative">
                            <div>
                                <MenuButton
                                    class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span class="sr-only">Open user menu</span>
                                    <img class="h-8 w-8 rounded-full"
                                         src="/src/assets/avatarSvg.svg"
                                         alt="" />
                                </MenuButton>
                            </div>
                            <transition enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem v-slot="{ active }">
                                        <a @click="signout" class="cursor-pointer"
                                           :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign
                                            Out</a>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>
            <main>
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import {
    Dialog,
    DialogOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot
} from "@headlessui/vue";
import {
    BellIcon,
    FolderIcon,
    CurrencyDollarIcon,
    ComputerDesktopIcon,
    UserGroupIcon,
    Bars3Icon,
    UsersIcon,
    ArchiveBoxIcon,
    ArrowPathRoundedSquareIcon,
    BuildingStorefrontIcon,
    UserIcon,
    XMarkIcon
} from "@heroicons/vue/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useRouter } from "vue-router";
import OpenClient from "../api/openClient.js";

let router = useRouter();
let api = OpenClient;

const navigation = reactive([
    { name: "Dashboard", href: "/admin/dashboard", icon: ComputerDesktopIcon, current: true },
    { name: "My Customers", href: "/admin/customers", icon: UserGroupIcon, current: false },
    { name: "My Products", href: "/admin/products", icon: ArchiveBoxIcon, current: false },
    { name: "My Sales", href: "/admin/sales", icon: CurrencyDollarIcon, current: false },
    { name: "My Purchases", href: "/admin/purchases", icon: ArrowPathRoundedSquareIcon, current: false },
    { name: "Back To Shop", href: "/", icon: BuildingStorefrontIcon, current: false }
]);
const userNavigation = [
    { name: "Sign out", href: "#" }
];

const sidebarOpen = ref(false);

function routeToItem(item) {
    navigation.forEach((it, ind, arr) => {
        arr[ind].current = false;
    });
    item.current = true;
    router.push({ path: item.href });
}

function signout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push({ path: "/admin/login" });
}

function checkLoggedIn() {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        api.postData("auth/verify/access-token", { token: accessToken }, "", true).then((resp) => {
            if (resp.error) {
                router.push({ path: "/admin/login" });
            }
        });
    } else {
        router.push({ path: "/admin/login" });
    }
}

onMounted(() => {
    checkLoggedIn();
    let isAdmin = localStorage.getItem("isMaster");
    if (isAdmin && isAdmin === 'true') {
        navigation.splice(5, 0, { name: "Users", href: "/admin/users", icon: UserIcon, current: false });
    }
});

</script>