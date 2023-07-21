<template>
    <div class="py-6">
        <div class="container mx-auto px-3">
            <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h3 class="text-2xl font-bold leading-6 font-medium text-gray-900">
                    Customers
                </h3>
                <div class="mt-3 flex sm:mt-0 sm:ml-4">
                    <div class="flex rounded-md shadow-sm">
                        <div class="relative flex-grow focus-within:z-10">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input type="text" name="mobile-search-candidate" id="mobile-search-candidate"
                                   class="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:hidden border-gray-300"
                                   placeholder="Search" />
                            <input type="text" name="desktop-search-candidate" id="desktop-search-candidate"
                                   class="hidden focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-none rounded-l-md pl-10 sm:block sm:text-sm border-gray-300"
                                   placeholder="Search Customers" />
                        </div>
                        <button type="button"
                                class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                            <span class="ml-2">Search</span>
                        </button>
                    </div>

                </div>
            </div>
            <div class="pt-10">
                <TableComponent :datas="customers" :dataHeaders="customerTableOptions">
                    <template v-slot:options="{person}">
                        <a @click="deleteData(person)" class="text-indigo-600 hover:text-indigo-900">Delete</a>
                    </template>
                </TableComponent>
            </div>
        </div>
    </div>
</template>
<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import TableComponent from "@/components/TableComponent.vue";
import { onMounted, reactive, ref } from "vue";
import Client from "@/api/Client";

let api = Client;

function deleteData(data) {
    let answer = window.confirm("Are you sure you want to delete this?");
    if (answer) {
        api.putData("user/delete/" + data._id, {}, "Deleted", true).then((response) => {
            getData();
        });
        console.log("Yes Delete");
        //some code
    } else {
        //some code
    }
}

let customers = reactive([]);

let customerTableOptions = [
    {
        name: "Name",
        key: ["full_name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Email",
        key: ["email"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Added On",
        key: ["created_at"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Options",
        key: "options",
        sr_only: true,
        hasSlot: false
    }
];

function getData() {
    api.getData("user/get/all").then((resp) => {
        if (!resp.error) {
            customers.splice(0);
            resp.forEach((dat) => {
                customers.push({ ...dat });
            });
        }
    });
}

onMounted(() => {
    getData();
});

</script>