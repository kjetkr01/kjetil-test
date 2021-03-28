//allowedLifts
module.exports.allowedLifts = ["Benkpress", "Knebøy", "Markløft", "Skulderpress"];

//allowedGoals
module.exports.allowedGoals = ["Benkpress", "Knebøy", "Markløft", "Skulderpress"];

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