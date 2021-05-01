let liftsLeft = null, goalsLeft = null, liftsInfo = null, goalsInfo = null, badgeColors = null, traningsplitInfo = null;

function enableOverlayCreate(aType) {

    if (aType) {

        const type = aType;
        const title1 = document.getElementById("title1C");
        const inp1 = document.getElementById("inp1C");
        const inp2 = document.getElementById("inp2C");
        const inp3 = document.getElementById("inp3C");
        const inp4 = document.getElementById("inp4C");
        const Gsave = document.getElementById("GsaveC");
        const respMsg = document.getElementById("respC");

        const createNewLiftorGoalOverlay = document.getElementById("createNewLiftorGoalOverlay");

        const today = new Date().toISOString().substr(0, 10) || null;

        title1.innerHTML = "";
        inp1.innerHTML = "";
        inp2.value = "";
        inp3.value = "";
        inp4.value = "";
        Gsave.innerHTML = "";
        respMsg.innerHTML = "";

        if (today) {
            inp4.value = today;
            inp4.setAttribute('max', today);
        }

        if (type === "lift" && liftsLeft) {
            title1.textContent = "Legg til nytt løft";
            const liftsLeftInfo = liftsLeft.info();

            respMsg.innerHTML = `Du kan lage ${liftsLeftInfo} løft til`;

            if (allowedExercises.length > 0) {
                const currentlySorting = localStorage.getItem("display_lifts_owner");
                for (let i = 0; i < allowedExercises.length; i++) {

                    if (allowedExercises[i] === currentlySorting && allowedExercises.includes(currentlySorting)) {
                        inp1.innerHTML += `<option selected="selected" value="${allowedExercises[i]}">${capitalizeFirstLetter(allowedExercises[i])}`;
                    } else {
                        inp1.innerHTML += `<option value="${allowedExercises[i]}">${capitalizeFirstLetter(allowedExercises[i])}`;
                    }
                }

                if (navigator.onLine) {
                    Gsave.innerHTML = `<button id="saveC" class="pointer" onclick="saveLiftOrGoal('lift','create');">Lagre</button>`;
                } else {
                    Gsave.innerHTML = `<button id="saveC" disabled onclick="saveLiftOrGoal('lift','create');">Lagre</button>`;
                }
            }

            createNewLiftorGoalOverlay.style.display = "block";

        } else if (type === "goal" && goalsLeft) {
            title1.textContent = "Legg til nytt mål";
            const goalsLeftInfo = goalsLeft.info();

            respMsg.innerHTML = `Du kan lage ${goalsLeftInfo} mål til`;

            if (allowedExercises.length > 0) {
                const currentlySorting = localStorage.getItem("display_goals_owner");
                for (let i = 0; i < allowedExercises.length; i++) {
                    if (allowedExercises[i] === currentlySorting && allowedExercises.includes(currentlySorting)) {
                        inp1.innerHTML += `<option selected="selected" value="${allowedExercises[i]}">${capitalizeFirstLetter(allowedExercises[i])}`;
                    } else {
                        inp1.innerHTML += `<option value="${allowedExercises[i]}">${capitalizeFirstLetter(allowedExercises[i])}`;
                    }
                }
                if (navigator.onLine) {
                    Gsave.innerHTML = `<button id="saveC" class="pointer" onclick="saveLiftOrGoal('goal','create');">Lagre</button>`;
                } else {
                    Gsave.innerHTML = `<button id="saveC" disabled onclick="saveLiftOrGoal('goal','create');">Lagre</button>`;
                }
            }

            createNewLiftorGoalOverlay.style.display = "block";
        } else {
            alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
            return;
        }
    }
}


