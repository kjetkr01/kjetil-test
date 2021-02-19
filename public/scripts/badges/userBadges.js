function getBadgeGoals(aSize, aBadgeInfo) {
    try {

        if (aSize === 0 || aSize === 1 && aBadgeInfo && aBadgeInfo.exercise && aBadgeInfo.kg && aBadgeInfo.kgLeft && aBadgeInfo.msg) {

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

        }

    } catch {

    }

    // bigBadge with goal

    function bigBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="bigBadges fadeInLeft animate ${aBadgeInfo.color}" onClick="alert('${userBadgeInfo.exercise}');">



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

    // end of bigBadge with goal

    // smallBadge with goal

    function smallBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="smallBadges fadeInLeft animate ${aBadgeInfo.color}" onClick="alert('${userBadgeInfo.exercise}');">

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

}






function getBadgeLift(aSize, aBadgeInfo) {

    try {
        if (aSize === 0 || aSize === 1 && aBadgeInfo && aBadgeInfo.exercise && aBadgeInfo.kg && aBadgeInfo.msg) {

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

        }

    } catch {

    }

    // bigBadge with lift

    function bigBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="bigBadges fadeInLeft animate ${aBadgeInfo.color}" onClick="alert('${userBadgeInfo.exercise}');">



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

    function smallBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="smallBadges fadeInLeft animate ${aBadgeInfo.color}" onClick="alert('${userBadgeInfo.exercise}');">

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

}

function getBadgeTrainingsplit(aSize, aBadgeInfo) {

    try {
        if (aSize === 0 || aSize === 1 && aBadgeInfo && aBadgeInfo.day && aBadgeInfo.trainingsplit) {

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



        }

    } catch {

    }

    // bigBadge with trainingsplit

    function bigBadge(userBadgeInfo) {

        const badgeTemplate = `
<td>
<div class="bigBadges fadeInLeft animate ${aBadgeInfo.color}">



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
<div class="smallBadgesTrainingsplit fadeInLeft animate ${aBadgeInfo.color}">

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

}