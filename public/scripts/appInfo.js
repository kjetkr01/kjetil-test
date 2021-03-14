const applicationName = `Treningstatistikken`;

const vMajorVersion = 2; // hvis ny major. minor og revision = 0
const vMinorVersion = 3; // hvis ny minor. revision = 0
const vRevision = 19;
const applicationUpdateDate = "14.03.2021";

const applicationVersionNumber = `${vMajorVersion}.${vMinorVersion}.${vRevision}`;
const applicationVersionState = `alpha`;
const applicationFullVersion = `Versjon ${applicationVersionNumber} (${applicationVersionState})`;

//

const showOngoingUpdates = true;
const ongoingUpdatesText = "Pågående oppdateringer";
const ongoingUpdatesArr = [
    "TITLE:Innstillinger",
    "Endre: Visningsnavn (0%)",
    "Endre: Brukernavn (0%)",
    "Oppdatere: Passord (0%)",
    "Oppdatere detaljer: Om deg (0%)",
    "Endre: Privat profil (100%)",
    "Endre: Ledertavler synlighet (100%)",
    "Endre: Trener i dag listen synlighet (100%)",
    "Oppdatere Utseende: Tema (0%)",
    "Oppdatere Utseende: Farge-tema (100%)",
    "Oppdatere Fremgangs info: Lagre endringer (0%)",
];

//



//

const showPlannedUpdates = true;
const plannedUpdatesText = "Kommende oppdateringer";
const plannedUpdatesArr = [
    "TITLE:Treningsplan",
    "Opp til 4 treningsplaner",
    "Egendefinert navn per plan",
    "Velge aktiv treningsplan",
    "Elementer: nr, øvelse, resp, sets, % utfra ORM, rpe, notis (kun for brukeren)",
    "Kunne lagre/kopiere andre brukere sine planer",
];

//



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