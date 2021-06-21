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

    const versionLogKeys = Object.keys(app.versionLog);
    const newestVersion = versionLogKeys[0];

    app.versionFullNumber = newestVersion;

    app.versionFull = `Versjon ${app.versionFullNumber}`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);