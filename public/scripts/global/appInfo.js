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

const ETOU = {
    [application.name]:
        `${application.name} er et verktøy som hjelper deg å holde en oversikt over dine løft, mål, progresjon samt treningsplaner.
        Vi tar til enhver tid sikte på å utvikle og forbedre ${application.name} til det beste for deg som bruker.`,

    "Brukerkonto":
        `<h4>2.1 Opprett bruker</h4>
        For å få tilgang til tjenesten må du ha en brukerkonto, som vi oppretter for deg den første gangen forespørselen din blir godtatt.
        Brukerkontoen inneholder en unik bruker-ID som vi må registrere for at du skal kunne ta i bruk tjenesten.
        <br><br>
        <h4>2.2 Slik avslutter du brukerkontoen din</h4>
        Du kan når som helst avslutte brukerkontoen din ved å gå inn på "Innstillinger>Personvern>Gå til sletting av konto".
        <br><br>
        Når du har sagt opp brukerkontoen din, vil din brukerkonto bli slettet.
        Hvis du sletter brukerkontoen, vil det ikke være mulig å gjenopprette innholdet.`,

    "Endringer":
        `Vi forbeholder oss retten til å gjøre endringer i tjenesten, bl.a for å møte nye behov.
        Dette kan være endringer i brukervilkårene eller personvernerklæringene, eller innholdet i tjenesten.
        <br><br>
        Du vil bli varslet om endringer før de trer i kraft.`,

    "Ansvar":
        `${application.name} er ansvarlig for at alle opplysninger og data er riktige, forutsatt at du har gitt riktige opplysninger.
        Vi tar likevel forbehold om trykkfeil, teknisk svikt, driftsstans og lignende uforutsette hendelser.`,

    "Misbruk":
        `${application.name} forbeholder seg retten til å endre eller slette din brukerkonto, endre innholdet og/eller nekte deg tilgang til tjenesten dersom:
        <br>
        &#8226; det foreligger andre saklige grunner (f.eks. brudd på brukervilkårene)
        <br><br>
        Før vi eventuelt gjør endringer i eller sletter brukerkontoen din, vil du bli kontaktet.
        Hvis brukerkontoen din slettes på grunn av misbruk, kan du bli nektet å opprette en ny brukerkonto.`,
}

const EPrivacy = {
    "Personopplysningene dine og personvernet ditt":
        `Denne personvernerklæringen inneholder generell informasjon om hvordan vi behandler dine personopplysninger ved bruk av tjenesten og hvilke rettigheter du har.
        <br><br>
        Personoplysninger er opplysninger som direkte eller indirekte kan knyttes til deg. Regelverket skal beskytte deg mot at personopplysningene dine blir misbrukt.
        <br><br>
        I ${application.name} er brukeren vår 'sjef'. Vi tar personvernet ditt på alvor og behandler personopplysningene dine i samsvar med personvernlovgivningen.`,
    "Hvilke opplysninger lagrer vi om deg?":
        `<h4>2.1 Vi lagrer registreringsopplysninger</h4>
        Når det opprettes en brukerkonto, registrerer vi opplysningene du oppgir.
        <br><br>
        <h4>2.2 Andre opplysninger</h4>
        Vi vil kun benytte andre opplysninger om deg enn beskrevet ovenfor i den utstrekning det er nødvendig for å levere tjenesten og det har grunnlag i personvernlovgivningen.
        `,
    "Hvilke rettigheter har du?":
        `Du har rett til å be om innsyn i, retting og/eller sletting av personopplysninger vi har registrert om deg.
        <br><br>
        Innsyn i hvilke personopplysninger vi har om deg finner du under "Innstillinger>Personvern>Hent mine opplysninger".
        <br><br>
        Du kan også rette feil i personopplysningene dine eller slette brukerkontoen din direkte i Innstillinger.`,
    "Når sletter vi dine personopplysninger?":
        `Vi sletter personopplysninger i tråd med personvernreglene for sletting.
        Det betyr at vi sletter dine personopplysninger når det ikke lenger er nødvendig å lagre opplysninger for å oppfylle formålet de ble innhentet for.
        Du kan når som helst selv slette dine personopplysninger, med unntak av opplysninger som er nødvendige for at vi skal kunne gi deg den tjenesten du ønsker å motta.
        Hvis du ønsker å si opp tjenesten, vil alle opplysninger om deg slettes.`,
    "Hva har vi gjort for å ivareta sikkerheten din?":
        `Vi er opptatt av at uberettigede ikke får tilgang til personopplysningene dine.
        Vi benytter derfor flere former for sikkerhetsteknologi som sørger for en god beskyttelse mot uautorisert tilgang og misbruk av personopplysninger.`,
}

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