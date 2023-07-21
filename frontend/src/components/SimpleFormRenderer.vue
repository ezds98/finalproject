<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="open = false">
      <div :key="updateForm" class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div style="min-height: 600px" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4">
            <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
              <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                <div class="ml-4 mt-2">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Data Add Form
                  </h3>
                </div>
                <div @click="toggleOpen" class="ml-4 mt-2 flex-shrink-0">
                  <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center text-indigo-600 rounded-full cursor-pointer hover:bg-gray-300">
                    <XMarkIcon class="w-6 h-6" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
            <nav aria-label="Progress">
              <ol v-if="formDetails.length>0" role="list" class="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
                <li v-for="(step, stepIdx) in formDetails" :key="step.name" @click="currentStep=stepIdx" class="relative md:flex-1 md:flex">
                  <a v-if="stepIdx<currentStep" class="group flex items-center w-full">
                    <span class="px-6 py-4 flex items-center text-sm font-medium">
                      <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                        <CheckIcon class="w-6 h-6 text-white" aria-hidden="true" />
                      </span>
                      <span class="ml-4 text-sm font-medium text-gray-900">{{ step.name }}</span>
                    </span>
                  </a>
                  <a v-else-if="stepIdx===currentStep" class="px-6 py-4 flex items-center text-sm font-medium" aria-current="step">
                    <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                      <span class="text-indigo-600">{{ stepIdx+1 }}</span>
                    </span>
                    <span class="ml-4 text-sm font-medium text-indigo-600">{{ step.name }}</span>
                  </a>
                  <a v-else class="group flex items-center">
                    <span class="px-6 py-4 flex items-center text-sm font-medium">
                      <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                        <span class="text-gray-500 group-hover:text-gray-900">{{ stepIdx+1 }}</span>
                      </span>
                      <span class="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{{ step.name }}</span>
                    </span>
                  </a>
                  <template v-if="(stepIdx !== formDetails.length - 1)">
                    <!-- Arrow separator for lg screens and up -->
                    <div class="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                      <svg class="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                        <path d="M0 -2L20 40L0 82" vector-effect="non-scaling-stroke" stroke="currentcolor" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </template>
                </li>
              </ol>
            </nav>
            <div v-if="formDetails[currentStep] && 'qDetails' in formDetails[currentStep]">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div class="p-4 pb-0" :class="item.type==='product_option'?'col-span-2':item.type==='contacts_form'||item.type==='fileUpload'?'col-span-full':''" :key="ind" v-for="(item,ind) in formDetails[currentStep].qDetails">
                  <div v-if="item.type === 'text'">
                    <label class="block text-sm font-medium text-gray-700">{{item.topLabel}}</label>
                    <div class="mt-1">
                      <input :type="item.inputType" v-model="item.details" :name="item.name" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" :placeholder="item.comment" />
                    </div>
                  </div>
                  <div v-if="item.type === 'select'">
                    <Listbox v-if="!item.freeTextEnabled" as="div" v-model="item.details">
                      <ListboxLabel class="block text-sm font-medium text-gray-700">
                        {{item.comment}}
                      </ListboxLabel>
                      <div class="mt-1 relative">
                        <ListboxButton as="button" class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <span :class="item.details===''?'block h-5 truncate text-gray-500':'block h-5 truncate text-black'">{{ item.details===''?'Please Select An Option':item.details }}</span>
                          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            <ListboxOption as="template" v-for="list in item.options" :key="list.value" :value="list.value" v-slot="{ active, selected }">
                              <li @click="CheckFreeTextEnabled(list.value,item)" :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                                  {{ list.label }}
                                </span>
                                <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                    <div v-if="item.freeTextEnabled ">
                      <label class="block text-sm font-medium text-gray-700">{{item.comment}}</label>
                      <div class="mt-1">
                        <input v-model="item.details" type="text" :name="item.name" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" :placeholder="item.comment" />
                      </div>
                    </div>
                    <button v-if="item.freeTextEnabled " @click="item.freeTextEnabled = false" type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>
                  </div>
                  <div v-if="item.type === 'radio'">
                    <RadioGroup v-if="!item.freeTextEnabled" v-model="item.details">
                      <RadioGroupLabel class="mb-2">
                        {{item.comment}}
                      </RadioGroupLabel>
                      <div class="bg-white rounded-md -space-y-px">
                        <RadioGroupOption @click="CheckFreeTextEnabled(setting.value,item)" as="template" v-for="(setting, settingIdx) in item.options" :key="setting.label" :value="setting.value" v-slot="{ checked, active }">
                          <div :class="[settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '', settingIdx === item.options.length - 1 ? 'rounded-bl-md rounded-br-md' : '', checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200', 'relative border p-4 flex cursor-pointer focus:outline-none']">
                            <span :class="[checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-indigo-500' : '', 'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center']" aria-hidden="true">
                              <span class="rounded-full bg-white w-1.5 h-1.5" />
                            </span>
                            <div class="ml-3 flex flex-col">
                              <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium']">
                                {{ setting.label }}
                              </RadioGroupLabel>
                            </div>
                          </div>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                    <div v-if="item.freeTextEnabled ">
                      <label class="block text-sm font-medium text-gray-700">{{item.comment}}</label>
                      <div class="mt-1">
                        <input v-model="item.details" type="text" :name="item.name" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" :placeholder="item.comment" />
                      </div>
                    </div>
                    <button v-if="item.freeTextEnabled " @click="item.freeTextEnabled = false" type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>
                  </div>
                  <div class="pt-8" v-if="item.type === 'switch'">
                    <SwitchGroup as="div" class="flex items-center">
                      <Switch v-model="item.details" :class="[item.details ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']">
                        <span aria-hidden="true" :class="[item.details ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />
                      </Switch>
                      <SwitchLabel as="span" class="ml-3">
                        <span class="text-sm font-medium text-gray-900">{{item.comment}} </span>
                      </SwitchLabel>
                    </SwitchGroup>
                  </div>
                  <div v-if="item.type === 'textBox'" class="col-span-3">
                    <label class="block text-sm font-medium text-gray-700">{{item.topLabel}}</label>
                    <div class="mt-1">
                      <textarea v-model="item.details" :name="item.name" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" :placeholder="item.comment" />
                    </div>
                    <div v-html="item.details" class="py-4">
                    </div>
                  </div>
                  <div v-if="item.type === 'fileUpload'">
                    <div class="grid grid-cols-3">
                      <div class="pr-4 col-span-1">
                        <FileUploadComponent :details="item.details" @saveDetails="(...args)=>{saveUploadedImageToDetails(item,...args)}" :type="item.fileType" />
                      </div>
                      <div class="col-span-2 grid grid-cols-4 gap-1">
                        <div class="col-span-full block text-sm font-medium text-gray-700">
                          Added Images
                        </div>
                        <template v-if="typeof item.details==='string' && item.details!==''">
                          <div>
                            <upload-image-view :img-id="item.details"/>
                            <button @click="deleteImage(item)" type="button" class="bg-red-500 mt-3 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Delete
                            </button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="border-2 p-2" v-for="(image,index) in item.details">
                            <upload-image-view :img-id="image"/>
                            <button @click="deleteImage(item,index)" type="button" class="bg-red-500 mt-3 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Delete
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.type === 'querySearch'">
                    <query-search-renderer @saveData="querySelected" :details="item.details" :type="item.query"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="py-5 px-4">
              <button @click="currentStep++" v-if="(currentStep !== formDetails.length - 1)" type="button" class="mr-2 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Next
              </button>
              <button @click="SaveForm" v-if="!(currentStep !== formDetails.length - 1)" type="button" class="mr-2 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save
              </button>
              <button  @click="currentStep--" v-if="currentStep !==0" type="button" class="mr-2 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Back
              </button>
              <button @click="toggleOpen" type="button" class="mr-2 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import {onMounted, reactive, ref, watch, unref, isProxy} from 'vue'
