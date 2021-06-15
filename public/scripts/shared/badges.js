let showLiftBadgeAnimations = true;
let showGoalBadgeAnimations = true;
let showTrainingsplitBadgeAnimations = true;

const animationClasses = "fadeInLeft animate"
let liftBadgeAnimations = "";
let goalBadgeAnimations = "";
let trainingsplitBadgeAnimations = "";

function getBadgeGoals(aSize, aBadgeInfo, aId) {
    try {

        if (showGoalBadgeAnimations === false) {
            goalBadgeAnimations = "";
        } else {
            goalBadgeAnimations = animationClasses;
        }

        if (!aSize) {
            aSize = 0;
        }

        if (aSize === 0 || aSize === 1 && aBadgeInfo && aBadgeInfo.exercise && aBadgeInfo.kg && aBadgeInfo.msg && aId) {

            const size = aSize;
            const badgeInfo = aBadgeInfo;
            const id = aId;

            switch (size) {
                case 0:
                    return smallBadge(badgeInfo, id);
                case 1:
                    return bigBadge(badgeInfo, id);
                default:
                    return smallBadge(badgeInfo, id);
            }

        } else {

            return emptyBadge();

        }

    } catch {
        return emptyBadge();
    }

    // bigBadge with goal

    function bigBadge(userBadgeInfo, aId) {

        //console.log(userBadgeInfo);

        let currentProgressionPercent = `${userBadgeInfo.progressionPercent}%`;

        if (user.getSetting("badgedetails") === 1) {
            currentProgressionPercent = "";
        } else if (user.getSetting("badgedetails") === 2) {
            userBadgeInfo.msg = "";
        }

        let progressionTxt = "";

        const progress = userBadgeInfo.progressionPercent;

        const progressTxtList = {
            100: "Målet er nådd!",
            99: "1% igjen!",
            96: "Så nærme!",
            90: "Snart i mål!",
            80: "Veldig bra!",
            76: "Nærmer deg mål!",
            75: "3/4",
            65: "Snart 3/4!",
            51: "God progresjon!",
            50: "Halvveis!",
            40: "Snart halvveis!",
            30: "Bra fremgang!",
            25: "1/4",
            15: "Snart 1/4",
            12: "Kommer seg",
            7: "God start",
            1: "99% igjen!",
            0: "En begynnelse",
        }

        const exact = [1, 25, 75, 99]; // for special numbers :)

        const progressionTxtKeys = Object.keys(progressTxtList);

        if (progress >= 100) {
            userBadgeInfo.msg = "";
        }

        for (let i = 0; i < progressionTxtKeys.length; i++) {
            const current = parseFloat(progressionTxtKeys[i]);
            const currentTxt = progressTxtList[current];
            let checkExact = false;

            for (let j = 0; j < exact.length; j++) {
                const currExact = exact[j];
                if (currExact === current) {
                    checkExact = true;
                    break;
                }
            }

            if (checkExact === true) {
                if (progress === current) {
                    progressionTxt = currentTxt;
                }
            } else {
                if (progress >= current) {
                    progressionTxt = currentTxt;
                }
            }

        }

        const badgeTemplate = `
<td>
<div class="bigBadges ${goalBadgeAnimations} ${userBadgeInfo.color} pointer" onClick="enableOverlayView('goal', '${userBadgeInfo.exercise}', '${aId}');">



<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->


<div id="Gprogression" class="${userBadgeInfo.exercise}-${aId}-class">

<svg id="${userBadgeInfo.exercise}-${aId}" style="width: 50px; height: 50px; margin-left: 10px;">
        <circle r="20" cx="25" cy="25" id="${userBadgeInfo.exercise}-${aId}-track" class="track"></circle>
        <circle r="20" cx="25" cy="25" id="${userBadgeInfo.exercise}-${aId}-progress" class="progress"></circle>
        <text x="50%" y="50%" text-anchor="middle" fill="#FFFFFF" font-size="13px" font-weight="bold" dy=".3em">${currentProgressionPercent}</text>
        </svg>
</div>

<div id="GkgLeft">
<p id="kgLeft">
${userBadgeInfo.msg}
</p>
</div>

<div id="Gexercise">
<p id="exercise">
${userBadgeInfo.exercise}
</p>
</div>

<div id="Gkg">
<p id="kg">
${userBadgeInfo.kg} kg
</p>
</div>

<div id="Gmsg">
<p id="msg">
${progressionTxt}
</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of bigBadge with goal

    // smallBadge with goal

    function smallBadge(userBadgeInfo, aId) {

        const badgeTemplate = `
<td>
<div class="smallBadges ${goalBadgeAnimations} ${userBadgeInfo.color} pointer" onClick="enableOverlayView('goal', '${userBadgeInfo.exercise}', '${aId}');">

<div id="Gexercise">
<p id="exercise">
${userBadgeInfo.exercise}
</p>
</div>

<div id="Gkg">
<p id="kg">
${userBadgeInfo.kg} kg
</p>
</div>

<div id="Gmsg">
<p id="msg">
${userBadgeInfo.msg}
</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of smallBadge with goal


    // emptyBadge without goal (default)

    function emptyBadge() {

        const badgeTemplate = `
<td>
<div class="smallBadges ${goalBadgeAnimations} emptyBadge pointer" onClick="enableOverlayCreate('goal')">



<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->

<div id="Gexercise">
<p id="exercise">
Opprett
</p>
</div>

<div id="Gkg">
<p id="kg">
nytt mål
</p>
</div>

<div id="Gmsg">
<p id="msg">

</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of emptyBadge without goal (default)

}






function getBadgeLift(aBadgeInfo, aId) {

    try {

        if (showLiftBadgeAnimations === false) {
            liftBadgeAnimations = "";
        } else {
            liftBadgeAnimations = animationClasses;
        }

        if (aBadgeInfo && aBadgeInfo.exercise && aBadgeInfo.kg && aBadgeInfo.msg && aId) {

            return smallBadge(aBadgeInfo, aId);

        } else {

            return emptyBadge();

        }

    } catch {
        return emptyBadge();
    }

    // smallBadge with lift

    function smallBadge(userBadgeInfo, aId) {

        const badgeTemplate = `
<td>
<div class="smallBadges ${liftBadgeAnimations} ${userBadgeInfo.color} pointer" onClick="enableOverlayView('lift', '${userBadgeInfo.exercise}', '${aId}');">

<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->

<div id="Gexercise">
<p id="exercise">
${userBadgeInfo.exercise}
</p>
</div>

<div id="Gkg">
<p id="kg">
${userBadgeInfo.kg} kg
</p>
</div>

<div id="Gmsg">
<p id="msg">
${userBadgeInfo.msg}
</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of smallBadge with lift


    // emptyBadge without lift (default)

    function emptyBadge() {

        const badgeTemplate = `
<td>
<div class="smallBadges ${liftBadgeAnimations} emptyBadge pointer" onClick="enableOverlayCreate('lift')">



<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->

<div id="Gexercise">
<p id="exercise">
Opprett
</p>
</div>

<div id="Gkg">
<p id="kg">
nytt løft
</p>
</div>

<div id="Gmsg">
<p id="msg">

</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of emptyBadge without lift (default)

}

function getBadgeTrainingsplit(aBadgeInfo) {

    try {

        if (showTrainingsplitBadgeAnimations === false) {
            trainingsplitBadgeAnimations = "";
        } else {
            trainingsplitBadgeAnimations = animationClasses;
        }

        if (aBadgeInfo && aBadgeInfo.day && aBadgeInfo.trainingsplit && aBadgeInfo.trainingsplit) {

            return smallBadge(aBadgeInfo);

        } else {

            return emptyBadge();

        }

    } catch {
        return emptyBadge();
    }

    // smallBadge with trainingsplit

    function smallBadge(userBadgeInfo) {

        let day = "monday";

        const days = {
            "Søndag": "sunday",
            "Mandag": "monday",
            "Tirsdag": "tuesday",
            "Onsdag": "wednesday",
            "Torsdag": "thursday",
            "Fredag": "friday",
            "Lørdag": "saturday",
        }

        day = days[userBadgeInfo.day];

        const badgeTemplate = `
<td>
<div class="smallBadgesTrainingsplit ${trainingsplitBadgeAnimations} ${userBadgeInfo.color} pointer" onClick="redirectToTrainingsplit('${userBadgeInfo.trainingsplit_id}','${day}');">

<div id="Gday">
<p id="day">
${userBadgeInfo.day}
</p>
</div>

<div id="GtrainingsplitTxt">
<p id="trainingsplitTxt">
${userBadgeInfo.trainingsplit}
</p>
</div>

</div>
</td>
</tr>
`;

        return badgeTemplate;

    }

    // end of smallBadge with trainingsplit


    // emptyBadge without trainingsplit (default)

    function emptyBadge() {

        const badgeTemplate = `
        <td>
        <div class="smallBadgesTrainingsplit ${trainingsplitBadgeAnimations} emptyBadge pointer" onClick="enableOverlayEditDays();">
        
        <div id="Gday">
        <p id="day">
        Velg
        </p>
        </div>
        
        <div id="GtrainingsplitTxt">
        <p id="trainingsplitTxt" style="font-weight: bold; font-size: 18px">
        treningsplan
        </p>
        </div>
        
        </div>
        </td>
        </tr>
`;

        return badgeTemplate;

    }

    // end of emptyBadge without trainingsplit (default)

}