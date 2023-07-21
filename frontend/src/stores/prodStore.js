import { ref, computed, reactive, toRaw } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import Client from "@/api/Client";

let api = Client;
export const useProductStore = defineStore("api", () => {
    let navbarCategories = reactive([]);
    let cartItems = reactive([]);

    let categories = reactive([]);
    let subCategories = reactive([]);

    let randomCategories = reactive([]);

    function getCategory() {
        api.getData("category/get", true).then((resp) => {
            navbarCategories.splice(0);
            if (Array.isArray(resp)) {
                resp.forEach((data) => {
                    navbarCategories.push(data);
                });
            }
            getRandomSubObjects();
            saveCategoriesAndSubCategories();
        });
    }

    function saveCategoriesAndSubCategories() {
        categories.splice(0);
        subCategories.splice(0);
        for (let cat = 0; cat < navbarCategories.length; cat++) {
            let exists = categories.findIndex(i => {
                return i._id === navbarCategories[cat]._id;
            });
            if (exists <= -1) {
                categories.push(navbarCategories[cat]);
            }
            for (let sub = 0; sub < navbarCategories[cat].sub_categories.length; sub++) {
                let subExists = subCategories.findIndex(j => {
                    return j._id === navbarCategories[cat].sub_categories[sub]._id;
                });
                if (subExists <= -1) {
                    subCategories.push(navbarCategories[cat].sub_categories[sub]);
                }
            }
        }
    }

    function getRandomSubObjects() {
        let num = 4;
        randomCategories.splice(0);
        const flatArr = navbarCategories.reduce((acc, obj) => {
            return acc.concat(obj.sub_categories);
        }, []);
        const maxNum = Math.min(num, flatArr.length);
        for (let i = 0; i < maxNum; i++) {
            const randomIndex = Math.floor(Math.random() * flatArr.length);
            randomCategories.push(flatArr[randomIndex]);
            flatArr.splice(randomIndex, 1);
        }
        return randomCategories;
    }


    let totalCartPrice = computed(() => {
        let price = 0;
        cartItems.forEach((it) => {
            price += it.stock * it.price;
        });
        return price;
    });

    function addItemToCart(cart) {
        let alreadyExists = checkIfProductAlreadyExists(cart.id);
        if (alreadyExists > -1) {
            api.showNotification("error", "Product Already In Cart", "Please add another product");
        } else {
            api.showNotification("success", "Product Added To Cart", "Click on cart icon at the top to checkout");
            cartItems.push(cart);
        }
    }

    function checkIfProductAlreadyExists(id) {
        return cartItems.findIndex(i => {
            return i.id === id;
        });
    }

    function updateCartStock(prod, quantity) {
        let alreadyExists = checkIfProductAlreadyExists(prod.id);
        if (alreadyExists > -1) {
            cartItems[alreadyExists].stock = parseInt(quantity);
            api.showNotification("success", "Product stock updated", "Click on cart icon at the top to checkout");
        }
    }

    function removeCartItem(index) {
        cartItems.splice(index, 1);
    }

    return {
         
        navbarCategories,
        cartItems,
        addItemToCart,
        totalCartPrice,
        updateCartStock,
        removeCartItem,
        getRandomSubObjects,
        randomCategories,
        checkIfProductAlreadyExists,
        categories,
        subCategories,
        getCategory
    };
});