let liftsLeft = null, goalsLeft = null, liftsInfo = null, goalsInfo = null, badgeColors = null;

function enableOverlayCreate(aType) {

    if (aType) {

        const type = aType;
        const title1 = document.getElementById("title1C");
        const inp1 = document.getElementById("inp1C");
        const inp2 = document.getElementById("inp2C");
        const inp3 = document.getElementById("inp3C");
        const Gsave = document.getElementById("GsaveC");
        const respMsg = document.getElementById("respC");

        const createNewLiftorGoalOverlay = document.getElementById("createNewLiftorGoalOverlay");

        const today = new Date().toISOString().substr(0, 10) || null;

        title1.innerHTML = "";
        inp1.innerHTML = "";
        inp2.value = "";
        inp3.value = "";
        Gsave.innerHTML = "";
        respMsg.innerHTML = "";

        if (today) {
            inp3.value = today;
        }

        if (type === "lift" && liftsLeft) {
            title1.textContent = "Legg til nytt løft";
            const liftsLeftInfo = liftsLeft.info();

            if (liftsLeftInfo.length > 0) {
                for (let i = 0; i < liftsLeftInfo.length; i++) {
                    inp1.innerHTML += `<option value="${liftsLeftInfo[i]}">${liftsLeftInfo[i]}`;
                }
                Gsave.innerHTML = `<button id="saveC" onclick="saveLiftOrGoal('lift','create');">Lagre</button>`;
            }

            createNewLiftorGoalOverlay.style.display = "block";

        } else if (type === "goal" && goalsLeft) {
            title1.textContent = "Legg til nytt mål";
            const goalsLeftInfo = goalsLeft.info();

            if (goalsLeftInfo.length > 0) {
                for (let i = 0; i < goalsLeftInfo.length; i++) {
                    inp1.innerHTML += `<option value="${goalsLeftInfo[i]}">${goalsLeftInfo[i]}`;
                }
                Gsave.innerHTML = `<button id="saveC" onclick="saveLiftOrGoal('goal','create');">Lagre</button>`;
            }

            createNewLiftorGoalOverlay.style.display = "block";
        } else {
            alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
            return;
        }
    }
}


function enableOverlayEdit(aType, aExercise) {

    if (aType && aExercise) {

        const type = aType;
        const exercise = aExercise;
        const title1 = document.getElementById("title1E");
        const inp1 = document.getElementById("inp1E");
        const inp2 = document.getElementById("inp2E");
        const inp3 = document.getElementById("inp3E");
        const GdeleteE = document.getElementById("GdeleteE");
        const Gsave = document.getElementById("GsaveE");
        const respMsg = document.getElementById("respE");

        const editLiftorGoalOverlay = document.getElementById("editLiftorGoalOverlay");

        if (type === "goal") {
            title1.textContent = exercise + " (mål)";
        } else {
            title1.textContent = exercise + " (løft)";
        }

        title1.value = exercise;

        inp1.value = "";
        inp2.value = "";
        inp3.innerHTML = "";
        Gsave.innerHTML = "";
        respMsg.innerHTML = "";

        if (type === "lift" && liftsInfo) {
            const lifts = liftsInfo.info();
            const badgeColorsInfo = badgeColors.info();
            const badgeColorsValues = Object.entries(badgeColorsInfo);

            if (lifts[exercise]) {
                inp1.value = lifts[exercise].ORM;
                inp2.value = lifts[exercise].PRdate;
                GdeleteE.innerHTML = `<button id="deleteE" onclick="deleteLiftOrGoalConfirm('${exercise}', 'lift');">Slett løftet</button>`;
                Gsave.innerHTML = `<button id="saveE" onclick="saveLiftOrGoal('lift','edit');">Lagre</button>`;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    inp3.innerHTML += `<option value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1]}`;
                }

            } else {
                alert("Det har oppstått et problem!");
            }

            editLiftorGoalOverlay.style.display = "block";

        } else if (type === "goal" && goalsInfo) {
            const goals = goalsInfo.info();
            const badgeColorsInfo = badgeColors.info();
            const badgeColorsValues = Object.entries(badgeColorsInfo);

            if (goals[exercise]) {
                inp1.value = goals[exercise].goal;
                inp2.value = goals[exercise].Goaldate;
                GdeleteE.innerHTML = `<button id="deleteE" onclick="deleteLiftOrGoalConfirm('${exercise}', 'goal');">Slett målet</button>`;
                Gsave.innerHTML = `<button id="saveE" onclick="saveLiftOrGoal('goal','edit');">Lagre</button>`;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    inp3.innerHTML += `<option value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1]}`;
                }

            } else {
                alert("Det har oppstått et problem!");
            }

            editLiftorGoalOverlay.style.display = "block";
        } else {
            alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
            return;
        }
    }
}

function TliftsLeft(aLiftsLeft) {
    const liftsLeftInfo = aLiftsLeft;

    this.info = function () {
        return liftsLeftInfo;
    }
}

function Tlifts(aLifts) {
    const liftsInfo = aLifts;

    this.info = function () {
        return liftsInfo;
    }
}

function Tgoals(aGoals) {
    const goalsInfo = aGoals;

    this.info = function () {
        return goalsInfo;
    }
}

function TgoalsLeft(aGoalsLeft) {
    const goalsLeftInfo = aGoalsLeft;

    this.info = function () {
        return goalsLeftInfo;
    }
}

