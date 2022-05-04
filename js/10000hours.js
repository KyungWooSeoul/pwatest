
const startButton = document.querySelector(".start_btn");
const result = document.querySelector(".result");
const modal = document.querySelector("#modal");
//const openButton = document.querySelector(".modal_btn");
const closeButton = document.querySelector(".close_btn");
const shareButton = document.querySelector(".share_btn");
const loading = document.querySelector(".result_loading");

function calculator() {
    const fieldValue = document.querySelector("#field_value");
    let timeValue = document.querySelector("#time_value");
    let timeValue_int = Number(timeValue.value);

    const fieldResult = document.querySelector(".field_result");
    const timeResult = document.querySelector(".time_result");


    if(fieldValue.value == "") {
        alert('입력되지 않았습니다.');
        fieldValue.focus();
        return false;
    } else if (timeValue.value== "") {
        alert('입력되지 않았습니다.');
        timeValue.focus();
        return false;
    } else if (timeValue_int > 24) {
        alert('잘못된 값입니다. 24이하의 값을 입력해 주세요.');
        return false;
    }

    result.style.display = "none";
    loading.style.display = "flex";

    setTimeout(function() {
        loading.style.display = "none";
        result.style.display = "flex";
        fieldResult.innerText = fieldValue.value;
        timeResult.innerText = parseInt((10000/timeValue_int), 10);
    }, 1800);   
}

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if(event.target == modal) {
        closeModal();
    }
};

function copyUrl() {
    let url = window.location.href;
    let tmp = document.createElement('input');
    

    document.body.appendChild(tmp);
    tmp.value = url;
    tmp.select();
	document.execCommand("copy");
    document.body.removeChild(tmp);
    
	alert("URL이 복사되었습니다"); 

  $.ajax({
    url:'https://jsonplaceholder.typicode.com/posts',
    type:'POST',
    dataType: 'json',
    error: function(error){
      console.log(error);
    },
    success: function(data){
      console.log(JSON.stringify(data));
    }
  });
}

shareButton.addEventListener('click', copyUrl);
//openButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
startButton.addEventListener("click", calculator);



"use strict";

//const notificationButton = document.getElementById("enableNotifications");
const notificationButton = document.querySelector(".modal_btn");
let swRegistration = null;

initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");

    //Register the service worker
    navigator.serviceWorker
      .register("pwabuilder-sw.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);

        swRegistration = swReg;
        initializeUi();
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });
  } else {
    console.warn("Push messaging is not supported");
    notificationButton.textContent = "Push Not Supported";
  }
}

function initializeUi() {
  notificationButton.addEventListener("click", () => {
    displayNotification();
  });
}



function displayNotification() {
  if (window.Notification && Notification.permission === "granted") {
    notification();
  }
  // If the user hasn't told if he wants to be notified or not
  // Note: because of Chrome, we are not sure the permission property
  // is set, therefore it's unsafe to check for the "default" value.
  else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    // If the user refuses to get notified
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function notification() {
  const options = {
    body: "Testing Our Notification",
    icon: "./bell.png"
  };
  swRegistration.showNotification("PWA Notification!", options);
}



function webpush() {
  Notification.requestPermission().then((status) => {
    console.log('Notification 상태', status);
  
    if (status === 'denied') {
      alert('Notification 거부됨');
    } else if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register('pwabuilder-sw.js') // serviceworker 등록
        .then(function (registration) {
          const subscribeOptions = {
            userVisibleOnly: true,
            // push subscription이 유저에게 항상 보이는지 여부. 알림을 숨기는 등 작업이 들어가지는에 대한 여부인데, 크롬에서는 true 밖에 지원안한다.
            // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user
            applicationServerKey: 'BPlQStBNhnosrV7oXiVk3uAndJCOMLjCC0sh2J1_T1-KEpbWW9lTh10gQcOeFVkzERW-UddrnO2BqNbFzkDXudY', // 발급받은 vapid public key
          };
  
          return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function (pushSubscription) {
          // subscription 정보를 저장할 서버로 보낸다.
          postSubscription(pushSubscription);
        });
    }
  });
}




