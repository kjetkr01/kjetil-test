let previousLeaderboard = "";
let firstLeaderboard = null;
let repsList = [];
let retryLoadOnce = true;

async function loadLeaderboards() {

    const reps = sessionStorage.getItem("leaderboards_filter_reps") || "1";

    const body = { "authToken": token, "userInfo": user, "reps": reps };
    const url = `/users/list/all/leaderboards`;

    const resp = await callServerAPI(body, url);

    const leaderboards = resp.leaderboards;

    repsList = resp.repsList;

    if (Object.entries(leaderboards).length > 0) {

        const leaderboardsArrOrder = [];

        for (let i = 0; i < Object.entries(leaderboards).length; i++) {

            const keys = Object.keys(leaderboards);

            leaderboardsArrOrder.push({ "leaderboard": [keys[i]], "usersCount": leaderboards[keys[i]] });

        }

        leaderboardsArrOrder.sort(function (a, b) { return b.usersCount - a.usersCount });

        const leaderboardsTableRowDom = document.getElementById("leaderboardsTableRow");
        leaderboardsTableRowDom.innerHTML = "";

        firstLeaderboard = leaderboardsArrOrder[0].leaderboard[0];

        for (let i = 0; i < leaderboardsArrOrder.length; i++) {

            const currentLeaderboard = leaderboardsArrOrder[i].leaderboard[0];
            const usersCount = leaderboardsArrOrder[i].usersCount;

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            leaderboardsTableRowDom.innerHTML += `
          <td>
             <button id="${currentLeaderboard}" class="leaderboardsList fadeInLeft animate pointer" onclick="getListOfLeaderboard('${currentLeaderboard}');">${capitalizeFirstLetter(currentLeaderboard)} (${usersCount})</button>
          </td>`;
        }

        getListOfLeaderboard();
    } else {
        sessionStorage.removeItem("leaderboards_filter_reps");
        if (retryLoadOnce === true) {
            loadLeaderboards();
            retryLoadOnce = false;
        } else {
            usermsg1.innerHTML = peopleLeaderboardsTxtHTML(`Fant ingen ledertavler!`);
        }
    }

}

let leaderboardIsLoading = false;

