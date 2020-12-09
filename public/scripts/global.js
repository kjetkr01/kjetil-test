//auto redirect to login if token is invalid
window.onload = validateToken;
async function validateToken() {

    if (!window.navigator.onLine) {
        console.log("Offline mode is enabled, server fetching is disabled!");
        return;
    }

    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && user) {

        const body = { "authToken": token, "userInfo": user };
        const url = `/validate`;

        const resp = await callServerAPI(body, url);

        if (resp) {

            console.log("invalid token");
            localStorage.clear();
            //location.href = "/test-login.html";
        }
    }else{
        console.log("no token/user, skipped");
        //location.href = "/test-login.html";
    }
}


function isGymOpen() {

    // new version

    const now = new Date().getTime();

    const today = new Date();
    const hours = today.getHours();

    const endMonthAndDay = "Dec 8";
    const endYear = "2022";

    const closeTimeCheck = 23; // close time
    const openTimeCheck = 6; // open time

    const closeTime = new Date(`${endMonthAndDay}, ${endYear} ${closeTimeCheck}:00:00`).getTime();
    const openTime = new Date(`${endMonthAndDay}, ${endYear} ${openTimeCheck}:00:00`).getTime();

    let isOpenMessage = "";
    let timeLeftMessage = "";
    let timeLeftString = "";

    let hoursLeft = 0;
    let minutesLeft = 0;

    if (today.getTime() > openTime) {

        isOpenMessage = ``;
        timeLeftMessage = ``;

    } else {

        if (hours > openTimeCheck && hours < closeTimeCheck) {

            const distance = closeTime - now;

            hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutesLeft = Math.ceil((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (hoursLeft < 1) {
                timeLeftString = `${minutesLeft} min`;
            } else if (minutesLeft < 0) {
                timeLeftString = `${hoursLeft} t`;
            } else {
                timeLeftString = `${hoursLeft} t og ${minutesLeft} min`;
            }

            isOpenMessage = `Treningssenteret er åpent!`;
            timeLeftMessage = `Stenger om ${timeLeftString}`;

        } else {

            const distance = openTime - now;

            hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutesLeft = Math.ceil((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (hoursLeft < 1) {
                timeLeftString = `${minutesLeft} min`;
            } else if (minutesLeft < 0) {
                timeLeftString = `${hoursLeft} t`;
            } else {
                timeLeftString = `${hoursLeft} t og ${minutesLeft} min`;
            }

            isOpenMessage = `Treningssenteret er stengt!`;
            timeLeftMessage = `Åpner om ${timeLeftString}`;
        }

    }

    return { "message": isOpenMessage, "timeLeft": timeLeftMessage };
}


// usage : partOfDayMessage("Kjetil")

function partOfDayMessage(firstName) {

    let partOfDay = "";

    const today = new Date();

    const hours = today.getHours();

    if (hours >= 0 && hours <= 5) {
        partOfDay = "natt";
    }
    else if (hours > 5 && hours <= 10) {
        partOfDay = "morgen";
    }
    else if (hours > 10 && hours <= 18) {
        partOfDay = "ettermiddag";
    }
    else if (hours > 18 && hours <= 24) {
        partOfDay = "kveld";
    }

    const usermessage = `God ${partOfDay}, ${firstName}.`;

    return usermessage;
}


// usage : let program = {"Mandag": "Bein og mage", "Tirsdag": "Rygg og biceps"}
// whatToTrainToday(program)

function whatToTrainToday(program) {

    const day = new Date().getDay();

    let dayTxt = "";
    let usermessage = "";

    switch (day) {
        case 0:
            dayTxt = "Søndag";
            break;
        case 1:
            dayTxt = "Mandag";
            break;
        case 2:
            dayTxt = "Tirsdag";
            break;
        case 3:
            dayTxt = "Onsdag";
            break;
        case 4:
            dayTxt = "Torsdag";
            break;
        case 5:
            dayTxt = "Fredag";
            break;
        case 6:
            dayTxt = "Lørdag";
            break;
    }

    if (program[dayTxt]) {
        usermessage = `I dag (${dayTxt}) skal du trene ${program[dayTxt]}.`;
    }

    return usermessage;

}