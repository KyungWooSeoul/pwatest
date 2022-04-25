
const startButton = document.querySelector(".start_btn");
const result = document.querySelector(".result");
const modal = document.querySelector("#modal");
//const openButton = document.querySelector(".modal_btn");
const closeButton = document.querySelector(".close_btn");
//const shareButton = document.querySelector(".share_btn");
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
}

shareButton.addEventListener('click', copyUrl);
//openButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
startButton.addEventListener("click", calculator);



"use strict";

//const notificationButton = document.getElementById("enableNotifications");
const notificationButton = document.querySelector(".modal_btn");
let swRegistration = null;

// FMC
let appServerPublicKey = 'BAoAWPpQB7bIof0oRS1e2RUD8LOQCPsJhNtlM0THhb2rCgpbH9_RizilNanWUZXDR0yAzSou2p5mi_OTZWtE-2E';
let isSubcribed = false; 
//let swRegist = null;  

initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");

    //Register the service worker
    navigator.serviceWorker
      .register("sw.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);

        swRegistration = swReg;

        initPush(); // FMC

        initializeUi();
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });

      // +FMC
      swReg.addEventListener('updatefound', () => {
        const newWorker = swReg.installing;
        console.log('Service Worker update found!');

        newWorker.addEventListener('statechange', function () {
          console.log('Service Worker state changed:', this.state);
        });
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Controller changed');
      });
// -FMC

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


// FMC
  // Push 초기화
  function initPush () {
    const pushButton = document.querySelector(".share_btn");
    pushButton.addEventListener('click', () => {
      if (isSubscribed) {
        // TODO: 구독 취소 처리
        unsubscribe();
      } else {
        subscribe();
      }
    });

    swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        isSubscribed = !(subscription === null);
        updateSubscription(subscription);

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }

        updateButton();
      });
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

    /*========== TODO: 아래에 Push 관련 로직 구현 ========== */
  // 구독 버튼 상태 갱신
  function updateButton () {
    // TODO: 알림 권한 거부 처리
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked';
      pushButton.disabled = true;
      updateSubscription(null);
      return;
    }

    const pushButton = document.getElementById('subscribe')
    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }
    pushButton.disabled = false;
  }

  // 구독 정보 갱신
  function updateSubscription (subscription) {
    // TODO: 구독 정보 서버로 전송

    let detailArea = document.getElementById('subscription_detail')

    if (subscription) {
      detailArea.innerText = JSON.stringify(subscription)
      detailArea.parentElement.classList.remove('hide')
    } else {
      detailArea.parentElement.classList.add('hide')
    }
  }

  // 알림 구독
  function subscribe () {
    const applicationServerKey = urlB64ToUint8Array(appServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(subscription => {
      console.log('User is subscribed.');
     // updateSubscription(subscription);
      isSubscribed = true;
      updateButton();
    })
    .catch(err => {
      console.log('Failed to subscribe the user: ', err);
      updateButton();
    });
  }

  // 알림 구독 취소
  function unsubscribe () {
    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(error => {
        console.log('Error unsubscribing', error);
      })
      .then(() => {
        updateSubscription(null);
        console.log('User is unsubscribed.');
        isSubscribed = false;
        updateButton();
      });
  }


