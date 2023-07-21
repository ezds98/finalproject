<template>
  <main class="relative lg:min-h-full">
    <div class="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
      <img src="../assets/shopping.png" alt="TODO" class="h-full w-full object-cover object-center" />
    </div>
    <div>
      <div class="mx-auto max-w-2xl py-16 px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        <div class="lg:col-start-2">
          <h1 class="text-sm font-medium text-indigo-600">Payment successful</h1>
          <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Thanks for ordering</p>
          <p class="mt-2 text-base text-gray-500">We appreciate your order, we’re currently processing it. So hang tight and we’ll send you confirmation very soon!</p>

          <ul role="list" class="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500">
            <li v-for="product in products" :key="product.id" class="flex space-x-6 py-6">
              <UploadImageView :img-id="product.image" image-class="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"/>
              <div class="flex-auto space-y-1">
                <h3 class="text-gray-900">
                  <a >{{ product.name }}</a>
                </h3>
                <p>{{ product.category.name }}</p>
              </div>
              <p class="flex-none font-medium text-gray-900"><span v-if="product.stock">{{product.stock}} x </span>${{ product.price }}</p>
            </li>
          </ul>

          <dl class="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
            <div class="flex justify-between">
              <dt>Subtotal</dt>
              <dd class="text-gray-900">${{totalCost}}</dd>
            </div>

            <div class="flex justify-between">
              <dt>Shipping</dt>
              <dd class="text-gray-900">FREE</dd>
            </div>
            <div class="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
              <dt class="text-base">Total</dt>
              <dd class="text-base">${{totalCost}}</dd>
            </div>
          </dl>
          <div class="mt-16 border-t border-gray-200 py-6 text-right">
            <a href="/" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import {useProductStore} from "@/stores/prodStore";
import UploadImageView from "@/components/uploadImageView.vue";
import {onMounted, reactive, ref} from "vue";

let prodStore = useProductStore();

let products = reactive([])

let totalCost = ref(0)

onMounted(()=>{
  for(let cartIt of prodStore.cartItems) {
    products.push({...cartIt});
  }
  totalCost.value = prodStore.totalCartPrice
  prodStore.cartItems.splice(0)
})

</script>