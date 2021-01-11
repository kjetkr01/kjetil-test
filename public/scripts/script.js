// usage : let resp = isGymOpen();

function isGymOpen() {

    if (showGymCloseTime === true) {
        console.log("showing gym close time")

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
}


// usage : partOfDayMessage("Kjetil Kristiansen")

function partOfDayMessage(displayName) {

    let usermessage = "";
    let messageWithName = true;
    let partOfDay = "";
    let firstName = "";

    if (!displayName || displayName.length < 3) {
        messageWithName = false;
    } else {
        firstName = displayName.split(" ");
        firstName = firstName[0];
    }

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

    if (messageWithName) {
        usermessage = `God ${partOfDay}, ${firstName}.`;
    } else {
        usermessage = `God ${partOfDay}.`;
    }

    return usermessage;
}


// let resp = await whatToTrainToday();

async function whatToTrainToday() {

    let dayTxt = "";
    let usermessage = "";

    if (token && user) {

        const body = { "authToken": token, "userInfo": user };
        const url = `/user/whatToTrainToday`;

        const resp = await callServerAPI(body, url);

        if (resp) {

            let program = resp;

            const day = new Date().getDay();

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

            if (program[dayTxt].length > 0 && program[dayTxt] !== "Fri") {
                usermessage = `I dag (${dayTxt.toLowerCase()}) skal du trene ${program[dayTxt]}.`;
            } else {
                usermessage = `I dag (${dayTxt}) har du fri.`;
            }

        }

    } else {
        console.log("Invalid token, username skipped whatToTrainToday")
    }

    return usermessage;

}

//

async function whoIsWorkingOutToday() {

    let info = {};

    if (token && user) {

        const body = { "authToken": token, "userInfo": user };
        const url = `/whoIsWorkingOutToday`;

        const resp = await callServerAPI(body, url);

        if (resp) {
            info = resp;
        }

    } else {
        console.log("Invalid token, username skipped whoIsWorkingOutToday")
    }

    return info;

}