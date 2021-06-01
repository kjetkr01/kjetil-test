//allowedLifts
module.exports.allowedLifts = ["benkpress", "knebøy", "markløft", "skulderpress"];

//allowedGoals
module.exports.allowedGoals = ["benkpress", "knebøy", "markløft", "skulderpress"]; //,"opp i vekt", "ned i vekt"

//badgeColors
const gradientTxt = "(gradient)";
module.exports.badgeColors = {
    // name = name that will be displayed to user. Border = border color around badge when viewed/edited
    "redBadgeG": { "name": `Rød ${gradientTxt}`, "border": "972F2F" },
    "yellowBadgeG": { "name": `Gul ${gradientTxt}`, "border": "C96E4C" },
    "blueBadgeG": { "name": `Blå ${gradientTxt}`, "border": "2B2379" },
    "themeBadgeG": { "name": `Følg tema ${gradientTxt}`, "border": null },

    "redBadge": { "name": `Rød`, "border": "E36262" },
    "yellowBadge": { "name": `Gul`, "border": "DBB331" },
    "blueBadge": { "name": `Blå`, "border": "626BE3" },
    "themeBadge": { "name": `Følg tema`, "border": null },
};
//styles/badges/badgeColors.css for reference


//maximum allowed lifts
module.exports.maxLifts = {
    default: 25
};

//maximum allowed goals
module.exports.maxGoals = {
    default: 25
};

//maximum allowed trainingsplits
module.exports.maxTrainingsplits = {
    default: 5
};

//maximum allowed trainingsplits exercises in one day
module.exports.maxTrainingsplitsExercisesPerDay = {
    default: 12
};

//maximum allowed trainingsplits rows in one exercise
module.exports.maxTrainingsplitsExerciseRows = {
    default: 8
};

//maximum allowed subscribed trainingsplits
module.exports.maxSubscribedTrainingsplits = {
    default: 5
};