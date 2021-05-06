(function (exports) {

    // Oppdatere disse når ny commit

    const updates = 828;
    const updateDay = "06.05.2021";

    // Slutt

    const expectedUpdates = 975;
    const upd = updateDay.split(".");

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/appIcon.png",
        version: {
            state: "",
            major: 0, // major++ = minor = 0 && revision = 0 // 4
            minor: 0, // minor++ = revision = 0 // 4
            revision: 0,
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

    if (updates / expectedUpdates >= 1) {
        app.version.state = `alpha 100%`;
    } else {
        app.version.state = `alpha ${parseFloat((updates / expectedUpdates) * 100).toFixed(1)}%`;
    }

    const majorCount = 150;
    const minorCount = 25;

    let rest = updates;

    if (rest / majorCount >= 1) {
        app.version.major = parseInt(rest / majorCount);
        rest = rest - (app.version.major * majorCount);
    }

    if (rest > 0) {
        if (rest / minorCount >= 1) {
            app.version.minor = parseInt(rest / minorCount);
            rest = rest - (app.version.minor * minorCount);
        }
        if (rest > 0) {
            app.version.revision = rest;
        }
    }

    app.version.fullNumber = `${app.version.major}.${app.version.minor}.${app.version.revision}`;
    app.version.full = `Versjon ${app.version.fullNumber} (${app.version.state})`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);