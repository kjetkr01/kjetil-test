// displayInformation
function displayInformation() {

    if (!info) {
        return;
    }

    displayname = info.displayname;
    age = info.info.age;
    height = info.info.height
    weight = info.info.weight;
    program = info.trainingsplit;
    lifts = info.lifts;
    goals = info.goals;

    if (info.settings) {
        settings = info.settings;
    }

    const infoList = document.getElementById("infoList");

    if (displayname) {
        document.getElementById("displayname").innerHTML = displayname;
    }
    /* old version
    if (age) {
        infoList.innerHTML = `
        <tr>
        <td>${age} år</td>
        </tr>
        `;
    }
    if (height) {
        infoList.innerHTML += `
        <tr>
        <td>${height} cm</td>
        </tr>
        `;
    }
    if (weight) {
        infoList.innerHTML += `
        <tr>
        <td>${weight} kg</td>
        </tr>
        `;
    }
    */

    // new version

    let infoString = "";

    if (age) {
        infoString += `<td>${age} år</td>`;
    }
    if (height) {
        infoString += `<td>${height} cm</td>`;
    }
    if (weight) {
        infoString += `<td>${weight} kg</td>`;
    }

    if (infoString) {
        infoList.innerHTML = `<tr>${infoString}</tr>`;
    }

    //

    if (program) {

        let dayTxt = "";
        let usermessage = "";

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
            usermessage = `Trener i dag: ${program[dayTxt]}.`;
        } else {
            usermessage = `Trener ikke i dag.`;
        }

        const checkWorkoutTodayDiv = document.getElementById("workoutToday");

        if (checkWorkoutTodayDiv) {
            checkWorkoutTodayDiv.innerHTML = usermessage;
        }

        changelistContent(sessionStorage.getItem("currentListContent"));

    }

}

// end of displayInformation