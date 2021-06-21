(function (exports) {

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/placeholder_logo.svg",
        versionLog: {
            "6.3.27.989": {
                "txt":
                    ["Lagt til versjonslogg", "Feilrettinger", "Ytelsesforbedringer"],
                "date": "21.06.2021"
            }
        }
    }

    // Uses first (newest version) as current version
    app.versionFullNumber = Object.keys(app.versionLog)[0];

    app.versionFull = `Versjon ${app.versionFullNumber}`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);