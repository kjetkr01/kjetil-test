(function (exports) {

    // Oppdatere disse når ny commit

    const updateDay = "03.06.2021";

    // Slutt

    const upd = updateDay.split(".");

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/appIcon.png",
        version: {
            state: "alpha", // alpha / beta / release candidate
            major: 6,
            minor: 2,
            revision: 18,
            buildnumber: 941,
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

    let custom = "";
    if (app.version.state !== "release") {
        switch (app.version.state) {
            case "alpha":
                custom = "-a";
                break;
            case "beta":
                custom = "-b";
                break;
            case "release candidate":
                custom = "-rc";
                break;
        }
        app.version.fullNumber = `${app.version.major}.${app.version.minor}.${app.version.revision}.${custom}${app.version.buildnumber}`;
    } else {
        app.version.fullNumber = `${app.version.major}.${app.version.minor}.${app.version.revision}.${app.version.buildnumber}`;
    }

    app.version.full = `Versjon ${app.version.fullNumber}`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);