function enableOverlayEdit(aType, aExercise, aId) {

    if (aType && aExercise) {

        const type = aType;
        const exercise = aExercise.toLowerCase();
        const exerciseCapitalizedFirst = capitalizeFirstLetter(exercise);
        const id = aId;
        const editLiftorGoal = document.getElementById("editLiftorGoal");
        const title1 = document.getElementById("title1E");
        const inp1 = document.getElementById("inp1E");
        const inp2 = document.getElementById("inp2E");
        const inp3 = document.getElementById("inp3E");
        const inp4 = document.getElementById("inp4E");
        const GdeleteE = document.getElementById("GdeleteE");
        const Gsave = document.getElementById("GsaveE");
        const respMsg = document.getElementById("respE");

        const editLiftorGoalOverlay = document.getElementById("editLiftorGoalOverlay");
        editLiftorGoal.style.border = "";

        if (type === "goal") {
            title1.textContent = exerciseCapitalizedFirst + " (mål)";
        } else {
            title1.textContent = exerciseCapitalizedFirst + " (løft)";
        }

        title1.value = exercise;

        inp1.value = "";
        inp2.value = "";
        inp3.value = "";
        inp4.innerHTML = "";
        GdeleteE.innerHTML = "";
        Gsave.innerHTML = "";
        respMsg.innerHTML = "";
        const showDeleteBtn = true;

        const today = new Date().toISOString().substr(0, 10) || null;

        if (today) {
            inp3.setAttribute('max', today);
        }

        if (type === "lift" && liftsInfo) {

            const lifts = liftsInfo.info();
            const badgeColorsInfo = badgeColors.info();
            const badgeColorsValues = Object.entries(badgeColorsInfo);

            let lift = lifts[exercise];

            function findWithAttr(value) {
                for (var i = 0; i < lift.length; i += 1) {
                    if (lift[i].id === value) {
                        return i;
                    }
                }
                return -1;
            }

            const index = findWithAttr(id);

            if (index >= 0) {
                lift = lifts[exercise][index];
            }

            if (lift) {
                inp1.value = lift.kg;
                inp2.value = lift.reps;
                inp3.value = lift.date;

                //document.getElementById("Ginp3E").innerHTML += "<br>" + getDaysSinceAndDate(lift.date).daysSinceMsg;
                if (navigator.onLine) {
                    if (showDeleteBtn === true) {
                        GdeleteE.innerHTML = `<button id="deleteE" class="pointer" onclick="deleteLiftOrGoalConfirm('${exercise}', 'lift', '${id}');">Slett løftet</button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" class="pointer" onclick="saveLiftOrGoal('lift','edit', '${id}');">Lagre</button>`;
                } else {
                    if (showDeleteBtn === true) {
                        GdeleteE.innerHTML = `<button id="deleteE" disabled onclick="deleteLiftOrGoalConfirm('${exercise}', 'lift', '${id}');">Slett løftet</button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" disabled onclick="saveLiftOrGoal('lift','edit', '${id}');">Lagre</button>`;
                }

                const color = lift.color;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    if (badgeColorsValues[i][0] === color) {
                        inp4.innerHTML += `<option selected="selected" value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1]}</option>`;
                    } else {
                        inp4.innerHTML += `<option value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1]}</option>`;
                    }
                }

                if (badgeColorBorders.hasOwnProperty(color)) {
                    document.getElementById("editLiftorGoal").style.border = `1px solid #${badgeColorBorders[color]}`;
                }

                editLiftorGoalOverlay.style.display = "block";

            } else {
                alert("Det har oppstått et problem!");
            }

        } else if (type === "goal" && goalsInfo) {
            const goals = goalsInfo.info();
            const badgeColorsInfo = badgeColors.info();
            const badgeColorsValues = Object.entries(badgeColorsInfo);

            let goal = goals[exercise];

            function findWithAttr(value) {
                for (var i = 0; i < goal.length; i += 1) {
                    if (goal[i].id === value) {
                        return i;
                    }
                }
                return -1;
            }

            const index = findWithAttr(id);

            if (index >= 0) {
                goal = goals[exercise][index];
            }

            if (goal) {
                inp1.value = goal.kg;
                inp2.value = goal.reps;
                inp3.value = goal.date;

                if (navigator.onLine) {
                    if (showDeleteBtn === true) {
                        GdeleteE.innerHTML = `<button id="deleteE" class="pointer" onclick="deleteLiftOrGoalConfirm('${exercise}', 'goal', '${id}');">Slett målet</button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" class="pointer" onclick="saveLiftOrGoal('goal','edit', '${id}');">Lagre</button>`;
                } else {
                    if (showDeleteBtn === true) {
                        GdeleteE.innerHTML = `<button id="deleteE" disabled onclick="deleteLiftOrGoalConfirm('${exercise}', 'goal', '${id}');">Slett målet</button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" disabled onclick="saveLiftOrGoal('goal','edit', '${id}');">Lagre</button>`;
                }

                const color = goal.color;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    if (badgeColorsValues[i][0] === color) {
                        inp4.innerHTML += `<option selected="selected" value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1]}</option>`;
                    } else {
                        inp4.innerHTML += `<option value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1]}</option>`;
                    }
                }

                if (badgeColorBorders.hasOwnProperty(color)) {
                    document.getElementById("editLiftorGoal").style.border = `1px solid #${badgeColorBorders[color]}`;
                }

                editLiftorGoalOverlay.style.display = "block";

            } else {
                alert("Det har oppstått et problem!");
            }

        } else {
            alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
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

function Ttrainingsplit(aTrainingsplit) {
    const trainingsplit = aTrainingsplit;

    this.info = function () {
        return trainingsplit;
    }
}

let isSaving = false;
async function saveLiftOrGoal(aType, editOrCreate, aId) {

    if (navigator.onLine) {

        if (isSaving === true) {
            return;
        }

        if (aType === "lift" || aType === "goal" && editOrCreate === "edit" || editOrCreate === "create") {

            let respMsg = null, inp1 = null, inp2 = null, inp3 = null, inp4, color = 0, id = null;

            if (editOrCreate === "create") {
                respMsg = document.getElementById("respC");

                inp1 = document.getElementById("inp1C").value;
                inp2 = document.getElementById("inp2C").value;
                inp3 = document.getElementById("inp3C").value;
                inp4 = document.getElementById("inp4C").value;
            }

            if (editOrCreate === "edit") {
                respMsg = document.getElementById("respE");

                inp1 = document.getElementById("title1E").value;
                inp2 = document.getElementById("inp1E").value;
                inp3 = document.getElementById("inp2E").value;
                inp4 = document.getElementById("inp3E").value;
                color = document.getElementById("inp4E").value;

                id = aId;
            }

            const validateInfo = validateLiftOrGoal(inp1, inp2, inp3, inp4, aType, color, id);

            if (validateInfo.isValid === true && validateInfo.info) {
                isSaving = true;
                respMsg.textContent = "Lagrer...";

                const infoHeader = { "info": validateInfo.info };
                const url = `/user/update/liftOrGoal/:${validateInfo.info}`;

                const resp = await callServerAPIPost(infoHeader, url);

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
}

function validateLiftOrGoal(aInp1, aInp2, aInp3, aInp4, aType, aColor, aId) {

    let isValid = false;
    let msg = "Vennligst fyll ut alle feltene!";
    let info = {};

    if (navigator.onLine) {

        if (aInp1 && aInp2 && aInp3 && aType) {

            const input1 = aInp1;
            const input2 = aInp2;
            const input3 = parseInt(aInp3);
            const input4 = aInp4;
            const type = aType;
            const color = aColor;
            const id = aId;

            const onlyNumbers = /^[0-9.]+$/;

            const checkKG = input2.split(".");

            if (input2.match(onlyNumbers) && (checkKG.length > 2) === false) {
            } else {
                msg = "Antall KG er ugyldig! Eksempel: 120.25";
                return { "isValid": isValid, "msg": msg };
            }

            if (input3 > 0) {

            } else {
                msg = "Reps er ugyldig! Eksempel: 4";
                return { "isValid": isValid, "msg": msg };
            }

            //Date format = YYYY-MM-DD
            const checkDateFormat = input4.split("-");

            const today = new Date().toISOString().substr(0, 10);

            if (input4 > today) {
                msg = "Dato kan ikke være i fremtiden!";
                return { "isValid": isValid, "msg": msg };
            }

            if (checkDateFormat[0].length === 4 && checkDateFormat[1].length === 2 && checkDateFormat[2].length === 2) {
            } else {
                msg = "Dato er ugyldig!";
                return { "isValid": isValid, "msg": msg };
            }

            info = { "exercise": input1, "kg": input2, "reps": input3, "date": input4, "type": type, "color": color, "id": id };

            isValid = true;

        }
    } else {
        msg = "Krever internettforbindelse!";
        isValid = false;
    }

    return { "isValid": isValid, "msg": msg, "info": info };
}

function deleteLiftOrGoalConfirm(aExercise, aType, aId) {

    if (navigator.onLine) {

        if (aExercise && aType) {

            const type = aType;
            const exercise = aExercise;
            const id = aId;

            if (type === "lift") {
                const confirmation = confirm(`Er du sikkert på at du vil slette løftet ditt: "${exercise}" ?`);
                if (confirmation === true) {
                    deleteLiftOrGoal(exercise, type, id);
                }
            }

            if (type === "goal") {
                const confirmation = confirm(`Er du sikkert på at du vil slette målet ditt: "${exercise}" ?`);
                if (confirmation === true) {
                    deleteLiftOrGoal(exercise, type, id);
                }
            }


        } else {
            alert("Det har oppstått en feil!");
        }
    }
}

async function deleteLiftOrGoal(aExercise, aType, aId) {

    if (navigator.onLine) {

        if (aExercise && aType) {

            const respMsg = document.getElementById("respE");

            const type = aType;
            const exercise = aExercise;
            const id = aId;
            let typeMsg = "Løftet";

            if (aType === "goal") {
                typeMsg = "Målet";
            }

            respMsg.textContent = `Sletter ${exercise}...`;

            const info = { "exercise": exercise, "type": type, "id": id };

            const infoHeader = { "info": info };
            const url = `/user/delete/liftOrGoal/:${info}`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {
                respMsg.textContent = `${typeMsg} ble slettet!`;
                setTimeout(() => {
                    disableOverlay();
                }, 1500);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                respMsg.textContent = "Kunne ikke slette " + exercise;
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }


        } else {
            alert("Det har oppstått en feil!");
        }
    }
}


function onlyAllowedKeys(evt, editOrCreate, aType) {
    const code = (evt.which) ? evt.which : evt.keyCode;

    if (editOrCreate === "create" || editOrCreate === "edit") {

        const type = aType;

        if (type === "kg") {

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

        } else if (type === "reps") {

            let inp3 = document.getElementById("inp3C").value;

            if (editOrCreate === "edit") {
                inp3 = document.getElementById("inp2E").value;
            }

            if (inp3 > 100) {

                return false;

            } else {
                return true;
            }

        }

    } else {
        return false;
    }
}


function disableOverlay() {

    const createNewLiftorGoalOverlay = document.getElementById("createNewLiftorGoalOverlay");
    const editLiftorGoalOverlay = document.getElementById("editLiftorGoalOverlay");
    const editDaysOverlay = document.getElementById("editworkoutPlanOverlay");

    if (createNewLiftorGoalOverlay) {
        createNewLiftorGoalOverlay.style.display = "none";
    }

    if (editLiftorGoalOverlay) {
        editLiftorGoalOverlay.style.display = "none";
    }

    if (editDaysOverlay) {
        editDaysOverlay.style.display = "none";
    }
}


const allowedDays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

// enableOverlayEditDays

function enableOverlayEditDays() {

    const respMsg = document.getElementById("respworkoutPlans");

    respMsg.textContent = "";

    /*for (let i = 0; i < allowedDays.length; i++) {
        if (document.getElementById(allowedDays[i])) {
            document.getElementById(allowedDays[i]).checked = false;
        }
    }
 
    if (traningsplitInfo) {
        const trainingsplitInformation = traningsplitInfo.info();
 
        const trainingsplitKeys = Object.keys(trainingsplitInformation);
 
        for (let i = 0; i < trainingsplitKeys.length; i++) {
            const current = trainingsplitKeys[i];
            if (allowedDays.includes(current)) {
                if (document.getElementById(current)) {
                    document.getElementById(current).checked = true;
                }
            }
        }
    }*/

    document.getElementById("editworkoutPlanOverlay").style.display = "block";

}

// end of enableOverlayEditDays


// saveTrainingDays

async function saveTrainingDays() {

    const respMsg = document.getElementById("respEditDays");
    respMsg.textContent = "";

    const trainingDays = [];

    for (let i = 0; i < allowedDays.length; i++) {
        if (document.getElementById(allowedDays[i])) {
            if (document.getElementById(allowedDays[i]).checked === true) {
                trainingDays.push(allowedDays[i]);
            }
        }
    }

    if (trainingDays.length === 0) {
        trainingDays.push("none");
    }

    if (trainingDays.length <= allowedDays.length) {

        respMsg.textContent = "Lagrer...";
        const infoHeader = { "trainingDays": trainingDays };
        const url = `/user/update/trainingDays/${trainingDays}`;

        const resp = await callServerAPIPost(infoHeader, url);

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
        respMsg.textContent = "Velg minst 1 dag";
    }
}

// end of saveTrainingDays


function changeOverlayBorderColor() {

    const inpVal = document.getElementById("inp4E");

    if (inpVal) {

        if (badgeColorBorders.hasOwnProperty(inpVal.value)) {
            document.getElementById("editLiftorGoal").style.border = `1px solid #${badgeColorBorders[inpVal.value]}`;
        }
    }
}