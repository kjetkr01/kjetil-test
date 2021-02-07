let liftsLeft = null, goalsLeft = null;

function enableOverlay(aType) {

    const type = aType;
    const title1 = document.getElementById("title1");
    const inp1 = document.getElementById("inp1");
    const inp2 = document.getElementById("inp2");
    const inp3 = document.getElementById("inp3");
    const Gsave = document.getElementById("Gsave");
    const respMsg = document.getElementById("resp");

    const createNewLiftorGoalOverlay = document.getElementById("createNewLiftorGoalOverlay");

    title1.innerHTML = "";
    inp1.innerHTML = "";
    inp2.value = "";
    inp3.value = "";
    document.getElementById("inp2").innerHTML = "";
    document.getElementById("inp3").innerHTML = "";
    Gsave.innerHTML = "";
    respMsg.innerHTML = "";

    if (type === "lift" && liftsLeft) {
        title1.textContent = "Legg til nytt løft";
        const liftsLeftInfo = liftsLeft.info();

        if (liftsLeftInfo.length > 0) {
            for (let i = 0; i < liftsLeftInfo.length; i++) {
                inp1.innerHTML += `<option value="${liftsLeftInfo[i]}">${liftsLeftInfo[i]}`;
            }
            Gsave.innerHTML = `<button id="save" onclick="saveLiftOrGoal('lift');">Lagre</button>`;
        }

        createNewLiftorGoalOverlay.style.display = "block";

    } else if (type === "goal" && goalsLeft) {
        title1.textContent = "Legg til nytt mål";
        const goalsLeftInfo = goalsLeft.info();

        if (goalsLeftInfo.length > 0) {
            for (let i = 0; i < goalsLeftInfo.length; i++) {
                inp1.innerHTML += `<option value="${goalsLeftInfo[i]}">${goalsLeftInfo[i]}`;
            }
            Gsave.innerHTML = `<button id="save" onclick="saveLiftOrGoal('goal');">Lagre</button>`;
        }

        createNewLiftorGoalOverlay.style.display = "block";
    } else {
        alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
        return;
    }
}

function TliftsLeft(aLiftsLeft) {
    const liftsLeftInfo = aLiftsLeft;

    this.info = function () {
        return liftsLeftInfo;
    }

}

function TgoalsLeft(aGoalsLeft) {
    const goalsLeftInfo = aGoalsLeft;

    this.info = function () {
        return goalsLeftInfo;
    }

}

async function saveLiftOrGoal(aType) {

    const respMsg = document.getElementById("resp");

    if (aType === "lift" || aType === "goal") {

        const inp1 = document.getElementById("inp1").value;
        const inp2 = document.getElementById("inp2").value;
        const inp3 = document.getElementById("inp3").value;

        const validateInfo = validateLiftOrGoal(inp1, inp2, inp3, aType);

        if (validateInfo.isValid === true && validateInfo.info) {
            respMsg.textContent = "Lagrer...";
            console.log()

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
        respMsg.textContent = "Det har oppstått en feil!";
    }
}

function validateLiftOrGoal(aInp1, aInp2, aInp3, aType) {

    let isValid = false;
    let msg = "Vennligst fyll ut alle feltene!";
    let info = {};

    if (aInp1 && aInp2 && aInp3 && aType) {

        const input1 = aInp1;
        const input2 = aInp2;
        const input3 = aInp3;
        const type = aType;

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

        info = { "exercise": input1, "kg": input2, "date": input3, "type": type };

        isValid = true;

    }

    return { "isValid": isValid, "msg": msg, "info": info };

}


function onlyAllowedKeys(evt) {
    const code = (evt.which) ? evt.which : evt.keyCode;
    const inp2 = document.getElementById("inp2").value;

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
}


function disableOverlay() {
    document.getElementById("createNewLiftorGoalOverlay").style.display = "none";
}