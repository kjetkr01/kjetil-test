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



    //



    /* old version

    const openTime = 6; // 6
    const closeTime = 23; // 23

    const today = new Date();

    let isOpenMessage = "";
    let timeLeftMessage = "";
    let timeLeftString = "";

    let hoursLeft = 0;
    let minutesLeft = 0;

    let hours = today.getHours();


    hours = 1;

    const minutes = today.getMinutes();

    const total = (hours * 60) + minutes;

    let checkTime = closeTime * 60;
    let calc = checkTime - total;

    if (calc > 0 && hours >= openTime) {
        console.log("åpent")

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
        console.log("stengt")

        checkTime = openTime * 60;
        calc = total - checkTime;

        calc = calc / 60;

        if (hours >= 0) {

            // etter 0
            hoursLeft = Math.trunc(calc - 24);
            minutesLeft = Math.round((hoursLeft - (calc - 24)) * 60);

        } else {

            //før 0
            hoursLeft = Math.trunc(24 - calc);
            minutesLeft = Math.round(calc - hoursLeft * 60);

        }




        console.log(hoursLeft + ":" + minutesLeft)

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

    */

    return { "message": isOpenMessage, "timeLeft": timeLeftMessage };
}


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