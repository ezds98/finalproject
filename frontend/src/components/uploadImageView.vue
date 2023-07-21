<template>
    <template v-if="imageURL">
        <v-lazy-image :class="imageClass" :style="imageStyle" :src="imageURL" />
    </template>
    <template v-else>
        <img :class="imageClass" class="p-10" :style="imageStyle" src="../assets/samplePic.png">
    </template>
</template>
<script setup>
import VLazyImage from "v-lazy-image";
import { ref, watch } from "vue";
import Client from "../api/Client";
import avatarSvg from "../assets/avatarSvg.svg";

let imageURL = ref(null);
let props = defineProps(["imgId", "imageClass", "imageStyle"]);
let api = Client;

imageURL.value = null;

function getImage() {
    api.getData("upload/get/" + props.imgId).then((resp) => {
        console.log(resp);
        imageURL.value = resp.url;
    });
}

function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

if (isValidHttpUrl(props.imgId)) {
    imageURL.value = props.imgId;
} else if (props.imgId) {
    getImage();
}

watch((props), () => {
    if (isValidHttpUrl(props.imgId)) {
        imageURL.value = props.imgId;
    } else if (props.imgId) {
        getImage();
    }
});


</script>