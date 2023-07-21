<template>
  <div v-if="mounted">
    <label class="block text-sm font-medium text-gray-700">{{topLabel}}</label>
    <t-rich-select
        :fetch-options="fetchOptions"
        value-attribute="_id"
        text-attribute="name"
        :name="props.type"
        v-model="selectedBox"
        ref="richSelectBox"
        closeOnSelect
        @input="emitValue($event)"
    >
      <template
          slot="label"
          slot-scope="{ className, option, query }"
      >
        <div class="flex">
          <div class="flex flex-col ml-2 text-gray-800">
            <strong>{{ option.name }}</strong>
          </div>
        </div>
      </template>
    </t-rich-select>
  </div>
</template>
<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import Client from "@/api/Client";
import {TRichSelect} from "@variantjs/vue";

let props = defineProps(['hasSearch','type','details'])

let url = ref('')

let emit = defineEmits(['saveData'])

let openApi = Client

let mounted = ref(false)

let topLabel = ref('')

let selectedBox = ref('')

let richSelectBox = ref(null)

function returnURL(){
  if(props.type==='category_search'){
    url.value = 'category/'
    topLabel.value = 'Select Category'
  }
  else if(props.type==='sub_category_search'){
    url.value = 'sub_category/'
    topLabel.value = 'Select Sub Category'
  }
  else if(props.type==='author_search'){
    url.value = 'author/'
    topLabel.value = 'Select Author'
  }
}

onMounted(()=>{
  if(props.details && props.details !==''){
    selectedBox.value = props.details
  }
  mounted.value = true
  returnURL()
})

onBeforeUnmount(()=>{
  console.log("Unmounted")
  selectedBox.value = ''
  url.value = ''
  mounted.value = false
  if(richSelectBox.value){
    richSelectBox.value.hideDropdown()
  }
  
})

watch(()=>props.type,()=>{
  returnURL()
})


function emitValue(e){
  console.log(e)
  console.log({type:props.type,details:e.detail})
  emit('saveData',{type:props.type,details:e.detail})
}

function fetchOptions (q) {
  console.log(richSelectBox.value)
  let searchURL = url.value
  if(typeof q == 'undefined' || q == ''){
    searchURL += 'get'
  }
  else {
    searchURL +='search/'+q
  }
  return openApi.getData(searchURL).then((response) => {
    return {results:response}
  })
}
</script>