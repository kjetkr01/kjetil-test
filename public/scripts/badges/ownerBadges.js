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

        if (aSize === 0 || aSize === 1 && aBadgeInfo && aBadgeInfo.exercise && aBadgeInfo.kg && aBadgeInfo.untilGoal && aBadgeInfo.msg && aId) {

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

        const badgeTemplate = `
<td>
<div class="bigBadges ${goalBadgeAnimations} ${aBadgeInfo.color} pointer" onClick="enableOverlayEdit('goal', '${userBadgeInfo.exercise}', '${aId}');">



<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->


<div id="Gprogression">


<div class="circular">
<div class="inner" style="background-color: #E36262;">
</div>
<div class="outer">
</div>
<div id="percentNum" class="numb">
0%</div>
<div class="circle">
<div class="dot">
<span></span>
</div>
<div class="bar left">
<div class="progress">
</div>
</div>
<div class="bar right">
<div class="progress">
</div>
</div>
</div>
</div>


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
Nærmer deg!
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
<div class="smallBadges ${goalBadgeAnimations} ${aBadgeInfo.color} pointer" onClick="enableOverlayEdit('goal', '${userBadgeInfo.exercise}', '${aId}');">

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






function getBadgeLift(aSize, aBadgeInfo, aId) {

    try {

        if (showLiftBadgeAnimations === false) {
            liftBadgeAnimations = "";
        } else {
            liftBadgeAnimations = animationClasses;
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

    // bigBadge with lift

    function bigBadge(userBadgeInfo, aId) {

        const badgeTemplate = `
<td>
<div class="bigBadges ${liftBadgeAnimations} ${aBadgeInfo.color} pointer" onClick="enableOverlayEdit('lift', '${userBadgeInfo.exercise}', '${aId}');">



<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->


<div id="Gprogression">


<div class="circular">
<div class="inner" style="background-color: #E36262;">
</div>
<div class="outer">
</div>
<div id="percentNum" class="numb">
0%</div>
<div class="circle">
<div class="dot">
<span></span>
</div>
<div class="bar left">
<div class="progress">
</div>
</div>
<div class="bar right">
<div class="progress">
</div>
</div>
</div>
</div>


</div>

<div id="GkgLeft">
<p id="kgLeft">
15.5 kg igjen
</p>
</div>

<div id="Gexercise">
<p id="exercise">
Benkpress
</p>
</div>

<div id="Gkg">
<p id="kg">
130 kg
</p>
</div>

<div id="Gmsg">
<p id="msg">
Nærmer deg!
</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of bigBadge with lift

    // smallBadge with lift

    function smallBadge(userBadgeInfo, aId) {

        const badgeTemplate = `
<td>
<div class="smallBadges ${liftBadgeAnimations} ${aBadgeInfo.color} pointer" onClick="enableOverlayEdit('lift', '${userBadgeInfo.exercise}', '${aId}');">

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

function getBadgeTrainingsplit(aSize, aBadgeInfo) {

    try {

        if (showTrainingsplitBadgeAnimations === false) {
            trainingsplitBadgeAnimations = "";
        } else {
            trainingsplitBadgeAnimations = animationClasses;
        }

        if (aSize === 0 || aSize === 1 && aBadgeInfo && aBadgeInfo.day && aBadgeInfo.trainingsplit && aBadgeInfo.trainingsplit) {

            const size = aSize;
            const badgeInfo = aBadgeInfo;

            switch (size) {
                case 0:
                    return smallBadge(badgeInfo);
                case 1:
                    return bigBadge(badgeInfo);
                default:
                    return smallBadge(badgeInfo);
            }

        } else {

            return emptyBadge();

        }

    } catch {
        return emptyBadge();
    }

    // bigBadge with trainingsplit

    function bigBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="bigBadges ${trainingsplitBadgeAnimations} ${aBadgeInfo.color} pointer">



<!--
<div id="c1b"></div>
<div id="c2b"></div>
<div id="c3b"></div>
<div id="c4b"></div>
<div id="c5b"></div>
<div id="c6b"></div>
-->


<div id="Gprogression">


<div class="circular">
<div class="inner" style="background-color: #E36262;">
</div>
<div class="outer">
</div>
<div id="percentNum" class="numb">
0%</div>
<div class="circle">
<div class="dot">
<span></span>
</div>
<div class="bar left">
<div class="progress">
</div>
</div>
<div class="bar right">
<div class="progress">
</div>
</div>
</div>
</div>


</div>

<div id="GkgLeft">
<p id="kgLeft">
15.5 kg igjen
</p>
</div>

<div id="Gexercise">
<p id="exercise">
Benkpress
</p>
</div>

<div id="Gkg">
<p id="kg">
130 kg
</p>
</div>

<div id="Gmsg">
<p id="msg">
Nærmer deg!
</p>
</div>

</div>
</td>
`;

        return badgeTemplate;

    }

    // end of bigBadge with trainingsplit

    // smallBadge with trainingsplit

    function smallBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="smallBadgesTrainingsplit ${trainingsplitBadgeAnimations} ${aBadgeInfo.color} pointer" onClick="viewTrainingsplit('${aBadgeInfo.trainingsplit_id}','${aBadgeInfo.day}')">

<div id="Gday">
<p id="day">
${aBadgeInfo.day}
</p>
</div>

<div id="GtrainingsplitTxt">
<p id="trainingsplitTxt">
${aBadgeInfo.trainingsplit}
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