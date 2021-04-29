// usage : let resp = isGymOpen();

function isGymOpen() {

    //const da = new Date("Jan 13, 2021 23:30:00"); // til testing
    const da = new Date();

    let currentTimeInMS = da.getTime();

    let monthNumber = da.getMonth();
    let day = da.getDate();
    let year = da.getFullYear();
    let isOpenMessage = "", timeLeftMessage = "", timeLeftString = "";

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const openTime = "06:00:00";
    const closeTime = "23:30:00";

    const openTimeInMS = new Date(`${monthNames[monthNumber]} ${day}, ${year} ${openTime}`).getTime();
    const closeTimeInMS = new Date(`${monthNames[monthNumber]} ${day}, ${year} ${closeTime}`).getTime();

    if (currentTimeInMS >= openTimeInMS && currentTimeInMS < closeTimeInMS) {
        //Open

        const distance = closeTimeInMS - currentTimeInMS;

        hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutesLeft = Math.ceil((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (minutesLeft === 60) {
            hoursLeft++;
            minutesLeft = 0;
            timeLeftString = `${hoursLeft} t`;
        }
        else if (minutesLeft === 0) {
            timeLeftString = `${hoursLeft} t`;
        }
        else if (hoursLeft === 0) {
            timeLeftString = `${minutesLeft} min`;
        }
        else {
            timeLeftString = `${hoursLeft} t og ${minutesLeft} min`;
        }

        isOpenMessage = `Treningssenteret er åpent!`;
        timeLeftMessage = `Stenger om ${timeLeftString}`;

    }
    else {
        //Closed

        let distance = openTimeInMS - currentTimeInMS;

        if (openTimeInMS < currentTimeInMS) {
            distance = (openTimeInMS + 86400000) - currentTimeInMS;
        }

        hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutesLeft = Math.ceil((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (minutesLeft === 60) {
            hoursLeft++;
            minutesLeft = 0;
            timeLeftString = `${hoursLeft} t`;
        }
        else if (minutesLeft === 0) {
            timeLeftString = `${hoursLeft} t`;
        }
        else if (hoursLeft === 0) {
            timeLeftString = `${minutesLeft} min`;
        }
        else {
            timeLeftString = `${hoursLeft} t og ${minutesLeft} min`;
        }

        isOpenMessage = `Treningssenteret er stengt!`;
        timeLeftMessage = `Åpner om ${timeLeftString}`;

    }

    return { "message": isOpenMessage, "timeLeft": timeLeftMessage };

}


// usage : partOfDayMessage("Kjetil Kristiansen")

function partOfDayMessage(displayName) {

    let message = "";
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

    if (hours >= 0 && hours <= 4) {
        partOfDay = "natt";
    }
    else if (hours > 4 && hours <= 10) {
        partOfDay = "morgen";
    }
    else if (hours > 10 && hours <= 18) {
        partOfDay = "ettermiddag";
    }
    else if (hours > 18 && hours <= 24) {
        partOfDay = "kveld";
    }

    if (messageWithName) {
        message = `God ${partOfDay},`;
    } else {
        message = `God ${partOfDay}.`;
    }

    return { "message": message, "firstName": firstName };
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