<template>
    <div>
        <!-- Mobile filter dialog -->
        <TransitionRoot as="template" :show="open">
            <Dialog as="div" class="relative z-40 sm:hidden" @close="open = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                                 enter-from="opacity-0" enter-to="opacity-100"
                                 leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                                 leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 z-40 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                                     enter-from="translate-x-full" enter-to="translate-x-0"
                                     leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                                     leave-to="translate-x-full">
                        <DialogPanel
                            class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                            <div class="flex items-center justify-between px-4">
                                <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                                <button type="button"
                                        class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        @click="open = false">
                                    <span class="sr-only">Close menu</span>
                                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>

                            <!-- Filters -->
                            <form class="mt-4">
                                <Disclosure as="div" v-for="(section, sectionIdx) in filterOptions" :key="section.name"
                                            class="border-t border-gray-200 px-4 py-6" v-slot="{ open }">
                                    <h3 class="-mx-2 -my-3 flow-root">
                                        <DisclosureButton
                                            class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                            <span class="font-medium text-gray-900">{{ section.label }}</span>
                                            <span class="ml-6 flex items-center">
                        <ChevronDownIcon :class="[open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform']"
                                         aria-hidden="true" />
                      </span>
                                        </DisclosureButton>
                                    </h3>
                                    <DisclosurePanel v-slot="{ close }" class="pt-6">
                                        <div class="space-y-6">
                                          <div v-for="(option, optionIdx) in section.options" :key="option.value"
                                               :class="section.id === option.value?'text-indigo-800':''"
                                               @click="navigatePage(sectionIdx,optionIdx)"
                                               class="font-medium w-32 text-gray-900 hover:text-indigo-800 cursor-pointer min-w-full text-sm">

                                            {{ option.label
                                            }}
                                          </div>
                                        </div>
                                    </DisclosurePanel>
                                </Disclosure>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8 ">
            <div class="py-24 bg-gray-50 px-5">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900">Shop For Products</h1>
                <p class="mx-auto mt-4 max-w-3xl text-base text-gray-500">"Whoever said money can't buy happiness simply didn't know where to go shopping." – Gertrude Stein</p>
            </div>
            <section aria-labelledby="filter-heading" class="border-t border-gray-200 py-6 bg-gray-50 px-5">
                <h2 id="filter-heading" class="sr-only">Product filters</h2>
                <div class="flex items-center justify-between">
                  <div class="flex flex-col sm:flex-row justify-start items-start gap-3">
                    <input v-model="searchQuery" class="bg-transparent p-2 h-8 border border-gray-500 rounded-md" placeholder="Enter a product name"/>
                    <button @click="navigatePage" class="bg-indigo-600 text-white p-1 rounded-full w-20">Search</button>
                  </div>

                    <button type="button"
                            class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                            @click="open = true">Filters
                    </button>

                    <PopoverGroup class="hidden sm:flex sm:items-baseline sm:space-x-8">
                        <Popover as="div" v-for="(section, sectionIdx) in filterOptions" :key="section.name"
                                 :id="`desktop-menu-${sectionIdx}`" class="relative inline-block text-left">
                            <div>
                                <PopoverButton
                                    class="focus:outline-none group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 capitalize">
                                    <span>{{ section.selectedName?section.selectedName:section.label }}</span>

                                    <ChevronDownIcon
                                        class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true" />
                                </PopoverButton>
                            </div>
                            <transition enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95">
                                <PopoverPanel
                                    class="absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <form class="space-y-4">
                                        <div v-for="(option, optionIdx) in section.options" :key="option.value"
                                             :class="section.id === option.value?'text-indigo-800':''"
                                             @click="navigatePage(sectionIdx,optionIdx)"
                                             class="font-medium w-32 text-gray-900 hover:text-indigo-800 cursor-pointer min-w-full">

                                            {{ option.label
                                            }}
                                        </div>
                                    </form>
                                </PopoverPanel>
                            </transition>
                        </Popover>
                    </PopoverGroup>
                </div>
            </section>
            <div class="px-4 sm:px-6 lg:max-w-7xl lg:px-8 my-10">
                <div v-if="products.length>0" class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                  <div v-for="product in products" :key="product._id">
                    <ProductCard :product="product" />
                  </div>
                </div>
                <AlertComponent v-else class="w-full mt-8 text-start" heading="No Products Found" details="Please try to searching in different categories or using different search word"></AlertComponent>

        </div>
            <div class="mb-10">
                <ShowRandomRecommended />
            </div>
        </div>
    </div>
