<template>
  <div v-if="productDetails" class="bg-white">
    <div class="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <!-- Image gallery -->
        <TabGroup as="div" class="flex flex-col-reverse">
          <!-- Image selector -->
          <div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
            <TabList class="grid grid-cols-4 gap-6">
              <template v-if="productDetails.images && productDetails.images.length>0">
                <Tab
                  v-for="image in productDetails.images"
                  :key="image"
                  class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  v-slot="{ selected }"
                >
                  <span class="absolute inset-0 overflow-hidden rounded-md">
                    <uploadImageView
                      :img-id="image"
                      image-class="h-full w-full object-cover object-center"
                    />
                  </span>
                  <span
                    :class="[selected ? 'ring-indigo-500' : 'ring-transparent', 'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2']"
                    aria-hidden="true"
                  />
                </Tab>
              </template>
              <template v-else>
                <Tab
                  class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  v-slot="{ selected }"
                >
                  <span class="absolute inset-0 overflow-hidden rounded-md">
                    <uploadImageView
                      img-id=""
                      image-class="h-full w-full object-cover object-center"
                    />
                  </span>
                  <span
                    :class="[selected ? 'ring-indigo-500' : 'ring-transparent', 'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2']"
                    aria-hidden="true"
                  />
                </Tab>
              </template>
            </TabList>
          </div>
          <TabPanels class="aspect-w-1 aspect-h-1 w-full">
            <template v-if="productDetails.images && productDetails.images.length>0">
                <TabPanel v-for="image in productDetails.images" :key="image">
                    <uploadImageView
                      :img-id="image"
                      image-class="h-full w-full object-cover object-center"
                    />
                  </TabPanel>
            </template>
            <template v-else>
                <TabPanel >
                    <uploadImageView
                      img-id=""
                      image-class="h-full w-full object-cover object-center"
                    />
                  </TabPanel>
            </template>
            
          </TabPanels>
        </TabGroup>

        <!-- Product info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ productDetails.name }}</h1>
          <h2 class="text-md font-medium tracking-tight text-gray-900">
            {{ productDetails.category.name }} |
            {{ productDetails.sub_category.name }}
          </h2>
          <div class="mt-3">
            <h2 class="sr-only">Product information</h2>
            <p class="text-3xl tracking-tight text-gray-900">Rs. {{ productDetails.price }}</p>
          </div>

          <div class="my-4 flex gap-2 items-center">
            <label for="quantity">Quantity:</label>
            <select
              v-model="stockCount"
              @input="updateCount($event.currentTarget.value)"
              id="quantity"
              name="quantity"
              class="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
            <option :value="count" v-for="count in totalStock">{{ count }}</option>
              
            </select>
          </div>

          <div class="mt-6">
            <h3 class="sr-only">Description</h3>
            <div class="space-y-6 text-base text-gray-700" v-html="productDetails.description" />
          </div>

          <form class="mt-6">
            <!-- Colors -->

            <div class="sm:flex-col1 mt-10 flex">
              <button
                type="button"
                @click="addProductToCart"
                :class="alreadyAddedInCart?'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50':''"
                class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              >{{ alreadyAddedInCart ? "Checkout Now" : "Add In Cart" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <ShowRandomRecommended class="pb-10" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/vue";
import { StarIcon } from "@heroicons/vue/20/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";
import ShowRandomRecommended from "@/components/ShowRandomRecommended.vue";
import Client from "@/api/Client";
import { useRoute, useRouter } from "vue-router";
import UploadImageView from "@/components/uploadImageView.vue";
import { useProductStore } from "@/stores/prodStore.js";

let api = Client;

let prodStore = useProductStore();

let route = useRoute();

let router = useRouter();

let productDetails = ref(null);

let stockCount = ref(1);

let totalStock = ref(0);

let alreadyAddedInCart = ref(false);

function returnCartAddItems() {
  if (productDetails.value) {
    let initialImage = "";
    if (productDetails.value.images && productDetails.value.images.length > 0) {
      initialImage = productDetails.value.images[0];
    }
    return {
      id: productDetails.value._id,
      name: productDetails.value.name,
      sub_category: productDetails.value.sub_category,
      category: productDetails.value.category,
      stock: stockCount.value,
      price: productDetails.value.price,
      image: initialImage,
    };
  } else {
    return false;
  }
}

function updateCount(stock) {
  stockCount.value = stock;
  let updateData = returnCartAddItems();
  if (updateData) {
    prodStore.updateCartStock(returnCartAddItems(), stock);
  }
}

function getProducts() {
  api.getData("product/get/id/" + route.params.id).then((resp) => {
    console.log(resp)
    totalStock.value = resp.stock > 10 ? 10 : resp.stock
    productDetails.value = resp;
  });
}

function addProductToCart() {
  if (alreadyAddedInCart.value) {
    router.push({ path: "/shopping-cart" });
  } else {
    let updateData = returnCartAddItems();
    if (updateData) {
      prodStore.addItemToCart(returnCartAddItems());
      alreadyAddedInCart.value = true;
    }
  }
}

watch(route, () => {
  // location.reload()
});

onMounted(() => {
  getProducts();
  let exists = prodStore.checkIfProductAlreadyExists(route.params.id);
  if (exists > -1) {
    alreadyAddedInCart.value = true;
    stockCount.value = prodStore.cartItems[exists].stock;
  }
});
</script>
