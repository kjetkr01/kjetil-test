function isGymOpen() {

    const openTime = 6; // 6
    const closeTime = 23; // 23

    const today = new Date();

    let isOpenMessage = "";
    let timeLeftMessage = "";
    let timeLeftString = "";

    let hoursLeft = 0;
    let minutesLeft = 0;

    const hours = today.getHours();
    const minutes = today.getMinutes();

    const total = (hours * 60) + minutes;

    let checkTime = closeTime * 60;
    let calc = checkTime - total;

    if (calc > 0) {

        // open

        calc = calc / 60;
        hoursLeft = Math.trunc(calc);
        minutesLeft = Math.round((calc - hoursLeft) * 60);

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

        // closed

        checkTime = openTime * 60;
        calc = total - checkTime;

        calc = calc / 60;
        hoursLeft = Math.trunc(24 - calc);
        minutesLeft = Math.round(((24 - calc) - hoursLeft) * 60);

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

    return { "message": isOpenMessage, "timeLeft": timeLeftMessage };
}

function partOfDayMessage(firstName) {

    let partOfDay = "";

    const today = new Date();

    const hours = today.getHours();

    if (hours > 0 && hours <= 5) {
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