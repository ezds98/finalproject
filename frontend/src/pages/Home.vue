<template>
    <div>
        <vueper-slides
            class="z-10"
            :fixed-height="getFixedHeight()"
            :breakpoints="breakpoints"
            ref="myVueperSlides"
            autoplay
            fade
            pause-on-hover
            lazy
            lazy-load-on-drag
        >
            <vueper-slide
                v-for="(slide, i) in slides"
                :key="i"
                :image="slide.image"
                style="justify-content: end;"
            >
                <template #content>
                    <div style="min-height:100%;min-width:100%" class="grid grid-cols-1">
                        <div class="flex items-end text-center">
                            <div class="pb-20 w-full">
                                <div v-html="slide.title"></div>
                                <div class="pt-5">
                                    <a
                                        :href="slide.routeURL"
                                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-800 transition"
                                    >SHOP NOW</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </vueper-slide>
            <template #pause>
                <i class="icon pause_circle_outline"></i>
            </template>
        </vueper-slides>
        <div class="container mx-auto">
            <div class="bg-white">
                <div class="mx-auto max-w-2xl py-16 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 class="text-2xl font-bold text-gray-900">Recommended Products</h2>

                    <div class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        <div v-for="product in featuredProducts" :key="product.id">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white">
                <div class="mx-auto max-w-2xl py-16 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 class="text-2xl font-bold text-gray-900">Recently Added Products</h2>

                    <div class="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        <div v-for="product in recentProducts" :key="product.id">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </div>
            </div>
            <ShowRandomRecommended />
            <div
                class="mx-auto max-w-2xl py-6 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8"
            >
                <h2 class="text-2xl font-bold text-gray-900">What others say about us?</h2>
                <div class="md:grid md:grid-cols-2 md:px-6 lg:px-8">
                    <div
                        v-for="review in reviews"
                        :key="review.review"
                        class="py-12 px-4 sm:px-6 md:flex md:flex-col md:py-16 md:pl-0 md:pr-10 lg:pr-16"
                    >
                        <blockquote class="mt-6 md:flex-grow md:flex md:flex-col">
                            <div
                                class="relative text-lg text-md md:text-lg font-medium text-gray-800 md:flex-grow"
                            >
                                <svg
                                    style="top:-20px"
                                    class="absolute left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-mainColor"
                                    fill="currentColor"
                                    viewBox="0 0 32 32"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
                                    />
                                </svg>
                                <p class="relative">{{ review.review }}</p>
                            </div>
                            <footer class="mt-8">
                                <div class="flex items-start">
                                    <div class="flex-shrink-0 inline-flex rounded-full border-2 border-white">
                                        <avatarSvg class="h-12 w-12 rounded-full" alt />
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-base font-medium text-dark">{{ review.name }}</div>
                                        <div class="text-base font-medium text-gray-400">{{ review.post }}</div>
                                    </div>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import VLazyImage from "v-lazy-image";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
import HomeMan1 from "../assets/img1.jpg";
import HomeWomen from "../assets/img2.jpg";
import HomeUnisex from "../assets/img3.jpg";
import Home3 from "../assets/Home3.jpg";


import avatarSvg from "../assets/avatarSvg.svg";
import Client from "@/api/Client";
import { onMounted, reactive, ref, watch } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "@/stores/prodStore";
import UploadImageView from "@/components/uploadImageView.vue";
import router from "@/router";
import { useRouter } from "vue-router";
import ShowRandomRecommended from "@/components/ShowRandomRecommended.vue";

const emit = defineEmits(["moveToServices"]);

let api = Client;

let featuredProducts = reactive([]);
let recentProducts = reactive([]);

let reviews = [
    {
        name: "Sushma Gurung",
        post: "Customer",
        review:
            "Been using their services for quite a bit and have never had an issue with the quality of their products. Online e-products working great as well. Highly recommend!"
    },
    {
        name: "Shiva Paudel",
        post: "Customer",
        review:
            "Honestly, I want to say that EzzyShopNepal is one of the amazing company which provides us what we want to buy.Loved it.I had purchased a lots of stuffs from EzzyShopNepal and i totally satisfied with the product. Thank You EzzyShopNepal for your effort."

    },
    {
        name: "Barsha Sharma",
        post: "Customer",
        review:
            "Almost everything is available here. Also offer things at discounted price. And I really like their services and delivery system. Strongly Recommended.!"
    },
    {
        name: "Shankar Maharjan",
        post: "Customer",
        review:
            " The site is amazing to shop it has many vendor and you can choose from a variety of goods available."

    }
];
const slides = [
    {
        image: HomeMan1,
        title:
            "<div class=\"text-3xl text-white font-bold\">SHOP PRODUCTS</div>",
        routeURL: "/products/list"
    },
    {
        image: HomeWomen,
        title: "<div class=\"text-3xl text-white font-bold\">LATEST PRODUCTS</div>",
        routeURL: "/products/list"
    },
    {
        image: HomeUnisex,
        title: "<div class=\"text-3xl text-white font-bold\">TRENDING PRODUCTS</div>",
        content:
            "Slide title can be HTML.<br>And so does the slide content, <span style=\"font-size: 1.2em;color: yellow\">why not?</span>",
        routeURL: "/products/list"
    }
];
let breakpoints = {
    1200: {
        slideRatio: 1 / 5
    },
    900: {
        slideRatio: 1 / 3
    },
    600: {
        slideRatio: 1 / 2,
        arrows: false,
        bulletsOutside: true
    },
    // The order you list breakpoints does not matter, Vueper Slides will sort them for you.
    1100: {
        slideRatio: 1 / 4
    }
};


function getFixedHeight() {
    return window.innerHeight * 0.75 + "px";
}

function getTrendingProducts() {
    api.getData("product/get/recomended",true).then((resp) => {
        console.log(resp)
        if (resp.error) {
            console.log(resp.error)
            // router.push({ path: "/admin/login" });
            return;
        }
        featuredProducts.splice(0);
        if (resp.data && Array.isArray(resp.data)) {
            resp.data.forEach((dat) => {
                featuredProducts.push(dat);
            });
        }
    });
}

function getRecentlyAddedProducts() {
    api.getData("product/get/by/recent", true).then((resp) => {
        if (resp.error) {
            router.push({ path: "/admin/login" });
            return;
        }
        recentProducts.splice(0);
        if (resp && Array.isArray(resp)) {
            resp.forEach((dat) => {
                recentProducts.push(dat);
            });
        }
    });
}


onMounted(()=>{
  getTrendingProducts()
  getRecentlyAddedProducts()
})

</script>