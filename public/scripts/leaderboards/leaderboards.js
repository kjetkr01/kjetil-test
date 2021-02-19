let previousLeaderboard = "";
let firstLeaderboard = null;

async function loadLeaderboards() {

    const body = { "authToken": token, "userInfo": user };
    const url = `/users/list/all/leaderboards`;

    const resp = await callServerAPI(body, url);

    if (resp.leaderboardsArr.length > 0 && resp.leaderboardsArr.length === Object.entries(resp.leaderboardsCounter).length) {

        //const lList = resp.leaderboardsArr;

        const leaderboardsArrOrder = [];

        for (let i = 0; i < Object.entries(resp.leaderboardsCounter).length; i++) {

            const keys = Object.keys(resp.leaderboardsCounter);

            leaderboardsArrOrder.push({ "leaderboard": [keys[i]], "usersCount": resp.leaderboardsCounter[keys[i]] })
        }

        leaderboardsArrOrder.sort(function (a, b) { return b.usersCount - a.usersCount });

        const leaderboardsTableRowDom = document.getElementById("leaderboardsTableRow");
        leaderboardsTableRowDom.innerHTML = "";

        firstLeaderboard = leaderboardsArrOrder[0].leaderboard[0];

        for (let i = 0; i < leaderboardsArrOrder.length; i++) {
            const currentLeaderboard = leaderboardsArrOrder[i].leaderboard[0];

            leaderboardsTableRowDom.innerHTML += `

          <td>
             <button id="${currentLeaderboard}" class="leaderboardsList fadeInLeft animate" onclick="getListOfLeaderboard('${currentLeaderboard}');">${currentLeaderboard}</button>
          </td>

 `;
        }

    }

    getListOfLeaderboard();
}


async function getListOfLeaderboard(aLeaderboard) {

    if (!aLeaderboard) {
        aLeaderboard = firstLeaderboard;
    }

    if (token && user && aLeaderboard) {
        const ViewingLeaderboard = aLeaderboard;

        if (document.getElementById(ViewingLeaderboard)) {

            if (document.getElementById(previousLeaderboard)) {
                document.getElementById(previousLeaderboard).classList.remove("active");
            }

            document.getElementById(ViewingLeaderboard).classList.add("active");
        };

        usermsg1.innerHTML = "";

        list.innerHTML = "";

        const body = { "authToken": token, "userInfo": user, "leaderboard": ViewingLeaderboard };
        const url = `/users/list/all/leaderboards/${ViewingLeaderboard}`;

        const resp = await callServerAPI(body, url);

        list.innerHTML = "";
        previousLeaderboard = ViewingLeaderboard;

        if (Object.keys(resp).length > 0) {

            // sorts leaderboard in correct order, from highest to lowest
            resp.sort(function (a, b) { return b[ViewingLeaderboard] - a[ViewingLeaderboard] });
            //

            for (let i = 0; i < Object.keys(resp).length; i++) {

                let placementHTML = `${i + 1}.`;
                let usernameHTML = `<button class="peopleLeaderboardsListName" onClick="viewUser('${resp[i].id}')">${resp[i].username}</button>`;

                if (resp[i].id === userID) {
                    usernameHTML = `<button class="accountOwner" onClick="viewUser('${resp[i].id}')">${resp[i].username}</button>`;
                }

                if (i === 0) {
                    placementHTML = `<img id="placement" draggable="false" class="icons" src="images/goldMedal.svg"
          alt="${i + 1}.">
       </img>`;
                } else if (i === 1) {
                    placementHTML = `<img id="placement" draggable="false" class="icons" src="images/silverMedal.svg"
          alt="${i + 1}.">
       </img>`;
                } else if (i === 2) {
                    placementHTML = `<img id="placement" draggable="false" class="icons" src="images/bronzeMedal.svg"
          alt="${i + 1}.">
       </img>`;
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

            if (Object.keys(resp).length === 1) {
                usermsg1.textContent = "Det er " + parseInt(Object.keys(resp).length) + " bruker på tavlen";
            } else {
                usermsg1.textContent = "Det er " + parseInt(Object.keys(resp).length) + " brukere på tavlen";
            }

        } else {
            usermsg1.textContent = errorLoadingText;
            //alert(`Ledertavlen ${ViewingLeaderboard} finnes ikke!`);
            //window.history.back();
        }

    } else {
        usermsg1.textContent = "Det er ingen brukere på tavlen";
    }
}