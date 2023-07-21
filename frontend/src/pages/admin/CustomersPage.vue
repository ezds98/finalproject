<template>
    <div class="py-6">
        <simple-form-renderer ref="clientAddForm" @saveData="saveItemData"
                              :form-data="selectedForm"></simple-form-renderer>
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
                    <!--
 <button @click="openClientAddForm" type="button"
                            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add New
                    </button>
                    -->
                   
                </div>
            </div>
            <div class="pt-10">
                <TableComponent :datas="customers" :dataHeaders="customerTableOptions" @row-click="editData">
                    <template v-slot:name="{person}">
                        <div class="flex items-center p-4">
                            <div class="flex-shrink-0 h-10 w-10">
                                <UploadImageView :img-id="person.image?person.image:null"
                                                 image-class="h-10 w-10 rounded-full" />
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ person.first_name + " " + person.last_name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ person.email }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:city="{person}">
                        <div class="text-sm text-gray-900">
                            {{ person.city }}
                        </div>
                    </template>
                    <template v-slot:phone="{person}">
                        <div class="text-sm text-gray-900">
                            {{ person.phone }}
                        </div>
                    </template>
                    <template v-slot:options="{person}">
                        <a @click="editData(person)" class="text-indigo-600 hover:text-indigo-900">Edit</a><br />
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
import FormData from "@/api/formData";
import SimpleFormRenderer from "@/components/SimpleFormRenderer.vue";
import { onMounted, reactive, ref } from "vue";
import Client from "@/api/Client";
import UploadImageView from "@/components/uploadImageView.vue";

let form = new FormData();
const clientAddForm = ref(null);

let api = Client;
let selectedForm = ref(null);
let dialogMode = ref("add");
let selectedId = ref("");
selectedForm.value = [...form.client_form];

function openClientAddForm() {
    dialogMode.value = "add";
    selectedForm.value = [...form.client_form];
    clientAddForm.value.toggleOpen();
}

function saveItemData(data) {
    if (dialogMode.value === "add") {
        api.postData("customer", data, "Customer Added", true).then((response) => {
            getData();
            clientAddForm.value.toggleOpen();
        });
    } else if (dialogMode.value === "edit") {
        api.putData("customer/update/" + selectedId.value, data, "Customer Modifed", true).then((response) => {
            getData();
            clientAddForm.value.toggleOpen();
        });
    }
}

function editData(data) {
    selectedId.value = data._id;
    dialogMode.value = "edit";
    api.getData("customer/get/id/" + data._id, true).then((response) => {
        selectedForm.value = [...form.createEditObject([...form.client_form], response)];
        clientAddForm.value.toggleOpen();
    });
}

function deleteData(data) {
    let answer = window.confirm("Are you sure you want to delete this?");
    if (answer) {
        let currentDetails = returnCurrentTabDetails();
        api.putData("customer/delete/" + data._id, {}, "Deleted", true).then((response) => {
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
        key: "name",
        sr_only: false,
        hasSlot: true
    },
    {
        name: "City",
        key: "city",
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Phone",
        key: "phone",
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
    api.getData("customer/get").then((resp) => {
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