(function (exports) {

    const app = {
        name: "Treningstatistikken",
        logoURL: "images/appIcon.png",
        version: {
            state: "alpha 85%",
            major: 4, // major++ = minor = 0 && revision = 0
            minor: 3, // minor++ = revision = 0
            revision: 30,
        },
        lastUpdated: {
            day: "30",
            month: "04",
            year: "2021"
        },
        updatesInfo: {
            showOnGoing: true,
            showPlanned: true,
        }
    }

    app.version.fullNumber = `${app.version.major}.${app.version.minor}.${app.version.revision}`;
    app.version.full = `Versjon ${app.version.fullNumber} (${app.version.state})`;

    exports.ts_application = app;

})(typeof exports === 'undefined' ? this.ts_application = {} : exports);