</template>
<script setup>
import {onMounted, ref, reactive, watch, onBeforeUpdate} from "vue";
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    TransitionChild,
    TransitionRoot
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import Client from "@/api/Client";
import { useProductStore } from "@/stores/prodStore";
import {useRouter, useRoute, onBeforeRouteUpdate} from "vue-router";
import ShowRandomRecommended from "@/components/ShowRandomRecommended.vue";
import ProductCard from "@/components/ProductCard.vue";
import AlertComponent from "@/components/AlertComponent.vue";

const sortOptions = [
    { name: "Most Popular", href: "#" },
    { name: "Best Rating", href: "#" },
    { name: "Newest", href: "#" }
];

let api = Client;

let prodStore = useProductStore();

let router = useRouter();
let route = useRoute();

let products = reactive([]);

const open = ref(false);

let filterOptions = reactive([
    {
        label: "Category",
        name: "category",
        id: "",
        options: [],
        selectedName:""
    },
    {
        label: "Sub Category",
        name: "sub_category",
        id: "",
        options: [],
        selectedName:""
    },
]);

let searchQuery = ref("")

function returnFormattedQueryObject() {
    let returnData = {};
    filterOptions.forEach((data) => {
        returnData[data.name] = data.id;
    });
    if(searchQuery.value !== "") {
      returnData['query'] = searchQuery.value
    }
    return returnData;
}

function setCategoryAndSubCategory() {
  filterOptions[0].options.splice(0)
  prodStore.categories.forEach((dat)=>{
    if(filterOptions[0].id === dat._id) {
      filterOptions[0].selectedName = dat.name;
    }
    filterOptions[0].options.push({
      label: dat.name, value: dat._id
    })
  })
  filterOptions[1].options.splice(0)
  prodStore.subCategories.forEach((dat)=>{
    if(filterOptions[1].id === dat._id) {
      filterOptions[1].selectedName = dat.name;
    }
    filterOptions[1].options.push({
      label: dat.name, value: dat._id
    })
  })
}

function navigatePage(main,sub) {
  if(main !== undefined && sub !== undefined) {
    filterOptions[main].id = filterOptions[main].options[sub].value
    filterOptions[main].selectedName = filterOptions[main].options[sub].label
  }
  let routeParams = {}
  for(let opt of filterOptions) {
    if(opt.id !== ""){
      routeParams[opt.name] = opt.id
    }
  }
  if(searchQuery.value !== "") {
    routeParams['query'] = searchQuery.value
  }
  open.value = false
  router.push({path:"/products/list/?",query:routeParams})
}

watch([prodStore.categories, prodStore.subCategories], ([], []) => {
  console.log("Changed")
  setCategoryAndSubCategory()
});

function getProductList() {
  if (route.query.category) {
    filterOptions[0].id = route.query.category;
  }
  if (route.query.sub_category) {
    filterOptions[1].id = route.query.sub_category;
  }
  if (route.query.author) {
    filterOptions[2].id = route.query.author;
  }
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  api.putData("product/get/0", returnFormattedQueryObject()).then((resp) => {
    products.splice(0);
    if (resp.data && Array.isArray(resp.data)) {
      resp.data.forEach((dat) => {
        products.push(dat);
      });
    }
  });
}

watch(route,()=>{
  console.log(route.query)
  getProductList()
  setCategoryAndSubCategory()
})


onMounted(() => {
  getProductList()
  setCategoryAndSubCategory()
});

</script>