import { Dialog, DialogOverlay, RadioGroup, Switch, SwitchGroup, SwitchLabel, RadioGroupLabel, RadioGroupOption, TransitionChild, TransitionRoot, Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import FileUploadComponent from "@/components/FileUploadComponent.vue";
import QuerySearchRenderer from "@/components/QuerySearchRenderer.vue";
import FormData from "../api/formData";
import UploadImageView from "@/components/uploadImageView.vue";

let currentStep = ref(0)
const open = ref(false)
let form = new FormData()
let props = defineProps(['formData'])
let emit = defineEmits(['saveData'])
let formDetails = reactive([])
let newOptionText = ref('')
let optionLabel = ref('')
let optionValue = ref(0)
let updateForm = ref(0)

function deleteImage(item,index){
  if(item.fileType==='single'){
    item.details = ''
  }
  else {
    item.details.splice(index,1)
  }
}

function saveUploadedImageToDetails(item,data){
  item.details = data
}

function addHeadOption(item){
  item.push({name:newOptionText.value,options:[]})
  newOptionText.value= ''
}

function addNewOption(mainOption){
  mainOption.options.push({
    name:optionLabel.value,
    value:optionValue.value
  })
  optionValue.value = ''
  optionLabel.value = ''
}

function SaveForm(){
  let saveData = form.createPostObject(formDetails)
  emit('saveData',saveData)
}

function toggleOpen(){
  open.value = !open.value
  resetForm()
}

function CheckFreeTextEnabled(data,list){
  if(data === 'Free Text'){
    list.freeTextEnabled = true
  }
}

function querySelected(data){
  for(let i=0;i<formDetails.length;i++){
    let ind = formDetails[i].qDetails.findIndex(j=>j.query === data.type)
    if(ind>=0){
      formDetails[i].qDetails[ind].details = data.details
    }
  }
}

function resetForm() {
  currentStep.value = 0;
  formDetails.splice(0, formDetails.length);
  formDetails.push(...props.formData);
  updateForm.value += 1;
}

onMounted(()=>{
  resetForm()
})

watch(()=>props.formData,(params)=>{
  resetForm()
})

defineExpose({toggleOpen})

</script>