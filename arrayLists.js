//allowedLifts
module.exports.allowedLifts = ["benkpress", "knebøy", "markløft", "skulderpress"];

//allowedGoals
module.exports.allowedGoals = ["benkpress", "knebøy", "markløft", "skulderpress"];

//badgeColors
const gradientTxt = "(gradient)";
module.exports.badgeColors = {
    "redBadgeG": `Rød ${gradientTxt}`,
    "yellowBadgeG": `Gul ${gradientTxt}`,
    "blueBadgeG": `Blå ${gradientTxt}`,

    "redBadge": `Rød`,
    "yellowBadge": `Gul`,
    "blueBadge": `Blå`,
};
//styles/badges/badgeColors.css for reference


//allowedTrainingDays
module.exports.allowedTrainingDays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];


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