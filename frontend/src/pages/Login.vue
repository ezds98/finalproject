<template>
  <div class="relative">
    <div v-if="faceIOLoaded" id="faceio-modal"></div>
    <img class="absolute w-full h-full top-0 z-4" src="../assets/pexels-karolina-grabowska-5632402.jpg"/>
    <div
      class="min-h-screen flex flex-col items-center justify-center relative"
    >
    
      <div
        class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md z-5"
      >
        <div
          class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800"
        >
          <span>
            {{
              isLoginMode ? "Login To Your Account" : "Register a new account"
            }}
          </span>
        </div>
        <template v-if="isLoginMode">
          <!--

            <button
            type="button"
            @click="authenticateUser"
            class="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200"
          >
            <span
              class="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500"
            >
              <i class="fab fa-facebook-f"></i>
            </span>
            <span>{{
              faceIOLoaded
                ? "Login with Face Recognition"
                : "Loading faceIO......"
            }}</span>
          </button>

          -->
          
          
          <div class="mt-10">
            <form>
              <div class="flex flex-col mb-6">
                <label
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >Email/Username</label
                >
                <div class="relative">
                  <input
                    v-model="loginData.email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="E-Mail Address"
                  />
                </div>
              </div>
              <div class="flex flex-col mb-6">
                <label
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >Password</label
                >
                <div class="relative">
                  <input
                    v-model="loginData.password"
                    @keypress.enter="authLoginUser(null)"
                    type="password"
                    name="password"
                    autocomplete="password"
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
                    </div>

              <div class="flex w-full">
                <button
                  type="button"
                  @click="authLoginUser(null)"
                  class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                >
                  <span class="mr-2 uppercase">Login</span>
                </button>
              </div>
            </form>
          </div>
        </template>
        <template v-else>
          <div class="mt-10">
            <form>
              <div class="flex flex-col mb-6">
                <label
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >Full Name</label
                >
                <div class="relative">
                  <input
                    v-model="registerData.full_name"
                    type="text"
                    name="full_name"
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div class="flex flex-col mb-6">
                <label
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >Email/Username</label
                >
                <div class="relative">
                  <input
                    v-model="registerData.email"
                    type="email"
                    name="email"
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="E-Mail Address"
                  />
                </div>
              </div>
              <div class="flex flex-col">
                <label
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >Password</label
                >
                <div class="relative">
                  <input
                    v-model="registerData.password"
                    type="password"
                    name="password"
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
              </div>
              <!--

                <div class="flex flex-col my-6">
                <label
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >Add facial data for quicker login</label
                >
                <button
                  type="button"
                  @click="enrollNewUser"
                  class="relative border rounded-md py-2 text-sm text-gray-800 bg-gray-300 hover:bg-gray-200"
                >
                  <span
                    class="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500"
                  >
                    <i class="fab fa-facebook-f"></i>
                  </span>
                  <span>{{
                    faceIOLoaded
                      ? "Create new face data"
                      : "Loading faceIO......"
                  }}</span>
                </button>
              </div>

              -->
              
              <div class="flex w-full mt-4">
                <button
                  type="button"
                  @click="registerUser(null)"
                  class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                >
                  <span class="mr-2 uppercase">Sign Up</span>
                </button>
              </div>
            </form>
          </div>
        </template>
        <div class="flex justify-center items-center mt-6">
          <a
            @click="changeLoginMode"
            target="_blank"
            class="cursor-pointer inline-flex items-center font-bold text-blue-500 hover:text-blue-700 hover:underline text-xs text-center"
          >
            <span class="ml-2">
              {{
                isLoginMode
                  ? "Don't have an account? Create new here"
                  : "Already have an account? Login here"
              }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import { onMounted, reactive, ref } from "vue";
import Client from "../api/Client.js";
import { useRouter } from "vue-router";

let router = useRouter()

let api = Client;

let isLoginMode = ref(true);
let loginData = reactive({
  email: "",
  password: "",
});
let registerData = reactive({
  full_name: "",
  email: "",
  password: "",
});
let faceIOLoaded = ref(false);
let faceIOInstance = null;

function changeLoginMode() {
  isLoginMode.value = !isLoginMode.value;
}

function registerUser(faceId) {
  let postData = {
    email: registerData.email,
    full_name: registerData.full_name,
    facial_login_enrolled: faceId ? true : false,
    password: registerData.password,
    facialId: faceId ? faceId : null,
  };
  api.postData("user", postData).then((resp)=>{
    console.log(resp)
    if(resp.error){
      api.showNotification('error',resp.data?resp.data:'Error','Please update the fields')
      return;
    }
    api.showNotification('success','User Created Successfully','Done')
    setTimeout(()=>{
      router.push({path:'/admin/login'})
      location.reload()
    },1000)
    
  }).catch((err)=>{
    console.log(err)
  })
}

function authLoginUser(faceId) {
  console.log(faceId);
  api.loginUser({
    email: loginData.email,
    password: loginData.password,
    facialId: faceId !== null ? faceId : null,
  }).then((response)=>{
    if(!response.error) {
      api.showNotification('success','Login Successfully','Done')
      router.push({path:'/'})
      
    }
  })

}

function enrollNewUser() {
  console.log(faceIOInstance);
  // Start the facial enrollment process
  faceIOInstance
    .enroll({
      enrollIntroTimeout: 5,
      idleTimeout: 10,
      userConsent: true,
      locale: "auto", // Default user locale
      payload: {
        /* The payload we want to associate with this user
         * which is forwarded back to us upon future
         * authentication of this particular user.*/
        email: registerData.email,
        full_name: registerData.full_name,
      },
    })
    .then((userInfo) => {
      registerUser(userInfo.facialId);
      // User Successfully Enrolled!
      // handle success, save the facial ID, redirect to dashboard...
    })
    .catch((errCode) => {
      handleError(errCode)
      setTimeout(function(){
        location.reload()
      },3000)

      console.log(document.querySelector('#fioCloseBtn'))
      faceIOInstance.restartSession({})
      console.log(errCode);
      // handle enrollment failure. Visit:
      // https://faceio.net/integration-guide#error-codes
      // for the list of all possible error codes
    });
}
function handleError(errCode) {
		// Log all possible error codes during user interaction..
		// Refer to: https://faceio.net/integration-guide#error-codes
		// for a detailed overview when these errors are triggered.
		switch (errCode) {
			case fioErrCode.PERMISSION_REFUSED:
				console.log("Access to the Camera stream was denied by the end user");
				break;
			case fioErrCode.NO_FACES_DETECTED:
				console.log("No faces were detected during the enroll or authentication process");
				break;
			case fioErrCode.UNRECOGNIZED_FACE:
				console.log("Unrecognized face on this application's Facial Index");
				break;
			case fioErrCode.MANY_FACES:
				console.log("Two or more faces were detected during the scan process");
				break;
			case fioErrCode.FACE_DUPLICATION:
				console.log("User enrolled previously (facial features already recorded). Cannot enroll again!");
				break;
			case fioErrCode.PAD_ATTACK:
				console.log("Presentation (Spoof) Attack (PAD) detected during the scan process");
				break;
			case fioErrCode.FACE_MISMATCH:
				console.log("Calculated Facial Vectors of the user being enrolled do not matches");
				break;
			case fioErrCode.WRONG_PIN_CODE:
				console.log("Wrong PIN code supplied by the user being authenticated");
				break;
			case fioErrCode.PROCESSING_ERR:
				console.log("Server side error");
				break;
			case fioErrCode.UNAUTHORIZED:
				console.log("Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information");
				break;
			case fioErrCode.TERMS_NOT_ACCEPTED:
				console.log("Terms & Conditions set out by FACEIO/host application rejected by the end user");
				break;
			case fioErrCode.UI_NOT_READY:
				console.log("The FACEIO Widget could not be (or is being) injected onto the client DOM");
				break;
			case fioErrCode.SESSION_EXPIRED:
				console.log("Client session expired. The first promise was already fulfilled but the host application failed to act accordingly");
				break;
			case fioErrCode.TIMEOUT:
				console.log("Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)");
				break;
			case fioErrCode.TOO_MANY_REQUESTS:
				console.log("Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications");
				break;
			case fioErrCode.EMPTY_ORIGIN:
				console.log("Origin or Referer HTTP request header is empty or missing");
				break;
			case fioErrCode.FORBIDDDEN_ORIGIN:
				console.log("Domain origin is forbidden from instantiating fio.js");
				break;
			case fioErrCode.FORBIDDDEN_COUNTRY:
				console.log("Country ISO-3166-1 Code is forbidden from instantiating fio.js");
				break;
			case fioErrCode.SESSION_IN_PROGRESS:
				console.log("Another authentication or enrollment session is in progress");
				break;
			case fioErrCode.NETWORK_IO:
			default:
				console.log("Error while establishing network connection with the target FACEIO processing node");
				break;
		}
	}
function authenticateUser() {
  // Authenticate a previously enrolled user
  faceIOInstance
    .authenticate({
      locale: "auto", // Default user locale
    })
    .then((userData) => {
      authLoginUser(userData.facialId);
      console.log("Success, user identified");
      // Grab the facial ID linked to this particular user which will be same
      // for each of his successful future authentication. FACEIO recommend
      // that your rely on this Facial ID if you plan to uniquely identify
      // all enrolled users on your backend for example.
      console.log("Linked facial Id: " + userData.facialId);
      // Grab the arbitrary data you have already linked (if any) to this particular user
      // during his enrollment via the payload parameter of the enroll() method.
      console.log("Payload: " + JSON.stringify(userData.payload));

      
      // {"whoami": 123456, "email": "john.doe@example.com"} set via enroll()
    })
    .catch((errCode) => {
      handleError(errCode)
      console.log(errCode)
      setTimeout(function(){
        location.reload()
      },3000)
      console.log(document.querySelector('#fioCloseBtn'))
      faceIOInstance.restartSession({})
      // handle authentication failure. Visit:
      // https://faceio.net/integration-guide#error-codes
      // for the list of all possible error codes
    });
}

function loadFaceIO() {
  faceIOInstance = new faceIO("fioa1eef");
  faceIOLoaded.value = true;
}

onMounted(() => {
  let script = document.createElement("script");
  script.setAttribute("src", "https://cdn.faceio.net/fio.js");
  script.onload = () => {
    loadFaceIO();
  };
  document.head.appendChild(script);
});
</script>
