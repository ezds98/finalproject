<template>
  <div>
    <div @click="goToProductPage" class="relative cursor-pointer">
      <div class="relative h-72 w-full overflow-hidden rounded-lg">
        <UploadImageView :img-id="initialImgId" image-class="h-full w-full object-cover object-center"/>
      </div>
      <div class="relative mt-4">
        <h3 class="text-sm font-medium text-gray-900">{{ props.product.name }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ props.product.sub_category.name }}</p>
      </div>
      <div class="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
        <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50" />
        <p class="relative text-2xl tracking-wider font-semibold text-white">Rs. {{ props.product.price }}</p>
      </div>
    </div>
    <div class="mt-6">
      <a @click="addToCart" class="cursor-pointer relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-200"
      :class="alreadyAddedInCart?'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50':''"
      >{{ alreadyAddedInCart ? "Checkout Now" : "Add In Cart" }}</a
      >
    </div>
  </div>
</template>
<script setup>
import UploadImageView from "@/components/uploadImageView.vue";
import {useProductStore} from "@/stores/prodStore";
import router from "@/router";
import {onMounted, ref} from "vue";

let props = defineProps(['product'])
let prodStore = useProductStore();
let initialImgId = ref(null)
let alreadyAddedInCart = ref(false);

function goToProductPage() {
  router.push({path:"/product/details/"+props.product._id})
}
function addToCart(ev) {
  if(alreadyAddedInCart.value){
    router.push({path:"/shopping-cart"})
    return
  }
  prodStore.addItemToCart({
    id:props.product._id,
    name:props.product.name,
    sub_category:props.product.sub_category,
    category:props.product.category,
    author:props.product.author,
    stock:1,
    price:props.product.price,
    image:initialImgId.value
  })
  alreadyAddedInCart.value = true;
}

onMounted(()=>{
  if(props.product.images && props.product.images.length>0) {
    initialImgId.value = props.product.images[0]
  }
  let exists = prodStore.checkIfProductAlreadyExists(props.product._id);
  if (exists > -1) {
    alreadyAddedInCart.value = true;
  }
})

</script>