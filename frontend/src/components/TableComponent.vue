<template>
  <div class="flex flex-col">
    <div :key="tableUpdateKey" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <template v-for="heading in props.dataHeaders" :key="heading.key">
                <th v-if="!heading.sr_only" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{heading.name}}
                </th>
                <th v-else scope="col" class="relative px-6 py-3">
                  <div class="sr-only">{{heading.name}}</div>
                </th>
              </template>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr class="hover:bg-gray-100 cursor-pointer" @click="rowClick(person)" v-for="(person,ind) in props.datas" :key="ind" >
              <template v-for="head in props.dataHeaders">
                <td v-if="typeof head.key==='string' && head.key==='index'" class="px-6 py-4 whitespace-nowrap">
                  {{ind+1}}
                </td>
                <td v-else-if="Array.isArray(head.key) && head.key[0] in person && !head.hasSlot" class="px-6 py-4 whitespace-nowrap">
                  {{head.key.length>1?person[head.key[0]][head.key[1]]:person[head.key[0]]}}
                </td>
                <td v-else>
                  <slot v-bind:person="person" :name="head.key">
                  </slot>
                </td>
              </template>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {watch,ref} from "vue";

let emit = defineEmits()
let props = defineProps(['datas','dataHeaders'])
let tableUpdateKey = ref(0)

watch(()=>props,(params)=>{
console.log("Updated")
  tableUpdateKey.value += 1
})

function rowClick(data){
  emit('row-click',data)
}

</script>