async function getListOfLeaderboard(aLeaderboard) {

    if (!aLeaderboard) {
        aLeaderboard = firstLeaderboard;
    }

    if (leaderboardIsLoading === true || previousLeaderboard === aLeaderboard) {
        return;
    }

    if (token && user && aLeaderboard) {

        const reps = sessionStorage.getItem("leaderboards_filter_reps") || "1";
        const ViewingLeaderboard = aLeaderboard;
        leaderboardIsLoading = true;

        if (document.getElementById(ViewingLeaderboard)) {

            if (document.getElementById(previousLeaderboard)) {
                document.getElementById(previousLeaderboard).classList.remove("active");
            }

            document.getElementById(ViewingLeaderboard).classList.add("active");
        };

        usermsg1.innerHTML = "";

        list.innerHTML = "";

        const body = { "authToken": token, "userInfo": user, "leaderboard": ViewingLeaderboard, "reps": reps };
        const url = `/users/list/all/leaderboards/${ViewingLeaderboard}`;

        const resp = await callServerAPI(body, url);

        list.innerHTML = "";
        previousLeaderboard = ViewingLeaderboard;

        if (Object.keys(resp).length > 0) {

            // sorts leaderboard in correct order, from highest to lowest
            resp.sort(function (a, b) { return b[ViewingLeaderboard] - a[ViewingLeaderboard] });
            //

            for (let i = 0; i < Object.keys(resp).length; i++) {

                let svgMedalColor = null;
                let svgMedal = null;

                let placementHTML = `${i + 1}.`;
                let usernameHTML = `<button class="peopleLeaderboardsListName pointer" onClick="viewUser('${resp[i].id}')">${resp[i].username}</button>`;

                if (resp[i].id === userID) {
                    usernameHTML = `<button class="accountOwner pointer" onClick="viewUser('${resp[i].id}')">${resp[i].username}</button>`;
                }

                switch (i) {
                    case 0:
                        svgMedalColor = "medalIconGold";
                        break;
                    case 1:
                        svgMedalColor = "medalIconSilver";
                        break;
                    case 2:
                        svgMedalColor = "medalIconBronze";
                        break;
                }

                if (svgMedal === null && svgMedalColor !== null) {
                    placementHTML = `
                    <svg id="placement" class="medals ${svgMedalColor}" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                        <defs>
                            </defs>
                            <g id="Layer_2" data-name="Layer 2">
                            <g id="Layer_1-2" data-name="Layer 1">
                            <path class="${svgMedalColor}"
                            d="M28.33,17.38v-14H11.67V17.38a1.66,1.66,0,0,0,.81,1.44l7,4.18L17.8,26.9l-5.68.48,4.31,3.74-1.31,5.55,4.88-3,4.88,3-1.3-5.55,4.32-3.74-5.68-.48L20.57,23l7-4.18A1.66,1.66,0,0,0,28.33,17.38Zm-6.66,3-1.67,1-1.67-1V5h3.34Z" />
                        </g>
                    </g>
                </svg>
                `;
                }

                list.innerHTML += `
             <div class="leaderboard fadeInUp animate">
             <div id="Gplacement">
                <div id="placement">
                   ${placementHTML}
                </div>
             </div>
             <div id="Gusername">
                <div id="username">
                   ${usernameHTML}
                </div>
             </div>
             <div id="Gweight">
                <div id="weight">
                   <p>${resp[i][ViewingLeaderboard]} kg</p>
                </div>
             </div>
          </div>
          <hr class="boardLine fadeIn animate delayMedium">
             `;

            }

            const selectHTML = `<select id="leaderboardReps" class="changeLeaderboardRepsSelect" onchange="changeLeaderboardReps();"></select>`;

            if (Object.keys(resp).length === 1) {
                //usermsg1.textContent = "Det er " + parseInt(Object.keys(resp).length) + " bruker på tavlen";
                usermsg1.innerHTML = peopleLeaderboardsTxtHTML(`Filter: ${selectHTML}<br>Det er 1 bruker på tavlen`);
            } else {
                //usermsg1.textContent = "Det er " + parseInt(Object.keys(resp).length) + " brukere på tavlen";
                usermsg1.innerHTML = peopleLeaderboardsTxtHTML(`Filter: ${selectHTML}<br>Det er ${parseInt(Object.keys(resp).length)} brukere på tavlen`);
            }

            for (let x = 0; x < repsList.length; x++) {

                if (repsList[x] !== "0") {

                    let repsText = "";
                    if (repsList[x] === "1") {
                        repsText = `ORM / 1 rep`;
                    } else {
                        repsText = `${repsList[x]} reps`;
                    }

                    let html = `<option value="${repsList[x]}">${repsText}</option>`;
                    if (repsList[x] === reps) {
                        html = `<option selected="selected" value="${repsList[x]}">${repsText}</option>`;
                    }

                    document.getElementById("leaderboardReps").innerHTML += html;
                }
            }

            leaderboardIsLoading = false;

        } else {
            //usermsg1.textContent = errorLoadingText;
            usermsg1.innerHTML = peopleLeaderboardsTxtHTML();
            alert(`Ledertavlen ${ViewingLeaderboard} finnes ikke!`);
            window.history.back();
        }

    } else {
        //usermsg1.textContent = "Det er ingen brukere på tavlen";
        usermsg1.innerHTML = peopleLeaderboardsTxtHTML(`Det er ingen brukere på tavlen`);
    }
}

function peopleLeaderboardsTxtHTML(aInput) {

    const inputInfo = aInput || errorLoadingText;

    const htmlInfo = `
    <p id="peopleLeaderboardsTxt" class="noselect fadeIn animate delaySmall">
    ${inputInfo}
    </p>`;

    return htmlInfo;

}


function changeLeaderboardReps() {

    const reps = document.getElementById("leaderboardReps").value;

    sessionStorage.setItem("leaderboards_filter_reps", reps);

    location.reload();

}