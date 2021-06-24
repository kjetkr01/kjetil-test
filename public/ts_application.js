(function (exports) {

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/placeholder_logo.svg",
        changeLog: {
            "6.3.27.994": {
                "txt":
                    ["Feilrettinger",
                        "Ytelsesforbedringer"],
                "date": "24.06.2021"
            },
            "6.3.27.993": {
                "txt":
                    ["Lagt til treningsplaner (Utforsk siden)",
                        "Feilrettinger",
                        "Ytelsesforbedringer"],
                "date": "23.06.2021"
            },
            "6.3.27.992": {
                "txt":
                    [`Lagt til "Tillat API forespørsler" innstilling`,
                        `Lagt til info ikon på "Offentlig profil", "Ledertavler synlighet", "Trener i dag listen synlighet" og "Tillat API forespørsler" i Innstillinger.`,
                        "Maks grense for løft du kan lage endret fra 25 til 30",
                        "Maks grense for mål du kan lage endret fra 25 til 30",
                        "Maks grense for treningsplaner du kan lage endret fra 5 til 10",
                        "Maks grense for treningsplaner du kan abonnerte på endret fra 5 til 10",
                        "Feilrettinger",
                        "Ytelsesforbedringer"],
                "date": "23.06.2021"
            },
            "6.3.27.991": {
                "txt":
                    ["Lagt til bruksvilkår",
                        "Lagt til personvernerklæring",
                        "Feilrettinger",
                        "Ytelsesforbedringer"],
                "date": "22.06.2021"
            },
            "6.3.27.990": {
                "txt":
                    ["Lagt til versjonslogg",
                        "Feilrettinger",
                        "Ytelsesforbedringer"],
                "date": "21.06.2021"
            }
        }
    }

    // Uses first (newest version) as current version
    app.versionFullNumber = Object.keys(app.changeLog)[0];

    app.versionFull = `Versjon ${app.versionFullNumber}`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);