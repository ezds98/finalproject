<template>
    <div class="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
        <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h3 class="text-2xl font-bold leading-6 font-medium text-gray-900">
                Dashboard
            </h3>
        </div>
        <div class="mt-8">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 class="text-lg font-medium leading-6 text-gray-900">Overview</h2>
                <div class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Card -->
                    <div v-for="card in dashboardFields" :key="card.name"
                         class="overflow-hidden rounded-lg bg-white shadow">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <component :is="card.icon" class="h-6 w-6 text-gray-400" aria-hidden="true" />
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="truncate text-sm font-medium text-gray-500">{{ card.name }}</dt>
                                        <dd>
                                            <div class="text-lg font-medium text-gray-900">{{ card.amount }}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-full">
                        <SalesPage />
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import {
    ScaleIcon,
    UserGroupIcon,
    BookOpenIcon
} from "@heroicons/vue/24/outline";
import SalesPage from "@/pages/admin/SalesPage.vue";
import Client from "@/api/Client";
import { onMounted, reactive } from "vue";

let api = Client;

let dashboardFields = reactive([
    { name: "Total Purchases", icon: ScaleIcon, amount: "" },
    { name: "Total Monthly Purchases", icon: ScaleIcon, amount: "" },
    { name: "Total Annual Purchases", icon: ScaleIcon, amount: "" },
    { name: "Total Customers", icon: UserGroupIcon, amount: "" },
    { name: "Total Products", icon: BookOpenIcon, amount: "" }
]);

onMounted(() => {
    api.getData("sales/dashboard", true).then((resp) => {
        console.log(resp);
        dashboardFields[0].amount = "Rs." + resp.totalSales;
        dashboardFields[1].amount = "Rs." + resp.monthlySales;
        dashboardFields[2].amount = "Rs." + resp.annualSales;
        dashboardFields[3].amount = resp.totalCustomer;
        dashboardFields[4].amount = resp.totalProducts;
    });
});

</script>