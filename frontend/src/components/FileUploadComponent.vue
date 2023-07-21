<template>
  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
    <div class="space-y-1 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="flex text-sm text-gray-600">
        <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
          <span>Upload {{props.type==='multiple'?'multiple':'a single file'}}</span>
          <input @input="ConsoleFile" ref="fileInput" :multiple="props.type==='multiple'" name="file-upload" type="file" class="sr-only" />
        </label>
        <p class="pl-1">or drag and drop</p>
      </div>
      <p class="text-xs text-gray-500">
        PNG, JPG, GIF up to 10MB
      </p>
    </div>
  </div>
</template>
<script setup>

import {ref, watchEffect} from "vue";
import client from "@/api/Client";
import UploadImageView from "@/components/uploadImageView.vue";

let props = defineProps(['type','details'])
let emit = defineEmits(['saveDetails'])
let api = client

let fileInput = ref(null)

async function ConsoleFile(){
  let reader = new FileReader()
  for(let file in fileInput.value.files){
    reader.readAsDataURL(fileInput.value.files[file])
    reader.onload = function (){
      api.postData('upload',{image:reader.result,imageType:fileInput.value.files[file].type,type:'Pictures'}).then((response)=>{
        if(props.type==='multiple'){
          props.details.push(response._id)
          emit('saveDetails',props.details)
        }
        else {
          emit('saveDetails',response._id)
        }
      })
    }
    reader.onerror = function () {
      // console.log('Error: ', error);
    };
  }
}
console.log(props.details)
</script>