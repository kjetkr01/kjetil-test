(function (exports) {

    // Oppdatere disse når ny commit

    const updateDay = "15.06.2021";

    // Slutt

    const upd = updateDay.split(".");

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/appIcon.png",
        version: {
            state: "a", // a = alpha / b = beta / rc = release candidate / r = release
            major: 6,
            minor: 3,
            revision: 24,
            buildnumber: 974,
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

    app.version.full = `Versjon ${app.version.fullNumber}`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);