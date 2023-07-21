<template>
    <main class="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 lg:pb-24 bg-white">
        <div class="max-w-xl">
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Purchase history</h1>
            <p class="mt-1 text-sm text-gray-500">Check the status of recent orders, manage returns, and download
                invoices.</p>
        </div>
        <section aria-labelledby="recent-heading" class="mt-8">
            <h2 id="recent-heading" class="sr-only">Recent orders</h2>
            <div v-if="allOrders.length > 0" class="space-y-20">
                <div v-for="order in allOrders" :key="order._id">
                    <h3 class="sr-only">
                        Order placed on
                        
                        <time :datetime="order.created_at">{{ moment(order.created_at).format("lll") }}</time>
                    </h3>

                    <div
                        class="rounded-lg bg-gray-50 py-6 px-4 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                        <dl class="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                            <div class="flex justify-between sm:block">
                                <dt class="font-medium text-gray-900">Date placed</dt>
                                <dd class="sm:mt-1">
                                    <time :datetime="order.datetime">{{ moment(order.created_at).format("lll") }}</time>
                                </dd>
                            </div>
                            <div class="flex justify-between pt-6 sm:block sm:pt-0">
                                <dt class="font-medium text-gray-900">Customer Name</dt>
                                <dd class="sm:mt-1">{{ order.customer_id.first_name + " " + order.customer_id.last_name
                                    }}
                                </dd>
                            </div>
                            <div class="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                                <dt>Total amount</dt>
                                <dd class="sm:mt-1">${{ order.total_amount }}</dd>
                            </div>
                        </dl>
                        <Menu as="div" class="relative inline-block text-left">
                            <div>
                                <MenuButton
                                    class="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                                >
                                    View Customer
                                    <ChevronDownIcon
                                        class="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                        aria-hidden="true"
                                    />
                                </MenuButton>
                            </div>

                            <transition
                                enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                            >
                                <MenuItems
                                    class="p-4 absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    <div class="px-1 py-1 text-sm font-normal">
                                        <MenuItem as="div" v-slot="{ active }">
                                            <span class="font-medium">Name : </span>{{ order.customer_id.first_name + " " + order.customer_id.last_name
                                    }}
                                        </MenuItem>
                                        <MenuItem as="div" v-slot="{ active }">
                                            <span class="font-medium">Email : </span>{{ order.customer_id.email
                                    }}
                                        </MenuItem>
                                        <MenuItem as="div" v-slot="{ active }">
                                            <span class="font-medium">Address : </span>{{ order.customer_id.address
                                    }}
                                        </MenuItem>
                                        <MenuItem v-if="order.customer_id.apartment" as="div" v-slot="{ active }">
                                            <span class="font-medium">Apartment : </span>{{ order.customer_id.apartment
                                    }}
                                        </MenuItem>
                                        <MenuItem as="div" v-slot="{ active }">
                                            <span class="font-medium">City : </span>{{ order.customer_id.city
                                    }}
                                        </MenuItem>
                                        <MenuItem v-if="order.customer_id.state" as="div" v-slot="{ active }">
                                            <span class="font-medium">State : </span>{{ order.customer_id.state
                                    }}
                                        </MenuItem>
                                        <MenuItem v-if="order.customer_id.phone" as="div" v-slot="{ active }">
                                            <span class="font-medium">Phone : </span>{{ order.customer_id.phone
                                    }}
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                    <table class="mt-4 w-full text-gray-500 sm:mt-6">
                        <caption class="sr-only">
                            Products
                        </caption>
                        <thead class="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                        <tr>
                            <th scope="col" class="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">Product</th>
                            <th scope="col" class="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Price</th>
                            <th scope="col" class="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Quantity</th>
                            <th scope="col" class="hidden py-3 pr-8 font-normal sm:table-cell">Location</th>
                            <th scope="col" class="w-0 py-3 text-right font-normal">Info</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                        <tr v-for="prod in order.products" :key="prod.product._id">
                            <td class="py-6 pr-8">
                                <div class="flex items-center">
                                    <UploadImageView image-class="mr-6 h-16 w-16 rounded object-cover object-center"
                                                     :img-id="prod.product.images && Array.isArray(prod.product.images) && prod.product.images.length > 0?prod.product.images[0]:null"></UploadImageView>
                                    
                                    <div>
                                        <div class="font-medium text-gray-900">{{ prod.product.name }}</div>
                                        <div class="mt-1 sm:hidden">{{ prod.product.price }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="hidden py-6 pr-8 sm:table-cell">${{ prod.product.price }}</td>
                            <td class="hidden py-6 pr-8 sm:table-cell">{{ prod.quantity }}</td>
                            <td class="hidden py-6 pr-8 sm:table-cell">
                                {{ order.customer_id.address + " , " + order.customer_id.city }}
                            </td>
                            <td class="whitespace-nowrap py-6 text-right font-medium ">
                                <a :href="'/product/details/'+prod.product._id" class="text-indigo-600"
                                >View <span class="hidden lg:inline">Product</span></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                <AlertComponent heading="No Purchases Found" details="Please purchase something  to continue" />
            </div>
        </section>
    </main>
</template>
<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { onMounted, ref, reactive } from "vue";
import Client from "@/api/Client";
import moment from "moment";
import UploadImageView from "@/components/uploadImageView.vue";
import AlertComponent from "@/components/AlertComponent.vue"

let allOrders = reactive([]);

const orders = [
    
];

let api = Client;

function getOrders() {
    api.getData("sales/get/0").then((resp) => {
        if (!resp.error) {
            allOrders.splice(0);
            resp.data.forEach((dat) => {
                allOrders.push({ ...dat });
            });
        }
    });
}

onMounted(() => {
    getOrders();
});

</script>