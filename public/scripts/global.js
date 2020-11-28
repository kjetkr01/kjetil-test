function isGymOpen() {

    const openTime = 6; // 6
    const closeTime = 23; // 23

    let isOpenMessage = "";
    let timeLeftMessage = "";
    let timeLeftString = "";

    let hoursLeft = 0;
    let minutesLeft = 0;

    const today = new Date();

    let hours = today.getHours();
    let minutes = today.getMinutes();

    let total = (hours * 60) + minutes;


    let testTime = closeTime * 60;
    let calc = testTime - total;

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

        testTime = openTime * 60;
        calc = total - testTime;

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