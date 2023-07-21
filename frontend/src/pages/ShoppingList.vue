<template>
  <div class="bg-gray-50">
    <div v-if="prodStore.cartItems.length > 0" class="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">Checkout</h2>
      <form class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <h2 class="sm:col-span-2 text-lg font-medium text-gray-900">Contact information</h2>
            <div v-for="form in customerForm" :class="form.class">
              <div class="mt-4">
                <label :for="form.key" class="block text-sm font-medium text-gray-700">{{ form.name }}</label>
                <div class="mt-1">
                  <input @input="validateInput(form)" @focusout="validateForm(form)" v-model="form.details" type="text"
                    :name="form.key" :autocomplete="form.key"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <label v-if="form.error" class="text-red-600 text-sm">{{ form.error }}</label>
              </div>
            </div>
          </div>
          <div class="mt-5 border-t border-gray-200 pt-5">
            <RadioGroup v-model="selectedDeliveryMethod">
              <RadioGroupLabel class="text-lg font-medium text-gray-900">Payment method</RadioGroupLabel>
              <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <RadioGroupOption as="template" v-for="deliveryMethod in deliveryMethods" :key="deliveryMethod.id"
                  :value="deliveryMethod" v-slot="{ checked, active }">
                  <div
                    :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'ring-2 ring-indigo-500' : '', 'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none']">
                    <span class="flex flex-1">
                      <span class="flex flex-col">
                        <RadioGroupLabel as="span" class="block text-sm font-medium text-gray-900">{{ deliveryMethod.title
                        }}</RadioGroupLabel>
                        <RadioGroupDescription as="span" class="mt-1 flex items-center text-sm text-gray-500">{{
                          deliveryMethod.turnaround }}</RadioGroupDescription>
                        <RadioGroupDescription as="span" class="mt-6 text-sm font-medium text-gray-900">{{
                          deliveryMethod.price }}</RadioGroupDescription>
                      </span>
                    </span>
                    <CheckCircleIcon v-if="checked" class="h-5 w-5 text-indigo-600" aria-hidden="true" />
                    <span
                      :class="[active ? 'border' : 'border-2', checked ? 'border-indigo-500' : 'border-transparent', 'pointer-events-none absolute -inset-px rounded-lg']"
                      aria-hidden="true" />
                  </div>
                </RadioGroupOption>
              </div>
            </RadioGroup>
          </div>
          <div class=" py-6 ">
            <a href="#confirm-order" type="button" class="text-indigo-800 underline">Confirm Order To Finish</a>
          </div>
        </div>

        <!-- Order summary -->
        <div class="mt-10 lg:mt-0">
          <h2 class="text-lg font-medium text-gray-900">Order summary</h2>

          <div class="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h3 class="sr-only">Items in your cart</h3>
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="(product, ind) in prodStore.cartItems" :key="product.id" class="flex py-6 px-4 sm:px-6">
                <div class="flex-shrink-0">
                  <UploadImageView :img-id="product.image" image-class="w-20 rounded-md" />
                </div>

                <div class="ml-6 flex flex-1 flex-col">
                  <div class="flex">
                    <div class="min-w-0 flex-1">
                      <h4 class="text-sm">
                        <a class="font-medium text-gray-700 hover:text-gray-800">{{ product.name }}</a>
                      </h4>
                      <p class="mt-1 text-sm text-gray-500">{{ product.category.name }}</p>
                      <p class="mt-1 text-sm text-gray-500">{{ product.sub_category.name }}</p>
                    </div>

                    <div class="ml-4 flow-root flex-shrink-0">
                      <button @click="prodStore.removeCartItem(ind)" type="button"
                        class="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Remove</span>
                        <TrashIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-1 items-end justify-between pt-2">
                    <p class="mt-1 text-sm font-medium text-gray-900">$ {{ product.price }}</p>

                    <div class="ml-4">
                      <label for="quantity" class="sr-only">Quantity</label>
                      <select v-model.number="product.stock"
                        @input="prodStore.updateCartStock(product, $event.currentTarget.value)" id="quantity"
                        name="quantity"
                        class="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <dl id="confirm-order" class="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
              <div class="flex items-center justify-between">
                <dt class="text-sm">Subtotal</dt>
                <dd class="text-sm font-medium text-gray-900">${{ prodStore.totalCartPrice }}</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-sm">Shipping</dt>
                <dd class="text-sm font-medium text-gray-900">FREE</dd>
              </div>
              <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt class="text-base font-medium">Total</dt>
                <dd class="text-base font-medium text-gray-900">${{ prodStore.totalCartPrice }}</dd>
              </div>
            </dl>

            <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
              <button @click="confirmOrder" type="button"
                class="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Confirm
                order</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <AlertComponent heading="No Items Added In Shopping Cart!"
        details="Please add items inside of the cart to checkout."></AlertComponent>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'
import Client from "@/api/Client";
import { useProductStore } from "@/stores/prodStore";
import UploadImageView from "@/components/uploadImageView.vue";
import index from "v-lazy-image";
import AlertComponent from "@/components/AlertComponent.vue";
import KhaltiCheckout from "khalti-checkout-web";
import router from "@/router";

