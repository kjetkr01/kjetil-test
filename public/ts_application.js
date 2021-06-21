(function (exports) {

    const updateDay = "17.06.2021";

    const upd = updateDay.split(".");

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/placeholder_logo.svg",
        version: {
            state: "b", // a = alpha / b = beta / rc = release candidate / r = release
            major: 6,
            minor: 3,
            revision: 27,
            buildnumber: 988,
        },
        lastUpdated: {
            day: upd[0],
            month: upd[1],
            year: upd[2]
        },
        updatesInfo: {
            showOnGoing: true,
            showPlanned: true,
        }
    }

    if (app.version.state !== "r") {
        app.version.fullNumber = `${app.version.major}.${app.version.minor}.${app.version.revision}-${app.version.state}.${app.version.buildnumber}`;
    } else {
        app.version.fullNumber = `${app.version.major}.${app.version.minor}.${app.version.revision}.${app.version.buildnumber}`;
    }

    app.versionLog = {
        "6.3.27.988": { "txt": ["Rettet feil"], "date": "21.06.2021" },
        "6.3.27.989": { "txt": ["Lagt til versjonslogg"], "date": "21.06.2021" },
    }

    app.version.full = `Versjon ${app.version.fullNumber}`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);