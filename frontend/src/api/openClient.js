import ky from "ky";

let openApi = ky.create({
    retry: {
        limit: 0
    }
});

export let apiURL = "http://localhost:3000/";
// "https://vijay-shop.com/api/";
// "http://localhost:3000/"


class OpenClient {
    tokenData = {};
    showNotification(type, heading, message) {
        const Notify = document.querySelector("#hub-notification");
        if (Notify) {
            const iconRef = Notify.querySelector("#notify-icon");
            if (iconRef && type === "success") {
                iconRef.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-500">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
`;
            } else if (iconRef && type === "error") {
                iconRef.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-500">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
`;
            }
            const headRef = Notify.querySelector("#notify-heading");
            if (headRef) {
                headRef.innerHTML = heading;
            }
            const messageRef = Notify.querySelector("#notify-message");
            if (messageRef) {
                messageRef.innerHTML = message;
            }
            Notify.classList.remove("invisible");
            setTimeout(function() {
                Notify.classList.add("invisible");
            }, 2000);
        }
    }
    showLoading() {
        const hubLoading = document.querySelector("#hub-loading");
        if (hubLoading) {
            hubLoading.classList.remove("hidden");
        }
    }
    hideLoading() {
        const hubLoading = document.querySelector("#hub-loading");
        if (hubLoading) {
            hubLoading.classList.add("hidden");
        }
    }
    setTokenData(data) {
        this.tokenData = data;
    }
    async loginUser(body) {
        try {
            this.showLoading();
            let data = await openApi.post("login", { prefixUrl: apiURL + "auth", json: body });
            this.hideLoading();
            if (data.ok) {
                let loginData = await data.json();
                localStorage.setItem("accessToken", loginData.accessToken);
                localStorage.setItem("refreshToken", loginData.refreshToken);
                localStorage.setItem("name", loginData.name);
                localStorage.setItem("isMaster", loginData.isMaster);
                localStorage.setItem('userId', loginData.id);
                this.setTokenData(loginData);
                this.showNotification('success','Login Successful','Logged in successfully')
                return loginData;
            }
        } catch (error) {
            this.hideLoading()
            const serverMessage = await error.response.json();
            this.showNotification('error','Error',serverMessage.message)
            return { data: serverMessage.message, error: true };
        }
    }

    async postData(url, body, message, isLoading) {
        try {
            isLoading?this.showLoading():''
            let data = await openApi.post(url, { prefixUrl: apiURL, json: body });
            isLoading?this.hideLoading():''
            if (data.ok) {
                let dat = await data.json();
                if(message && message !==''){
                    this.showNotification('success','Request Successful',message?message:'');
                }
                return dat;
            }
        } catch (error) {
            isLoading?this.hideLoading():''
            const serverMessage = await error.response.json();
            this.showNotification('error','Error',serverMessage.message)
            return { data: serverMessage.message, error: true };
        }
    }

    async getData(url, isLoading) {
        try {
            isLoading?this.showLoading():''
            let data = await openApi(apiURL + url);
            isLoading?this.hideLoading():''
            if (data.ok) {
                return await data.json();
            }
        } catch (error) {
            isLoading?this.hideLoading():''
            const serverMessage = await error.response.json();
            // this.showNotification('error','Error',serverMessage.message)
            return { data: serverMessage.message, error: true };
        }
    }

    async putData(url, body, message, isLoading,hideToast) {
        try {
            this.showLoading();
            let data = await openApi.put(url, { prefixUrl: apiURL, json: body });
            this.hideLoading();
            if (data.ok) {
                if(message){
                    this.showNotification('success','Request Successful',message?message:'');
                }
                return data.json();
            }
        } catch (error) {
            isLoading?this.hideLoading():''
            const serverMessage = await error.response.json();
            !hideToast?this.showNotification('error','Error',serverMessage.message):''
            return { data: serverMessage.message, error: true };
        }
    }

    async logoutUser(url, body, message) {
        try {
            this.showLoading()
            let data = await openApi.put(url, { prefixUrl: apiURL + "/auth", json: body });
            this.hideLoading()
            if (data.ok) {
                return data.json();
            }
        } catch (error) {
            this.hideLoading()
            const serverMessage = await error.response.json();
            this.showNotification('error','Error',serverMessage.message)
            return { data: serverMessage.message, error: true };
        }
    }
}

let openClient = new OpenClient();

export default openClient;