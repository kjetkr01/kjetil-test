// Oppdatere disse når ny commit

const application = {
    name: "Treningstatistikken",
    logoURL: "images/appIcon.png",
    version: {
        state: "alpha",
        major: 3, // major++ = minor = 0 && revision = 0
        minor: 3, // minor++ = revision = 0
        revision: 2,
    },
    lastUpdated: {
        day: "27",
        month: "03",
        year: "2021"
    },
    updatesInfo: {
        showOnGoing: true,
        showPlanned: true,
    }
}

// Lage rettigheter eller lignende i innstillinger helt i bunnen? Feks sånn der man kan hente alt av info om brukeren, hva det brukes til ogsånt? Erklæringsting, Personvern ting

// Slutt

application.version.fullNumber = `${application.version.major}.${application.version.minor}.${application.version.revision}`;
application.version.full = `Versjon ${application.version.fullNumber} (${application.version.state})`;
application.lastUpdated.date = getDateFormat(application.lastUpdated.day, application.lastUpdated.month, application.lastUpdated.year);

const aboutAppText = `
${application.name} er et app prosjekt utviklet av ${createBtn("Kjetil Kristiansen", "3")}.

<br><br>
Appen ble hovedsakling laget for å enkelt se ORM (One Rep Max) i ulike løft.
Kunne lage mål i ulike øvelser og enkelt sjekke progresjon og hvor langt man er unna målet.

<br><br>
Ha muligheten til å opprette treningsplaner, samt legge inn øvelser per dag.
Siden appen er koblet til et database system, vil muligheten for å se andre brukere sine løft, mål, progresjon og treningsplaner være veldig enkelt.

<br><br>
Hjelp til design:
${createBtn("Christoffer Simonsen", "2")},
${createBtn("Christian Jenssen")},
${createBtn("Mandius Abelsen")},
${createBtn("Szilard Andri Reynisson", "41")},
${createBtn("Sondre Olsen")}.
`;

//

const ongoingUpdatesText = "Pågående oppdateringer";
const ongoingUpdatesArr = [
    "TITLE:Innstillinger",
    "Endre: Visningsnavn (0%)",
    "Endre: Brukernavn (0%)",
    "Oppdatere: Passord (30%)",
    "Oppdatere detaljer: Om deg (90%)",
    "Oppdatere Fremgangs info: Lagre endringer (0%)",
    "Brukere (80%)",
    "Personvern (0%)",
];

//



//

const plannedUpdatesText = "Kommende oppdateringer";
const plannedUpdatesArr = [
    "TITLE:Logg inn",
    "Husk meg i 30 dager (istedenfor 7)",

    "TITLE:Farge-tema",
    "Lage flere farge-temaer",

    "TITLE:Løft/Mål",
    "Slå av sletting av løft og mål i Innstillinger. Passord for å slå det av igjen",
    "Legge til flere løft og mål. Foreløpi bare: Benkpress, Knebøy, Markløft, Skulderpress",
    "Kunne velge opp til 3 løft per øvelse. Velge antall reps",

    "TITLE:Treningsplan",
    "Opp til 4 treningsplaner",
    "Egendefinert navn per plan",
    "Velge aktiv treningsplan",
    "Elementer: nr, øvelse, resp, sets, % utfra ORM, rpe, notis (kun for brukeren)",
    "Kunne lagre/kopiere andre brukere sine planer",

    "TITLE:Badges",
    "Lage flere badge farger",
    "Lage større versjon av badge (mål-badge)",

    "TITLE:Offline support",
    "Se treningsplan, løft, mål offline",

    "TITLE:Desktop design",
    "Lage desktop design",
];

//


const aboutAppBottomInfo = `
Prosjekt oppstart: ${getDateFormat("20", "11", "2020")}
<br><br>
Full redesign: ${getDateFormat("19", "01", "2021")}
<br><br>
Sist oppdatert: ${calcDaysSinceUpdate()}
`;

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
        let hightlightClass = "";

        if (userid) {
            onClickLink = `onClick="viewUser('${userid}');"`;
            hightlightClass = "settingsHightlightUser";
        }

        const html = `<button class="settingsButtonUser ${hightlightClass}" ${onClickLink}>${userFullname}</button>`;

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