<!-- This example requires Tailwind CSS v2.0+ -->
<template>
    <TransitionRoot :show="showSearch" as="template" @after-leave="query = ''" appear>
        <Dialog style="z-index: 50" as="div" class="relative" @close="showSearch = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div @click="showSearch = false" class="fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95">
                    <DialogPanel
                        class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                        <Combobox v-model="query" @update:modelValue="goToProductsPage">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                    aria-hidden="true" />
                                <ComboboxInput
                                    class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    placeholder="Search..." :displayValue="(product) => product.name"
                                    @change="query = $event.target.value" @input="getProducts" />
                            </div>

                            <ComboboxOptions v-if="products.length > 0" static
                                class="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
                                <ComboboxOption v-for="product in products" :key="product._id" :value="product"
                                    as="template" v-slot="{ active }">
                                    <li @click="goToProductsPage(product)"
                                        :class="['cursor-default select-none px-4 py-2', active && 'bg-indigo-600 text-white']">
                                        {{ product.name }}
                                    </li>
                                </ComboboxOption>
                            </ComboboxOptions>

                            <p v-if="query !== '' && products.length === 0" class="p-4 text-sm text-gray-500">No product
                                found.</p>
                        </Combobox>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
    <header class="w-full bg-white z-30 bg-white fixed top-0">
        <nav aria-label="Top" class=" mx-auto max-w-7xl sm:px-6 lg:px-8 ">
            <div class="relative border-b border-gray-200 px-4 pb-14 sm:static sm:px-0 sm:pb-0">
                <div class="flex h-16 items-center justify-between">
                    <!-- Logo -->
                    <div class="flex flex-1">
                        <a class="font-black h-8 w-auto flex items-center text-xl" href="/">EzzyShopNepal</a>
                    </div>

                    <div class="absolute inset-x-0 bottom-0 border-t sm:static sm:border-t-0">
                        <div class="flex h-14 items-center space-x-8 px-4 sm:h-auto">
                            <Popover :key="nav._id" v-for="(nav, main) in prodStore.navbarCategories" class="relative">
                                <PopoverButton
                                    class="inline-flex items-center gap-x-1 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-0">
                                    <span>{{ nav.name }}</span>
                                    <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                                </PopoverButton>
                                <transition enter-active-class="transition ease-out duration-200"
                                    enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition ease-in duration-150"
                                    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                                    <PopoverPanel
                                        class="absolute left-0 sm:left-1/2  z-50 mt-5 flex max-w-sm sm:-translate-x-1/2 px-4">
                                        <div
                                            class="w-52 shrink rounded-xl bg-white p-4 text-sm font-medium text-gray-700 hover:text-gray-800 shadow-lg ring-1 ring-gray-900/5">
                                            <a @click="navigateToCategoryPage(item._id)"
                                                v-for="(item) in nav.sub_categories" :key="item.name"
                                                class="block p-2 hover:text-indigo-600 cursor-pointer">{{ item.name
                                                }}</a>
                                        </div>
                                    </PopoverPanel>
                                </transition>
                            </Popover>
                        </div>
                    </div>

                    <div class="flex flex-1 items-center justify-end">
                        <!-- Search -->
                        <a @click="openSearchDialog" class="cursor-pointer p-2 text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Search</span>
                            <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
                        </a>

                        <!-- Cart -->
                        <Popover class="ml-4 flow-root text-sm lg:relative lg:ml-8 z-50">
                            <PopoverButton ref="shoppingCartBtn" class="group -m-2 flex items-center p-2">
                                <ShoppingBagIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true" />
                                <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{{
                                    prodStore.cartItems.length
                                }}</span>
                                <span class="sr-only">items in cart, view bag</span>
                            </PopoverButton>
                            <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
                                enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <PopoverPanel
                                    class="max-h-96 overflow-auto absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:top-full lg:left-auto lg:right-0 lg:mt-3 lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                                    <h2 class="sr-only">Shopping Cart</h2>

                                    <form class="mx-auto max-w-2xl px-4">
                                        <ul v-if="prodStore.cartItems.length > 0" role="list"
                                            class="divide-y divide-gray-200">
                                            <li v-for="product in prodStore.cartItems" :key="product.id"
                                                class="flex items-center py-6 relative">
                                                <UploadImageView :img-id="product.image"
                                                    image-class="h-16 w-16 flex-none rounded-md border border-gray-200" />
                                                <div class="ml-4 flex-auto">
                                                    <h3 class="font-medium text-gray-900">
                                                        <a class="cursor-pointer">{{ product.name }}</a>
                                                    </h3>
                                                    <p class="text-gray-500">{{ product.sub_category.name }}</p>
                                                    <div class="absolute right-0 bottom-2 font-medium">
                                                        ${{ product.price }} x <span v-if="product.stock">{{ product.stock
                                                        }}</span></div>
                                                </div>
                                            </li>
                                            <button type="button" @click="gotoCheckout"
                                                class="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                                Checkout
                                            </button>
                                        </ul>
                                        <AlertComponent class="my-4" v-else heading="No Items Added In Cart Yet!"
                                            details="Please add some items in the cart to checkout"></AlertComponent>

                                    </form>
                                </PopoverPanel>
                            </transition>
                        </Popover>
                        

                        <Menu as="div" class="ml-8 relative">
                            <div>
                                <MenuButton
                                    class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span class="sr-only">Open user menu</span>
                                    <img class="h-7 w-7 rounded-full"
                                         src="../assets/avatarSvg.svg"
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
                                        <a href="/admin/dashboard" class="cursor-pointer"
                                           :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Dashboard</a>
                                    </MenuItem>
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
        </nav>
    </header>
    <div class="mt-[121px] sm:mt-[65px]">
        <router-view />
    </div>
    <div class="container mx-auto">
        <hr class="pt-10" />
        <EFooter />
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { ShoppingBagIcon } from "@heroicons/vue/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import {
    Popover, PopoverButton, PopoverPanel, Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Dialog,
    DialogPanel,
    TransitionChild,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    TransitionRoot
} from "@headlessui/vue";
import EFooter from "../components/Footer.vue";
import { useProductStore } from "@/stores/prodStore";
import Client from "@/api/Client";
import UploadImageView from "@/components/uploadImageView.vue";
import { useRouter } from "vue-router";
import AlertComponent from "@/components/AlertComponent.vue";

