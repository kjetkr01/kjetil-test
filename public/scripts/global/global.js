"use strict";
// global variables

let user, allowedLifts = null, allowedGoals = null;

const defaultTxt = {
    "noConnection": "Ingen Internett-tilkobling"
}

const errorText = "Det har oppstått en feil!";
const loadingText = "Laster...";
const errorLoadingText = "Kunne ikke laste inn innholdet.";

const allowedColorThemes = {
    // first is default
    0: { "theme": "default", "name": "Standard", "lightHex": "327a94", "darkHex": "1c4553" },
    1: { "theme": "blue", "name": "Blå", "lightHex": "3247bb", "darkHex": "202b6b" },
    2: { "theme": "blue_full", "name": "Blå (Test) (Full)", "lightHex": "0161E8", "darkHex": "09314b" },
    3: { "theme": "blue_full_gradient", "name": "Blå (Test) (Full m/ gradient)", "lightHex": "b6d7ec", "darkHex": "1e2830" },
    4: { "theme": "test_full_simple", "name": "Test (Test) (Full enkel)", "lightHex": "b6d7ec", "darkHex": "1e2830" },
}

try {
    if (sessionStorage.getItem("allowedLifts")) {
        allowedLifts = JSON.parse(sessionStorage.getItem("allowedLifts"));
    }
    if (sessionStorage.getItem("allowedGoals")) {
        allowedGoals = JSON.parse(sessionStorage.getItem("allowedGoals"));
    }
} catch {
}