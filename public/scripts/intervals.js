let stopIntervals = true;
let offlineMode = false;

let checkOnline = setInterval(() => {

    if(stopIntervals){
        clearInterval(checkOnline);
        return;
    }

    let isClientOnline = window.navigator.onLine;

    console.log(`OfflineMode: ${offlineMode}`);
    document.getElementById("info").innerHTML += "<br>OfflineMode: " + offlineMode;

    if(isClientOnline){
        offlineMode = false;
    }else{
        offlineMode = true;
    }
    
}, 10000);