import ky from 'ky'

let clientApi = ky.create({
    retry: {
        limit: 0,
    }
});

let loginApi = ky.create({
    retry: {
        limit: 0,
    }
});

export let apiURL = 'http://localhost:3000/'    

if(localStorage.getItem('accessToken')) {
    clientApi = ky.extend({
        hooks: {
            beforeRequest: [
                async (request) => {
                    try {
                        let token = localStorage.getItem('accessToken')
                        let data = await ky.post(apiURL + 'auth/verify/access-token', { json: { token: token } })
                        if (data.ok) {
                            let dat = await data.json()
                            // console.log(dat)
                            if (dat.verified) {
                                request.headers.set('Authorization', localStorage.getItem('accessToken'));
                            }
                            else {
                                try {
                                    let body = { refreshToken: localStorage.getItem('refreshToken') }
                                    const json = await ky.post(apiURL + 'auth/refresh-token', { json: body })
                                    if (json.ok) {
                                        let tokenData = await json.json()
                                        localStorage.setItem('accessToken', tokenData.accessToken);
                                        localStorage.setItem('refreshToken', tokenData.refreshToken);
                                        localStorage.setItem('userId', tokenData.id);
                                        localStorage.setItem("isMaster", loginData.isMaster);
                                        request.headers.set('Authorization', tokenData.accessToken);
                                    }
                                } catch (error) {
                                    // console.log("Go To Home")
                                }
                            }
                        }
                    } catch (error) {
                        const serverMessage = await error.response.json();
                    }
                }
            ],
        }
    });
}

class Client {
    tokenData = {};
    setClient() {
        clientApi = ky.extend({
            hooks: {
                beforeRequest: [
                    async (request) => {
                        let toast = useToast()
                        try {
                            let token = localStorage.getItem('accessToken')
                            let data = await ky.post(apiURL + 'auth/verify/access-token', { json: { token: token } })
                            if (data.ok) {
                                let dat = await data.json()
                                // console.log(dat)
                                if (dat.verified) {
                                    request.headers.set('Authorization', localStorage.getItem('accessToken'));
                                }
                                else {
                                    try {
                                        let body = { refreshToken: localStorage.getItem('refreshToken') }
                                        const json = await ky.post(apiURL + 'auth/refresh-token', { json: body })
                                        if (json.ok) {
                                            let tokenData = await json.json()
                                            localStorage.setItem('accessToken', tokenData.accessToken);
                                            localStorage.setItem('refreshToken', tokenData.refreshToken);
                                            localStorage.setItem('userId', tokenData.id);
                                            localStorage.setItem("isMaster", loginData.isMaster);
                                            request.headers.set('Authorization', tokenData.accessToken);
                                        }
                                    } catch (error) {
                                        // console.log("Go To Home")
                                    }
                                }
                            }
                        } catch (error) {
                            const serverMessage = await error.response.json();
                            toast.error(serverMessage.message)
                        }
                    }
                ],
            }
        });
    }
    setTokenData(data) {
        this.tokenData = data
    }
    checkAndAddAuthorization() {
        let tokenExists = localStorage.getItem('accessToken')
        if(tokenExists) {
            this.setToken(tokenExists)
        }
    }
    setToken(token) {
        clientApi = ky.extend({
            hooks: {
                beforeRequest: [
                    request => {
                        request.headers.set('Authorization', token);
                    }
                ]
            }
        });
    }
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
    async loginUser(body) {
        try {
            this.showLoading();
            let data = await clientApi.post("login", { prefixUrl: apiURL + "auth", json: body });
            this.hideLoading();
            if (data.ok) {
                let loginData = await data.json();
                localStorage.setItem("accessToken", loginData.accessToken);
                localStorage.setItem("refreshToken", loginData.refreshToken);
                localStorage.setItem("name", loginData.name);
                localStorage.setItem('userId', loginData.id);
                localStorage.setItem("isMaster", loginData.isMaster);
                this.setTokenData(loginData);
                this.setToken(loginData.accessToken)
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

    async postData(url, body, message, isLoading,hideToast) {
        try {
            this.checkAndAddAuthorization()
            isLoading?this.showLoading():''
            let data = await clientApi.post(url, { prefixUrl: apiURL, json: body });
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
            !hideToast?this.showNotification('error','Error',serverMessage.message):''
            return { data: serverMessage.message, error: true };
        }
    }

    async getData(url, isLoading) {
        try {
            this.checkAndAddAuthorization()
            isLoading?this.showLoading():''
            let data = await clientApi(apiURL + url);
            isLoading?this.hideLoading():''
            if (data.ok) {
                return await data.json();
            }
        } catch (error) {
            console.log(error)
            isLoading?this.hideLoading():''
            const serverMessage = await error.response.json();
            // this.showNotification('error','Error',serverMessage.message)
            return { data: serverMessage.message, error: true };
        }
    }

    async putData(url, body, message, isLoading,hideToast) {
        try {
            this.checkAndAddAuthorization()
            this.showLoading()
            let data = await clientApi.put(url, { prefixUrl: apiURL, json: body });
            this.hideLoading()
            if(data.error) {
                this.showNotification('error','Request UnSuccessful',message?message:'');
                return data.json();
            }
            else if (data.ok) {
                if(data.message) {
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
}

let client = new Client()

export default client


