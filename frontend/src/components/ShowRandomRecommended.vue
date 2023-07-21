<template>
  <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <div class="py-2 sm:py-4 lg:max-w-none">
      <h2 class="text-2xl font-bold text-gray-900 text-start">Shop by category</h2>
      <div v-if="randomCat && randomCat.length>0" class="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:space-y-0 cursor-pointer">
        <div @click="goToSubCategoryPage(category)" v-for="category in randomCat" :key="category._id" class="group relative shadow-xl p-2">
          <div class="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
            <UploadImageView :img-id="category.image" image-class="h-full w-full object-cover object-center"/>
          </div>
          <h3 class="text-sm text-gray-500">
            <a >
              <span class="absolute inset-0" />
              {{ category.description }}
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900 text-center pb-5">Browse In {{ category.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from "vue";
import {useProductStore} from "@/stores/prodStore";
import UploadImageView from "@/components/uploadImageView.vue";
import router from "@/router";
let prodStore = useProductStore()
let randomCat = ref([])

watch(prodStore.randomCategories,()=>{
  randomCat.value.splice(0)
  prodStore.randomCategories.forEach((item)=>{
    randomCat.value.push(item)
  })
})

function goToSubCategoryPage(category) {
  router.push('/products/list/?sub_category='+category._id)
}

onMounted(()=>{
  prodStore.getRandomSubObjects();
  randomCat.value.splice(0)
  prodStore.randomCategories.forEach((item)=>{
    randomCat.value.push(item)
  })
})
</script>