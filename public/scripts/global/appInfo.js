"use strict";
const application = ts_application.ts_application;

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
${createBtn("Sondre Olsen", "10")}.
`;

// creates clickable button if id is being sent in
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
// End of createBtn function