function TbadgeColors(aBadgeColors) {
    const badgeColors = aBadgeColors;

    this.info = function () {
        return badgeColors;
    }
}

async function saveLiftOrGoal(aType, editOrCreate) {

    if (aType === "lift" || aType === "goal" && editOrCreate === "edit" || editOrCreate === "create") {

        let respMsg = null, inp1 = null, inp2 = null, inp3 = null, color = 0;

        if (editOrCreate === "create") {
            respMsg = document.getElementById("respC");

            inp1 = document.getElementById("inp1C").value;
            inp2 = document.getElementById("inp2C").value;
            inp3 = document.getElementById("inp3C").value;
        }

        if (editOrCreate === "edit") {
            respMsg = document.getElementById("respE");

            inp1 = document.getElementById("title1E").value;
            inp2 = document.getElementById("inp1E").value;
            inp3 = document.getElementById("inp2E").value;
            color = document.getElementById("inp3E").value;
        }

        const validateInfo = validateLiftOrGoal(inp1, inp2, inp3, aType, color);

        if (validateInfo.isValid === true && validateInfo.info) {
            respMsg.textContent = "Lagrer...";

            const body = { "authToken": token, "userInfo": user, "info": validateInfo.info };
            const url = `/user/update/liftOrGoal/:${validateInfo.info}`;

            const resp = await callServerAPI(body, url);

            if (resp === true) {
                respMsg.textContent = "Lagret!";
                setTimeout(() => {
                    disableOverlay();
                }, 1500);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                respMsg.textContent = "Det har oppstått en feil!";
            }

        } else {
            respMsg.textContent = validateInfo.msg;
        }
    } else {
        alert("Det har oppstått en feil!");
    }
}

function validateLiftOrGoal(aInp1, aInp2, aInp3, aType, aColor) {

    let isValid = false;
    let msg = "Vennligst fyll ut alle feltene!";
    let info = {};

    if (aInp1 && aInp2 && aInp3 && aType) {

        const input1 = aInp1;
        const input2 = aInp2;
        const input3 = aInp3;
        const type = aType;
        const color = aColor;

        const onlyNumbers = /^[0-9.]+$/;

        const checkKG = input2.split(".");

        if (input2.match(onlyNumbers) && (checkKG.length > 2) === false) {
        } else {
            msg = "Antall KG er ugyldig! Eksempel: 120.25";
            return { "isValid": isValid, "msg": msg };
        }

        //Date format = YYYY-MM-DD
        const checkDateFormat = input3.split("-");
        if (checkDateFormat[0].length === 4 && checkDateFormat[1].length === 2 && checkDateFormat[2].length === 2) {
        } else {
            msg = "Dato er ugyldig!";
            return { "isValid": isValid, "msg": msg };
        }

        info = { "exercise": input1, "kg": input2, "date": input3, "type": type, "color": color };

        isValid = true;

    }

    return { "isValid": isValid, "msg": msg, "info": info };
}

function deleteLiftOrGoalConfirm(aExercise, aType) {

    if (aExercise && aType) {

        const type = aType;
        const exercise = aExercise;

        if (type === "lift") {
            const confirmation = confirm(`Er du sikkert på at du vil slette løftet ditt: ${exercise} ?`);
            if (confirmation === true) {
                deleteLiftOrGoal(exercise, type);
            }
        }

        if (type === "goal") {
            const confirmation = confirm(`Er du sikkert på at du vil slette målet ditt: ${exercise} ?`);
            if (confirmation === true) {
                deleteLiftOrGoal(exercise, type);
            }
        }


    } else {
        alert("Det har oppstått en feil!");
    }
}

async function deleteLiftOrGoal(aExercise, aType) {

    if (aExercise && aType) {

        const respMsg = document.getElementById("respE");

        const type = aType;
        const exercise = aExercise;
        let typeMsg = "Løftet";

        if (aType === "goal") {
            typeMsg = "Målet";
        }

        respMsg.textContent = `Sletter ${exercise}...`;

        const info = { "exercise": exercise, "type": type };

        const body = { "authToken": token, "userInfo": user, "info": info };
        const url = `/user/delete/liftOrGoal/:${info}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {
            respMsg.textContent = `${typeMsg} ble slettet!`;
            setTimeout(() => {
                disableOverlay();
            }, 1500);
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            respMsg.textContent = "Kunne ikke slette" + exercise;
        }


    } else {
        alert("Det har oppstått en feil!");
    }

}


function onlyAllowedKeys(evt, editOrCreate) {
    const code = (evt.which) ? evt.which : evt.keyCode;

    if (editOrCreate === "create" || editOrCreate === "edit") {

        let inp2 = document.getElementById("inp2C").value;

        if (editOrCreate === "edit") {
            inp2 = document.getElementById("inp1E").value;
        }

        if (inp2.length <= 5) {

            let length = 0;

            if (inp2.match(/\./g)) {
                length = inp2.match(/\./g).length;
            }

            if (code >= 48 && code <= 57 || code === 46 && length === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function disableOverlay(aEditOrCreate) {

    if (aEditOrCreate === "create") {
        document.getElementById("createNewLiftorGoalOverlay").style.display = "none";
    }

    if (aEditOrCreate === "edit") {
        document.getElementById("editLiftorGoalOverlay").style.display = "none";
    }
}