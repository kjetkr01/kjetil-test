const gradientTxt = "(gradient)";

module.exports.ECustomList = {

    // Example: allowed.lifts = allowed lifts user can edit/create
    allowed: {
        lifts: ["benkpress", "markløft", "knebøy", "skulderpress"],
        goals: ["benkpress", "markløft", "knebøy", "skulderpress", "opp i vekt", "ned i vekt"],
        settings: {
            "publicprofile": [true, false],
            "displayleaderboards": [true, false],
            "displayworkoutlist": [true, false],
            "displaystatistics": [true, false],
            "externalapirequests": [true, false],
            "preferredtheme": ["0", "1", "2"],
            "preferredcolortheme": ["0", "1", "2", "3", "4"],
            "badgesize": ["0", "1"],
            "badgedetails": ["0", "1", "2"],
            "automaticupdates": [true, false],
            "leaderboards_filter_reps": ["bypass"],
            "lifts_filter_exercise": ["bypass", "check-lifts"],
            "goals_filter_exercise": ["bypass", "check-goals"]
        }
    },

    // Example: max.lifts = maximum lifts a user can have
    max: {
        lifts: 30,
        goals: 30,
        trainingsplits: 10,
        subscribedTrainingsplits: 10,
        trainingsplitsExercisesPerDay: 12,
        trainingsplitsExerciseRows: 8
    },

    other: {
        badgeColors: {
            // name = name that will be displayed to user. Border = border color around badge when viewed/edited
            "redBadgeG": { "name": `Rød ${gradientTxt}`, "border": "972F2F" },
            "yellowBadgeG": { "name": `Gul ${gradientTxt}`, "border": "C96E4C" },
            "blueBadgeG": { "name": `Blå ${gradientTxt}`, "border": "2B2379" },
            "themeBadgeG": { "name": `Følg tema ${gradientTxt}`, "border": null },

            "redBadge": { "name": `Rød`, "border": "E36262" },
            "yellowBadge": { "name": `Gul`, "border": "DBB331" },
            "blueBadge": { "name": `Blå`, "border": "626BE3" },
            "themeBadge": { "name": `Følg tema`, "border": null },
        }
    }
}