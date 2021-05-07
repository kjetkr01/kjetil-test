const application = ts_application.ts_application;
application.lastUpdated.date = getDateFormat(application.lastUpdated.day, application.lastUpdated.month, application.lastUpdated.year);

const aboutAppText = `
${application.name} er et app prosjekt utviklet av ${createBtn("Kjetil Kristiansen", "2")}.

<br><br>
Appen ble hovedsakling laget for å enkelt se ORM (One Rep Max) i ulike løft.
Kunne lage mål i ulike øvelser og enkelt sjekke progresjon før man er i mål.

<br><br>
Ha muligheten til å opprette treningsplaner, samt legge inn øvelser per dag.
Siden appen er koblet til et database system, vil muligheten for å se andre brukere sine løft, mål, progresjon og treningsplaner være veldig enkelt.

<br><br>
Hjelp til design:
${createBtn("Christoffer Simonsen", "3")},
${createBtn("Christian Jenssen")},
${createBtn("Mandius Abelsen")},
${createBtn("Szilard Andri Reynisson", "4")},
${createBtn("Sondre Olsen")}.
`;

//

const ongoingUpdatesText = "Pågående oppdateringer";
const ongoingUpdatesArr = [
    "TITLE:Innstillinger",
    "Personvern (75%)",
    "TITLE:Treningsplan",
    "Elementer: nr, øvelse, reps, sets, % utfra ORM, rpe, ingen (100%)",
    "Kunne kopiere andre brukere sine planer (0%)",
    "Kunne abonnere på andre brukere sine planer (0%)",
    "Kunne redigere treningsplanen (90%)",
    "TITLE:Offline/caching support",
    "Se treningsplan, løft, mål offline (90%)",
    "Offline og bruk av caching (90%)",
    "TITLE: Splash Screen (iOS)",
    "Fikse slik at splash screen funker på landscape mode (iPad) (50%)",
    "TITLE:Annet",
    "Optimalisering",
    "Endring i hvordan animasjoner/lasting av data funker (80%)"
];

//



//

const plannedUpdatesText = "Kommende oppdateringer";
const plannedUpdatesArr = [
    "TITLE:Farge-tema",
    "Lage flere farge-temaer",

    "TITLE:Løft/Mål",
    "Slå av sletting av løft og mål i Innstillinger.",
    "Legge til flere løft og mål. Foreløpi bare: Benkpress, Knebøy, Markløft, Skulderpress",

    "TITLE:Badges",
    "Lage flere badge farger",
    "Lage større versjon av badge (mål-badge, på startsiden)",

    "TITLE:Desktop design",
    "Optimalisere desktop design",
];

//


const aboutAppBottomInfo = `
Prosjekt oppstart: ${getDateFormat("20", "11", "2020")}
<br><br>
Sist oppdatert: ${calcDaysSinceUpdate()}
<br><br>
<a href="https://kjetkr01.github.io/" target="_blank">kjetkr01.github.io</a>
`;
/*
Full redesign: ${getDateFormat("19", "01", "2021")}
*/

// array to html
let ongoingUpdates = "", plannedUpdates = "";
for (let i = 0; i < ongoingUpdatesArr.length; i++) {
    let cText = ongoingUpdatesArr[i];
    let extraSpace = "<br>";
    if (i === 0) {
        extraSpace = "";
    }

    if (cText.includes("TITLE:")) {
        cText = cText.split("TITLE:").pop();
        ongoingUpdates += `<strong>${extraSpace}${cText}:</strong><br><br>`;
    } else {
        ongoingUpdates += `- ${cText}<br>`;
    }
}

for (let i = 0; i < plannedUpdatesArr.length; i++) {
    let cText = plannedUpdatesArr[i];
    let extraSpace = "<br>";
    if (i === 0) {
        extraSpace = "";
    }

    if (cText.includes("TITLE:")) {
        cText = cText.split("TITLE:").pop();
        plannedUpdates += `<strong>${extraSpace}${cText}:</strong><br><br>`;
    } else {
        plannedUpdates += `- ${cText}<br>`;
    }
}
//


function createBtn(aUserFullname, aUserID) {

    if (aUserFullname) {
        const userFullname = aUserFullname;
        const userid = aUserID;
        let onClickLink = "";
        let extraClasses = "";

        if (userid) {
            onClickLink = `onClick="viewUser('${userid}');"`;
            extraClasses = "settingsHightlightUser pointer";
        }

        const html = `<button class="settingsButtonUser ${extraClasses}" ${onClickLink}>${userFullname}</button>`;

        return html;
    }
}

function getDateFormat(aDay, aMonth, aYear) {

    const day = aDay;
    const month = aMonth;
    const year = aYear;

    let string = "Ugyldig dato";

    if (day && month && year) {
        if (day.length === 1 || day.length === 2 && month.length === 1 || month.length === 2 && year.length === 4) {

            string = new Date(`${year}-${month}-${day}`);
            if (isNaN(string)) {
                string = `${day}.${month}.${year}`;
            } else {
                string = new Date(`${year}-${month}-${day}`).toLocaleDateString();
            }
        }
    }
    return string;
}

function calcDaysSinceUpdate() {

    let string = "";

    const todayDate = new Date();
    const updateDate = new Date(parseInt(application.lastUpdated.year), (parseInt(application.lastUpdated.month) - 1), parseInt(application.lastUpdated.day));

    const daysSinceTime = parseInt((todayDate - updateDate) / (1000 * 3600 * 24));

    if (todayDate < updateDate) {
        //fremtiden
    } else if (daysSinceTime > 1) {
        string = `${parseInt(daysSinceTime)} dager siden`;
    } else if (daysSinceTime === 1) {
        string = `${parseInt(daysSinceTime)} dag siden`;
    } else if (daysSinceTime === 0) {
        string = `I dag`;
    } else {
        string = application.lastUpdated.date;
    }
    return string;
}