let prodStore = useProductStore();
let shoppingCartBtn = ref(null);
let router = useRouter();

function gotoCheckout() {
    shoppingCartBtn.value.$el.click();
    router.push({ path: "/shopping-cart" });
}

let showSearch = ref(false);
const query = ref("");
let products = ref([]);
const timeout = ref();
const error = ref();
let api = Client;

function navigateToPage(product) {
    console.log(product);
}


function signout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push({ path: "/admin/login" });
}

function getProducts() {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(async () => {
        if (query.value !== "") {
            try {
                const response = await api.getData("product/search/" + query.value);
                console.log(response);
                products.value = response;
            } catch {
                error.value = true;
            }
            return;
        }
        products.value = null;
    }, 300);
}

function goToProductsPage(product) {
    router.push({ path: "/product/details/" + product._id });
}

function openSearchDialog() {
    showSearch.value = !showSearch.value;
}

function navigateToCategoryPage(id) {
    router.push({ path: "/products/list", query: { sub_category: id } });
}

function checkLoggedIn() {
    console.log("Checking")
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        api.postData("auth/verify/access-token", { token: accessToken }, "", true, true).then((resp) => {
            if (resp.error) {
                router.push({ path: "/admin/login" });
                return;
            }
            prodStore.getCategory();
        });
    } else {
        router.push({ path: "/admin/login" });
    }
}

onMounted(() => {
    checkLoggedIn();
});

</script>
