<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import SimpleFormRenderer from "@/components/SimpleFormRenderer.vue";
import FormData from "@/api/formData";
import Client from "@/api/Client";
import TableComponent from "@/components/TableComponent.vue";

const tabs = reactive([
    { name: "Products", href: "#", current: true },
    { name: "Category", href: "#", current: false },
    { name: "Sub Category", href: "#", current: false },
    
]);

const productTableOptions = [
    {
        name: "Name",
        key: ["name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Category",
        key: ["category", "name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Retail Price",
        key: ["price"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Stock",
        key: ["stock"],
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

const catagoryTableOptions = [
    {
        name: "Index",
        key: "index",
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Name",
        key: ["name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Description",
        key: ["description"],
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

const authorTableOptions = [
    {
        name: "Index",
        key: "index",
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Name",
        key: ["name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Location",
        key: ["location"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Description",
        key: ["description"],
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

const subCatagoryTableOptions = [
    {
        name: "Index",
        key: "index",
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Name",
        key: ["name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Category",
        key: ["category", "name"],
        sr_only: false,
        hasSlot: false
    },
    {
        name: "Description",
        key: ["description"],
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

let currentTableOptions = reactive([]);
let currentTableData = reactive([]);
let form = new FormData();
let selectedForm = ref(null);
let addEditFormDialog = ref(null);
let currentTab = ref("Products");
let dialogMode = ref("add");
let selectedId = ref("");
let api = Client;
selectedForm.value = form.product_form;

function openForm() {
    dialogMode.value = "add";
    if (currentTab.value === "Products") {
        selectedForm.value = form.product_form;
    } else if (currentTab.value === "Category") {
        selectedForm.value = form.category_form;
    } else if (currentTab.value === "Sub Category") {
        selectedForm.value = form.sub_category_form;
    } else if (currentTab.value === "Author") {
        selectedForm.value = form.author_form;
    }
    addEditFormDialog.value.toggleOpen();
}

function getData() {
    currentTableData.splice(0, currentTableData.length);
    currentTableOptions.splice(0, currentTableOptions.length);
    let getURL = "";
    if (currentTab.value === "Products") {
        getURL = "product/get/0";
        currentTableOptions.push(...productTableOptions);
    } else if (currentTab.value === "Category") {
        getURL = "category/get";
        currentTableOptions.push(...catagoryTableOptions);
    } else if (currentTab.value === "Sub Category") {
        getURL = "sub_category/get";
        currentTableOptions.push(...subCatagoryTableOptions);
    } else if (currentTab.value === "Author") {
        getURL = "author/get";
        currentTableOptions.push(...authorTableOptions);
    }
    if (currentTab.value === "Products") {
        let userId = localStorage.getItem("userId");
        let obj = { user_id: userId };
        let isMaster = localStorage.getItem("isMaster");
        if (isMaster && isMaster ==='true') {
            delete obj["user_id"];
        }
        api.putData(getURL, obj, "Data Loaded", true, false).then((response) => {
            currentTableData.push(...response.data);
        });
    } else {
        api.getData(getURL, true).then((response) => {
            currentTableData.push(...response);
        });
    }
}

watch(() => currentTab.value, () => {
    getData();
});

function returnCurrentTabDetails() {
    let postURL = "";
    let postNotify = "";
    if (currentTab.value === "Products") {
        postURL = "product";
        postNotify = "Product Added";
        selectedForm.value = form.product_form;
    } else if (currentTab.value === "Category") {
        postURL = "category";
        postNotify = "Category Added";
        selectedForm.value = form.category_form;
    } else if (currentTab.value === "Sub Category") {
        postURL = "sub_category";
        postNotify = "Sub Category Added";
        selectedForm.value = form.sub_category_form;
    } else if (currentTab.value === "Author") {
        postURL = "author";
        postNotify = "Author Added";
        selectedForm.value = form.author_form;
    }
    return { url: postURL, notify: postNotify, form: selectedForm.value };
}

function saveItemData(data) {
    let currentDetails = returnCurrentTabDetails();
    if (dialogMode.value === "add") {
        api.postData(currentDetails.url, data, currentDetails.notify, true).then((response) => {
            getData();
            addEditFormDialog.value.toggleOpen();
        });
    } else if (dialogMode.value === "edit") {
        console.log(data);
        api.putData(currentDetails.url + "/update/" + selectedId.value, data, "Updated", true).then((response) => {
            getData();
            addEditFormDialog.value.toggleOpen();
        });
    }
}

function editData(data) {
    selectedId.value = data._id;
    dialogMode.value = "edit";
    let currentDetails = returnCurrentTabDetails();
    api.getData(currentDetails.url + "/get/id/" + data._id, true).then((response) => {
        selectedForm.value = form.createEditObject(currentDetails.form, response);
        console.log(response);
        addEditFormDialog.value.toggleOpen();
    });
}

function deleteData(data) {
    let answer = window.confirm("Are you sure you want to delete this?");
    if (answer) {
        let currentDetails = returnCurrentTabDetails();
        api.putData(currentDetails.url + "/delete/" + data._id, {}, "Deleted", true).then((response) => {
            getData();
        });
        console.log("Yes Delete");
        //some code
    } else {
        //some code
    }
}

onMounted(() => {
    getData();
});

</script>
<template>
    <div class="py-6 px-4">
        <div class="container mx-auto">
            <simple-form-renderer @saveData="saveItemData" ref="addEditFormDialog"
                                  :form-data="selectedForm"></simple-form-renderer>
            <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h3 class="text-2xl font-bold leading-6 font-medium text-gray-900">
                    Products
                </h3>
            </div>
            <div>
                <div class="sm:hidden">
                    <label for="tabs" class="sr-only">Select a tab</label>
                    <select id="tabs" name="tabs"
                            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option v-for="tab in tabs" :key="tab.name" :selected="tab.name === currentTab">{{ tab.name }}
                        </option>
                    </select>
                </div>
                <div class="hidden sm:block">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                            <a @click="currentTab = tab.name" v-for="tab in tabs" :key="tab.name" :href="tab.href"
                               :class="[tab.name === currentTab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']"
                               :aria-current="tab.current ? 'page' : undefined">
                                {{ tab.name }}
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
            <div class="py-5">
                <div class="text-right">
                    <button @click="openForm" type="button"
                            class="mr-2 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add New {{ currentTab }}
                    </button>
                </div>
            </div>
            <div>
                <TableComponent :datas="currentTableData" :data-headers="currentTableOptions">
                    <template v-slot:options="{person}">
                        <a @click="editData(person)" class="text-indigo-600 hover:text-indigo-900">Edit</a><br />
                        <a @click="deleteData(person)" class="text-indigo-600 hover:text-indigo-900">Delete</a>
                    </template>
                </TableComponent>
            </div>
        </div>
    </div>
</template>