let prodStore = useProductStore()

let config = {
  // replace this key with yours
  "publicKey": "test_public_key_40c4538f493b42d9ae84b60b3cf3e085",
  "productIdentity": "1234567890",
  "productName": "Drogon",
  "productUrl": "http://gameofthrones.com/buy/Dragons",
  "eventHandler": {
    onSuccess(payload) {
      // hit merchant api for initiating verfication
      console.log(payload);
    },
    // onError handler is optional
    onError(error) {
      // handle errors
      console.log(error);
    },
    onClose() {
      console.log('widget is closing');
    }
  },
  "paymentPreference": ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
};

let checkout = new KhaltiCheckout(config);

function khaltiCheckout() {
  checkout.show({ amount: 1000 });
}

let customerForm = reactive([


  {
    name: "Address*",
    class: "sm:col-span-2",
    key: "address",
    details: "",
    error: "",
    isRequired: true,
    focusedOut: false,
  },
  {
    name: "Apartment, suite, etc. (Optional)",
    class: "sm:col-span-2",
    key: "apartment",
    details: "",
    error: "",
    isRequired: false,
    focusedOut: false,
  },
  {
    name: "City*",
    class: "",
    key: "city",
    details: "",
    error: "",
    isRequired: true,
    focusedOut: false,
  },
  {
    name: "State / Province (Optional)",
    class: "",
    key: "state",
    details: "",
    error: "",
    isRequired: false,
    focusedOut: false,
  },
  {
    name: "Phone*",
    class: "sm:col-span-2",
    key: "phone",
    details: "",
    error: "",
    isRequired: true,
    focusedOut: false,
  },
])

let api = Client

const products = [
  {
    id: 1,
    title: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Black',
    size: 'Large',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/checkout-page-02-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 1,
    title: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Black',
    size: 'Large',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/checkout-page-02-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  // More products...
]
const deliveryMethods = [
  { id: 1, title: 'Payment On Delivery', turnaround: '4–10 business days', price: '$0.00' },
]

const selectedDeliveryMethod = ref(deliveryMethods[0])

let validateEmail = computed(() => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerInfo.value.email)) {
    return false
  }
  return true
})

function validateForm(data) {
  data.focusedOut = true;
  if (data.key === 'email') {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.details))) {
      data.error = "Invalid Email"
      return false;
    }
    else {
      data.error = ""
      return true;
    }
  }
  else if (data.key === 'phone') {
    if (!(/^(?:(?:\+|00)([1-9]{1}[0-9]{0,2}))?[-. ]?(\()?[1-9]{1}[0-9]{2}(\))?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/.test(data.details))) {
      data.error = "Invalid Phone"
      return false;
    }
    else {
      data.error = ""
      return true;
    }
  }
  else if (data.isRequired) {
    if (!data.details || data.details === "" || data.details.length < 3) {
      data.error = "This field cannot be empty and less than 3 characters."
      return false;
    }
    else {
      data.error = ""
      return true;
    }
  }
  return true
}

function confirmOrder() {
  let hasErrors = false
  let postObject = {

  }
  for(let form of customerForm) {
    validateForm(form)
    if(form.error !== "" && !hasErrors){
      api.showNotification('error','Error','Please check for errors in form')
      hasErrors = true;
    }
    postObject[form.key] = form.details
  }
  if(!hasErrors) {
    api.postData('customer',postObject,'Customer Created Successfully',true).then((resp)=>{
      console.log(resp)
      let postObject = {
        customer_id: resp._id,
        payment_type:"cash",
        total_amount: prodStore.totalCartPrice,
        products:[]
      }
      for(let cartIt of prodStore.cartItems) {
        postObject.products.push({
          product : cartIt.id,
          price : parseInt(cartIt.price),
          quantity : parseInt(cartIt.stock),
          total : parseInt(cartIt.stock) * parseInt(cartIt.price)
        })
      }
      api.postData('sales',postObject,"Order Created",true).then((order)=>{
        if (!order.error) {
          let config = {
            // replace this key with yours
            "publicKey": "test_public_key_40c4538f493b42d9ae84b60b3cf3e085",
            "productIdentity": order._id,
            "productName": "Sales Id: "+order._id,
            "productUrl": "http://localhost:5173/admin/sales",
            "eventHandler": {
              onSuccess(payload) {
                // hit merchant api for initiating verfication
                console.log(payload);
                api.showNotification("success","Payment Successful","Your order will be delivered soon")
                router.push({ path: '/shopping-complete' })
              },
              // onError handler is optional
              onError(error) {
                // handle errors
                api.showNotification("error","Payment Unsuccessful","Please Try Again")
                console.log(error);
              },
              onClose() {
                console.log('widget is closing');
              }
            },
            "paymentPreference": ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
          };
          let checkout = new KhaltiCheckout(config);
          let totalAmt = parseInt(parseInt(prodStore.totalCartPrice)+"00")
          if(totalAmt > 19900){
            totalAmt = 19900
          }
          checkout.show({ amount: totalAmt });
        }
      })
    })
  }
}

function validateInput(data) {
  if (data.focusedOut) {
    validateForm(data)
  }
}

onMounted(() => {
})

</script>