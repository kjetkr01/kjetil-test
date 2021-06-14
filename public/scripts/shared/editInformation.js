let liftsLeft = null, goalsLeft = null, trainingsplitsLeft = null, liftsInfo = null, goalsInfo = null, badgeColors = null;

function changeVisibility() {
    const inp1 = document.getElementById("inp1C");
    const hideDoms = ["Gtitle4C", "Gline4C", "Ginp3C"];

    if (inp1.value.includes("i vekt")) {
        for (let x = 0; x < hideDoms.length; x++) {
            const dom = document.getElementById(hideDoms[x]);
            if (dom) {
                dom.classList = "hidden";
            }
        }
    } else {
        for (let x = 0; x < hideDoms.length; x++) {
            const dom = document.getElementById(hideDoms[x]);
            if (dom) {
                dom.removeAttribute("class");
            }
        }
    }
}

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

        const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).substr(0, 10);

        title1.innerHTML = "";
        inp1.innerHTML = "";
        inp1.removeAttribute("onChange");
        inp2.value = "";
        inp3.value = "";
        inp4.value = "";
        Gsave.innerHTML = "";
        respMsg.innerHTML = "";

        if (today) {
            inp4.value = today;
            inp4.setAttribute('max', today);
        }

        const doms = ["Gtitle4C", "Gline4C", "Ginp3C"];
        for (let x = 0; x < doms.length; x++) {
            const dom = document.getElementById(doms[x]);
            if (dom) {
                dom.removeAttribute("class");
            }
        }




        if (navigator.onLine) {

            if (type === "lift" && liftsLeft) {
                title1.textContent = "Opprett nytt løft";
                const liftsLeftInfo = liftsLeft.info();

                if (allowedLifts && allowedLifts.length > 0) {
                    respMsg.innerHTML = `Du kan lage ${liftsLeftInfo} løft til`;
                    const currentlySorting = localStorage.getItem("display_lifts_owner");
                    for (let i = 0; i < allowedLifts.length; i++) {

                        if (allowedLifts[i] === currentlySorting) {
                            inp1.innerHTML += `<option selected="selected" value="${allowedLifts[i]}">${capitalizeFirstLetter(allowedLifts[i])}`;
                        } else {
                            inp1.innerHTML += `<option value="${allowedLifts[i]}">${capitalizeFirstLetter(allowedLifts[i])}`;
                        }
                    }

                    if (navigator.onLine) {
                        Gsave.innerHTML = `<button id="saveC" class="pointer" onclick="saveLiftOrGoal('lift','create');">Lagre</button>`;
                    } else {
                        Gsave.innerHTML = `<button id="saveC" disabled onclick="saveLiftOrGoal('lift','create');">Lagre</button>`;
                    }
                } else {
                    respMsg.innerHTML = `Det har oppstått en feil!`;
                }


                createNewLiftorGoalOverlay.style.display = "block";

            } else if (type === "goal" && goalsLeft) {
                title1.textContent = "Opprett nytt mål";
                const goalsLeftInfo = goalsLeft.info();

                if (allowedGoals && allowedGoals.length > 0) {
                    respMsg.innerHTML = `Du kan lage ${goalsLeftInfo} mål til`;
                    inp1.setAttribute("onChange", "changeVisibility();");
                    const currentlySorting = localStorage.getItem("display_goals_owner");
                    for (let i = 0; i < allowedGoals.length; i++) {
                        if (allowedGoals[i] === currentlySorting && allowedGoals.includes(currentlySorting)) {
                            inp1.innerHTML += `<option selected="selected" value="${allowedGoals[i]}">${capitalizeFirstLetter(allowedGoals[i])}`;
                            for (let x = 0; x < doms.length; x++) {
                                const dom = document.getElementById(doms[x]);
                                if (dom) {
                                    dom.classList = "hidden";
                                }
                            }
                        } else {
                            inp1.innerHTML += `<option value="${allowedGoals[i]}">${capitalizeFirstLetter(allowedGoals[i])}`;
                        }
                    }

                    if (navigator.onLine) {
                        Gsave.innerHTML = `<button id="saveC" class="pointer" onclick="saveLiftOrGoal('goal','create');">Lagre</button>`;
                    } else {
                        Gsave.innerHTML = `<button id="saveC" disabled onclick="saveLiftOrGoal('goal','create');">Lagre</button>`;
                    }
                } else {
                    respMsg.innerHTML = `Det har oppstått en feil!`;
                }

                createNewLiftorGoalOverlay.style.display = "block";
            } else {
                //alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
                showAlert(`Det har oppstått en feil: "${aType}" eller "allowedGoals/allowedLifts" finnes ikke!`);
            }
        } else {
            //respMsg.innerHTML = `Du må ha Internett-forbindelse for å opprette nytt løft eller mål!`;
            showAlert(`Du må ha Internett-forbindelse for å opprette nytt løft eller mål!`, true);
        }
    }
}

function checkIfEdited(aDetails) {

    if (aDetails) {

        let inp1Edited = false, inp2Edited = false, inp3Edited = false, inp4Edited = false;

        const inp1 = document.getElementById("inp1E");
        const inp2 = document.getElementById("inp2E");
        const inp3 = document.getElementById("inp3E");
        const inp4 = document.getElementById("inp4E");

        inp1.addEventListener("input", function () {
            if (inp1.value !== aDetails.kg.toString()) {
                inp1Edited = true;
            } else {
                inp1Edited = false;
            }
            changeSaveBtn();
        });

        inp2.addEventListener("input", function () {
            if (inp2.value !== aDetails.reps.toString()) {
                inp2Edited = true;
            } else {
                inp2Edited = false;
            }
            changeSaveBtn();
        });

        inp3.addEventListener("change", function () {
            if (inp3.value !== aDetails.date) {
                inp3Edited = true;
            } else {
                inp3Edited = false;
            }
            changeSaveBtn();
        });

        inp4.addEventListener("change", function () {
            if (inp4.value !== aDetails.color) {
                inp4Edited = true;
            } else {
                inp4Edited = false;
            }
            changeSaveBtn();
        });

        function changeSaveBtn() {
            const saveE = document.getElementById("saveE");

            if (inp1Edited === true || inp2Edited === true || inp3Edited === true || inp4Edited === true) {
                saveE.removeAttribute("disabled");
                saveE.classList = "pointer";
            } else {
                saveE.setAttribute("disabled", "disabled");
                saveE.classList = "";
            }
        }
    }
}

function enableOverlayView(aType, aExercise, aId) {

    if (aType && aExercise) {

        const type = aType;
        const exercise = aExercise.toLowerCase();
        const exerciseCapitalizedFirst = capitalizeFirstLetter(exercise);
        const id = aId;
        const viewLiftorGoal = document.getElementById("viewLiftorGoal");
        const title1 = document.getElementById("title1W");
        const inp1 = document.getElementById("inp1W");
        const inp2 = document.getElementById("inp2W");
        const inp3 = document.getElementById("inp3W");
        const GeditW = document.getElementById("GeditW");

        let showEditBtn = false;

        if (document.getElementById("editLiftorGoal")) {
            showEditBtn = true;
        }

        const viewLiftorGoalOverlay = document.getElementById("viewLiftorGoalOverlay");
        viewLiftorGoal.style.border = "";

        if (type === "goal") {
            title1.textContent = exerciseCapitalizedFirst + " (mål)";
        } else {
            title1.textContent = exerciseCapitalizedFirst + " (løft)";
        }

        title1.value = exercise;

        inp1.value = "";
        inp2.value = "";
        inp3.value = "";

        const doms = ["Gtitle3W", "Gline3W", "Ginp2W"];

        for (let x = 0; x < doms.length; x++) {
            const dom = document.getElementById(doms[x]);
            if (dom) {
                dom.removeAttribute("class");
            }
        }

        const today = new Date().toISOString().substr(0, 10) || null;

        if (today) {
            inp3.setAttribute('max', today);
        }

        if (type === "lift" && liftsInfo) {

            const lifts = liftsInfo.info();

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
                inp1.innerHTML = lift.kg;
                inp2.innerHTML = lift.reps;

                const daysSinceAndDate = getDaysSinceAndDate(lift.date);

                inp3.innerHTML = `${daysSinceAndDate.fixedDate}<br>${daysSinceAndDate.daysSinceMsg}`;

                const color = lift.color;

                if (badgeColorsJSON[color]) {
                    document.getElementById("viewLiftorGoal").style.border = `1px solid #${badgeColorsJSON[color].border}`;
                }

                if (showEditBtn === true) {
                    if (navigator.onLine) {
                        GeditW.innerHTML = `<button id="editW" class="pointer" onClick="disableOverlays();enableOverlayEdit('lift', '${exercise}', '${id}');">Endre</button>`;
                    } else {
                        GeditW.innerHTML = `<button id="editW" disabled>Endre</button>`;
                    }
                }

                viewLiftorGoalOverlay.style.display = "block";

            } else {
                //alert("Det har oppstått et problem!");
                showAlert("Det har oppstått et problem!");
            }

        } else if (type === "goal" && goalsInfo) {
            const goals = goalsInfo.info();

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
                inp1.innerHTML = goal.kg;

                if (exercise.includes("i vekt")) {

                    for (let x = 0; x < doms.length; x++) {
                        const dom = document.getElementById(doms[x]);
                        if (dom) {
                            dom.classList = "hidden";
                        }
                    }

                } else {

                    inp2.innerHTML = goal.reps;
                }

                const daysSinceAndDate = getDaysSinceAndDate(goal.date);

                inp3.innerHTML = `${daysSinceAndDate.fixedDate}<br>${daysSinceAndDate.daysSinceMsg}`;

                const color = goal.color;

                if (badgeColorsJSON[color]) {
                    document.getElementById("viewLiftorGoal").style.border = `1px solid #${badgeColorsJSON[color].border}`;
                }

                if (showEditBtn === true) {
                    if (navigator.onLine) {
                        GeditW.innerHTML = `<button id="editW" class="pointer" onClick="disableOverlays();enableOverlayEdit('goal', '${exercise}', '${id}');">Endre</button>`;
                    } else {
                        GeditW.innerHTML = `<button id="editW" disabled>Endre</button>`;
                    }
                }

                viewLiftorGoalOverlay.style.display = "block";

            } else {
                //alert("Det har oppstått et problem!");
                showAlert("Det har oppstått et problem!");
            }

        } else {
            //alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
            showAlert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
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
        const GcancelE = document.getElementById("GcancelE");
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

        const showDoms = ["Gtitle3E", "Gline3E", "Ginp2E"];

        for (let x = 0; x < showDoms.length; x++) {
            const dom = document.getElementById(showDoms[x]);
            if (dom) {
                dom.removeAttribute("class");
            }
        }

        const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).substr(0, 10);

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
                checkIfEdited(lift);
                inp1.value = lift.kg;
                inp2.value = lift.reps;
                inp3.value = lift.date;

                //document.getElementById("Ginp3E").innerHTML += "<br>" + getDaysSinceAndDate(lift.date).daysSinceMsg;
                if (navigator.onLine) {
                    if (showDeleteBtn === true) {
                        //GdeleteE.innerHTML = `<button id="deleteE" class="pointer" onclick="deleteLiftOrGoalConfirm('${exercise}', 'lift', '${id}');">Slett løftet</button>`;
                        GdeleteE.innerHTML = `<button id="deleteE" class="pointer" onclick="deleteLiftOrGoalConfirm('${exercise}', 'lift', '${id}');"><img 
                        src="images/trash.svg"></img></button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" disabled onclick="saveLiftOrGoal('lift','edit', '${id}');">Lagre</button>`;
                } else {
                    if (showDeleteBtn === true) {
                        GdeleteE.innerHTML = `<button id="deleteE" disabled><img src="images/trash.svg"></img></button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" disabled>Lagre</button>`;
                }

                const color = lift.color;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    if (badgeColorsValues[i][0] === color) {
                        inp4.innerHTML += `<option selected="selected" value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1].name}</option>`;
                    } else {
                        inp4.innerHTML += `<option value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1].name}</option>`;
                    }
                }

                if (badgeColorsJSON[color]) {
                    document.getElementById("editLiftorGoal").style.border = `1px solid #${badgeColorsJSON[color].border}`;
                }

                GcancelE.innerHTML = `<button id="cancelE" class="pointer" onclick="disableOverlays();enableOverlayView('lift', '${exercise}', '${id}');"">Avbryt</button>`;

                editLiftorGoalOverlay.style.display = "block";

            } else {
                //alert("Det har oppstått et problem!");
                showAlert("Det har oppstått et problem!");
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

                const hideDoms = ["Gtitle3E", "Gline3E", "Ginp2E"];

                if (exercise.includes("i vekt")) {

                    for (let x = 0; x < hideDoms.length; x++) {
                        const dom = document.getElementById(hideDoms[x]);
                        if (dom) {
                            dom.classList = "hidden";
                        }
                    }

                } else {

                    inp2.value = goal.reps;
                }

                checkIfEdited(goal);
                inp1.value = goal.kg;
                inp3.value = goal.date;

                if (navigator.onLine) {
                    if (showDeleteBtn === true) {
                        //GdeleteE.innerHTML = `<button id="deleteE" class="pointer" onclick="deleteLiftOrGoalConfirm('${exercise}', 'goal', '${id}');">Slett målet</button>`;
                        GdeleteE.innerHTML = `<button id="deleteE" class="pointer" onclick="deleteLiftOrGoalConfirm('${exercise}', 'goal', '${id}');"><img 
                        src="images/trash.svg"></img></button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" disabled onclick="saveLiftOrGoal('goal','edit', '${id}');">Lagre</button>`;
                } else {
                    if (showDeleteBtn === true) {
                        GdeleteE.innerHTML = `<button id="deleteE" disabled><img src="images/trash.svg"></img></button>`;
                    }
                    Gsave.innerHTML = `<button id="saveE" disabled>Lagre</button>`;
                }

                const color = goal.color;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    if (badgeColorsValues[i][0] === color) {
                        inp4.innerHTML += `<option selected="selected" value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1].name}</option>`;
                    } else {
                        inp4.innerHTML += `<option value="${badgeColorsValues[i][0]}">${badgeColorsValues[i][1].name}</option>`;
                    }
                }

                if (badgeColorsJSON[color]) {
                    document.getElementById("editLiftorGoal").style.border = `1px solid #${badgeColorsJSON[color].border}`;
                }

                GcancelE.innerHTML = `<button id="cancelE" class="pointer" onclick="disableOverlays();enableOverlayView('goal', '${exercise}', '${id}');"">Avbryt</button>`;

                editLiftorGoalOverlay.style.display = "block";

            } else {
                //alert("Det har oppstått et problem!");
                showAlert("Det har oppstått et problem!");
            }

        } else {
            //alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
            showAlert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
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

function TtrainingsplitsLeft(aTrainingsplitsLeft) {
    const trainingsplitsLeftInfo = aTrainingsplitsLeft;

    this.info = function () {
        return trainingsplitsLeftInfo;
    }
}

function TbadgeColors(aBadgeColors) {
    const badgeColors = aBadgeColors;

    this.info = function () {
        return badgeColors;
    }
}

let isSaving = false;
async function saveLiftOrGoal(aType, editOrCreate, aId) {

    if (navigator.onLine) {

        if (isSaving === true) {
            return;
        }

        if (aType === "lift" || aType === "goal" && editOrCreate === "edit" || editOrCreate === "create") {

            let respMsg = null, inp1 = null, inp2 = null, inp3 = null, inp4, color = 0, id = null, saveBtn = null;

            if (editOrCreate === "create") {
                respMsg = document.getElementById("respC");

                inp1 = document.getElementById("inp1C").value;
                inp2 = document.getElementById("inp2C").value;
                if (document.getElementById("Ginp3C").classList[0] === "hidden") {
                    inp3 = `skipinp3-weightgoal`;
                } else {
                    inp3 = document.getElementById("inp3C").value;
                }
                inp4 = document.getElementById("inp4C").value;
                saveBtn = document.getElementById("saveC");
            }

            if (editOrCreate === "edit") {
                respMsg = document.getElementById("respE");

                inp1 = document.getElementById("title1E").value;
                inp2 = document.getElementById("inp1E").value;
                if (document.getElementById("Ginp2E").classList[0] === "hidden") {
                    inp3 = `skipinp3-weightgoal`;
                } else {
                    inp3 = document.getElementById("inp2E").value;
                }
                inp4 = document.getElementById("inp3E").value;
                color = document.getElementById("inp4E").value;
                saveBtn = document.getElementById("saveE");

                id = aId;
            }

            const validateInfo = validateLiftOrGoal(inp1, inp2, inp3, inp4, aType, color, id);

            if (validateInfo.isValid === true && validateInfo.info) {
                isSaving = true;
                saveBtn.innerHTML = "Lagrer...";
                //respMsg.textContent = "Lagrer...";

                const infoHeader = { "info": validateInfo.info };
                const url = `/user/update/liftOrGoal/:${validateInfo.info}`;

                const resp = await callServerAPIPost(infoHeader, url);

                if (resp === true) {
                    //respMsg.textContent = "Lagret!";
                    saveBtn.innerHTML = "Lagret!";
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                } else {
                    saveBtn.innerHTML = "Lagre";
                    respMsg.textContent = "Det har oppstått en feil!";
                }

            } else {
                respMsg.textContent = validateInfo.msg;
            }
        } else {
            //alert("Det har oppstått en feil!");
            showAlert("Det har oppstått en feil!");
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
            const input2 = parseFloat(aInp2.replace(/,/, '.'));
            const input3 = parseInt(aInp3);
            const input4 = aInp4;
            const type = aType;
            const color = aColor;
            const id = aId;

            if (isNaN(input2)) {
                msg = "Antall KG er ugyldig! Eksempel: 120.25";
                return { "isValid": isValid, "msg": msg };
            } else if (input2 <= 0) {
                msg = "Antall KG må være større enn 1!";
                return { "isValid": isValid, "msg": msg };
            }


            if (aInp3 !== `skipinp3-weightgoal`) {
                if (isNaN(input3)) {
                    msg = "Reps er ugyldig! Eksempel: 4";
                    return { "isValid": isValid, "msg": msg };
                } else if (input3 <= 0) {
                    msg = "Reps må være større enn 1!";
                    return { "isValid": isValid, "msg": msg };
                }
            }

            //Date format = YYYY-MM-DD
            const checkDateFormat = input4.split("-");

            const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).substr(0, 10);

            if (input4 > today) {
                msg = "Dato kan ikke være i fremtiden!";
                return { "isValid": isValid, "msg": msg };
            }

            if (checkDateFormat[0].length === 4 && checkDateFormat[1].length === 2 && checkDateFormat[2].length === 2) {
            } else {
                msg = "Dato er ugyldig!";
                return { "isValid": isValid, "msg": msg };
            }

            info = { "exercise": input1, "kg": parseFloat(input2), "reps": input3, "date": input4, "type": type, "color": color, "id": id };

            isValid = true;

        }

    } else {
        msg = defaultTxt.noConnection;
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
                /*const confirmation = confirm(`Er du sikkert på at du vil slette løftet ${capitalizeFirstLetter(exercise)}? Dette kan ikke angres!`);
                if (confirmation === true) {
                    deleteLiftOrGoal(exercise, type, id);
                }*/
                showConfirm(`Er du sikkert på at du vil slette løftet ${capitalizeFirstLetter(exercise)}? Dette kan ikke angres!`, `deleteLiftOrGoal('${exercise}', '${type}', '${id}');`);
            }

            if (type === "goal") {
                /*const confirmation = confirm(`Er du sikkert på at du vil slette målet ${capitalizeFirstLetter(exercise)}? Dette kan ikke angres!`);
                if (confirmation === true) {
                    deleteLiftOrGoal(exercise, type, id);
                }*/
                showConfirm(`Er du sikkert på at du vil slette målet ${capitalizeFirstLetter(exercise)}? Dette kan ikke angres!`, `deleteLiftOrGoal('${exercise}', '${type}', '${id}');`);
            }


        } else {
            //alert("Det har oppstått en feil!");
            showAlert("Det har oppstått en feil!");
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
            const deleteBtn = document.getElementById("deleteE");

            if (aType === "goal") {
                typeMsg = "Målet";
            }

            deleteBtn.innerHTML = `Sletter...`;
            //respMsg.textContent = `Sletter ${exercise}...`;

            const info = { "exercise": exercise, "type": type, "id": id };

            const infoHeader = { "info": info };
            const url = `/user/delete/liftOrGoal/:${info}`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {
                deleteBtn.innerHTML = `Slettet!`;
                //respMsg.textContent = `${typeMsg} ble slettet!`;
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                deleteBtn.innerHTML = `Slett ${typeMsg.toLowerCase()}`;
                respMsg.textContent = "Kunne ikke slette " + exercise;
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }


        } else {
            //alert("Det har oppstått en feil!");
            showAlert("Det har oppstått en feil!");
        }
    }
}


function onlyAllowedKeys(evt, aType) {
    const code = (evt.which) ? evt.which : evt.keyCode;

    const type = aType;

    if (type === "kg") {

        if (code >= 48 && code <= 57 || code === 46 || code === 44) {
            return true;
        } else {
            return false;
        }

    } else {

        if (code >= 48 && code <= 57) {
            return true;
        } else {
            return false;
        }
    }
}


const allowedDays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

// enableOverlayEditDays

function enableOverlayEditDays() {

    const respMsg = document.getElementById("respworkoutPlans");

    const trainingsplitsLeftInfo = trainingsplitsLeft.info();

    respMsg.textContent = "";
    let showSaveBtn = false;

    const allTrainingsplits = JSON.parse(localStorage.getItem("cachedAllTrainingsplits_owner"));
    const subscribedTrainingsplits = user.getSetting("subscribedtrainingsplits");

    if (!activetrainingsplit) {
        const hiddeDOMs = ["Gtitle4workoutPlans", "Gline4workoutPlans", "GtextworkoutPlans"];
        for (let i = 0; i < hiddeDOMs.length; i++) {
            document.getElementById(hiddeDOMs[i]).classList = "hidden";
        }
    } else {
        const textworkoutPlans = document.getElementById("textworkoutPlans");

        if (activetrainingsplit.user_id !== user.getId()) {
            textworkoutPlans.innerHTML = `${activetrainingsplit.trainingsplit_name} (av ${activetrainingsplit.owner})`;
        } else {
            textworkoutPlans.innerHTML = activetrainingsplit.trainingsplit_name;
        }

        const GsetNoneActivePlanworkoutPlans = document.getElementById("GsetNoneActivePlanworkoutPlans");

        if (navigator.onLine) {
            GsetNoneActivePlanworkoutPlans.innerHTML = `<button class="pointer" id="setNoneActivePlanworkoutPlans" onClick="setNoneActiveTrainingsplit();">Fjern som aktiv</button>`;
        } else {
            GsetNoneActivePlanworkoutPlans.innerHTML = `<button disabled id="setNoneActivePlanworkoutPlans">Fjern som aktiv</button>`;
        }

    }

    if (allTrainingsplits) {
        let listworkoutPlansOptionsHTML = "<option value='null'>Velg fra listen</option>";

        for (let i = 0; i < allTrainingsplits.length; i++) {
            const currentSplit = allTrainingsplits[i];
            let selected = "";
            if (activetrainingsplit) {
                if (activetrainingsplit.trainingsplit_id) {
                    if (activetrainingsplit.trainingsplit_id === currentSplit.trainingsplit_id) {
                        selected = "selected";
                    }
                }
            }
            listworkoutPlansOptionsHTML += `<option ${selected} value="${currentSplit.trainingsplit_id}">${currentSplit.trainingsplit_name}</option>`;
        }

        document.getElementById("listworkoutPlans").innerHTML = listworkoutPlansOptionsHTML;

        const GviewplanworkoutPlans = document.getElementById("GviewplanworkoutPlans");
        const GeditplanworkoutPlans = document.getElementById("GeditplanworkoutPlans");

        if (navigator.onLine) {
            GviewplanworkoutPlans.innerHTML = `<button class="pointer" id="viewplanworkoutPlans" onClick="viewTrainingsplitOwnerList();">Se planen</button>`;
            GeditplanworkoutPlans.innerHTML = `<button class="pointer" id="editplanworkoutPlans" onClick="editTrainingsplit();">Rediger</button>`;
        } else {
            GviewplanworkoutPlans.innerHTML = `<button disabled id="viewplanworkoutPlans">Se planen</button>`;
            GeditplanworkoutPlans.innerHTML = `<button disabled id="editplanworkoutPlans">Rediger</button>`;
        }

        showSaveBtn = true;

    } else {
        const hiddeDOMs = ["Gtitle2workoutPlans", "Gline2workoutPlans", "GlistworkoutPlans"];
        for (let i = 0; i < hiddeDOMs.length; i++) {
            document.getElementById(hiddeDOMs[i]).classList = "hidden";
        }
    }

    if (Object.keys(subscribedTrainingsplits).length > 0) {
        const subscribedTrainingsplitsKeys = Object.keys(subscribedTrainingsplits);
        let listworkoutSubscribedPlansOptionsHTML = "<option value='null'>Velg fra listen</option>";
        for (let w = 0; w < subscribedTrainingsplitsKeys.length; w++) {
            const name = subscribedTrainingsplits[subscribedTrainingsplitsKeys[w]];
            let selected = "";
            if (activetrainingsplit) {
                if (activetrainingsplit.trainingsplit_id) {
                    if (activetrainingsplit.trainingsplit_id === parseInt(subscribedTrainingsplitsKeys[w])) {
                        selected = "selected";
                    }
                }
            }
            listworkoutSubscribedPlansOptionsHTML += `<option ${selected} value="${subscribedTrainingsplitsKeys[w]}">${name}</option>`;
        }

        document.getElementById("listsubworkoutPlans").innerHTML = listworkoutSubscribedPlansOptionsHTML;

        const GviewsubplanworkoutPlans = document.getElementById("GviewsubplanworkoutPlans");

        if (navigator.onLine) {
            GviewsubplanworkoutPlans.innerHTML = `<button class="pointer" id="viewsubplanworkoutPlans" onClick="viewTrainingsplitSubList();">Se planen</button>`;
        } else {
            GviewsubplanworkoutPlans.innerHTML = `<button disabled id="viewsubplanworkoutPlans">Se</button>`;
        }

        showSaveBtn = true;

    } else {
        const hiddeDOMs = ["Gtitle3workoutPlans", "Gline3workoutPlans", "GlistsubworkoutPlans"];
        for (let i = 0; i < hiddeDOMs.length; i++) {
            document.getElementById(hiddeDOMs[i]).classList = "hidden";
        }
    }

    if (showSaveBtn === true) {
        const GsaveworkoutPlans = document.getElementById("GsaveworkoutPlans");

        if (navigator.onLine) {
            GsaveworkoutPlans.innerHTML = `<button id="saveworkoutPlans" class="pointer" onClick="setActiveTrainingsplit();">Lagre</button>`;
        } else {
            GsaveworkoutPlans.innerHTML = `<button id="saveworkoutPlans" disabled>Lagre</button>`;
        }
    }

    if (trainingsplitsLeftInfo > 0) {
        if (trainingsplitsLeftInfo === 1) {
            respMsg.textContent = `Du kan lage 1 treningsplan til`;
        } else {
            respMsg.textContent = `Du kan lage ${trainingsplitsLeftInfo} treningsplaner til`;
        }

        const GcreateplanworkoutPlans = document.getElementById("GcreateplanworkoutPlans");

        if (navigator.onLine) {
            GcreateplanworkoutPlans.innerHTML = `<button class="pointer" onClick="createNewTrainingsplit();" id="editplanworkoutPlans">Opprett ny</button>`;
        } else {
            GcreateplanworkoutPlans.innerHTML = `<button disabled id="editplanworkoutPlans">Opprett ny</button>`;
        }
    }

    document.getElementById("editworkoutPlanOverlay").style.display = "block";

}

// end of enableOverlayEditDays


// createNewTrainingsplit

async function createNewTrainingsplit() {

    const respMsg = document.getElementById("respworkoutPlans");
    respMsg.textContent = "";

    if (navigator.onLine) {

        respMsg.textContent = "Opretter ny treningsplan...";
        const infoHeader = {};
        const url = `/user/create/trainingsplit`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp) {
            respMsg.textContent = "Oprettet ny treningsplan!";
            setTimeout(() => {
                redirectToTrainingsplit(resp, "monday", true);
            }, 500);
        } else {
            respMsg.textContent = "Det har oppstått en feil!";
        }

    } else {
        respMsg.textContent = "Du må ha Internett-tilkobling for å opprette ny treningsplan";
    }
}

// end of createNewTrainingsplit

// setActiveTrainingsplit

async function setActiveTrainingsplit() {

    const respMsg = document.getElementById("respworkoutPlans");
    const saveworkoutPlansBtn = document.getElementById("saveworkoutPlans");

    if (navigator.onLine) {

        let trainingsplit_id = null;
        const trainingsplit_idOwnerList = document.getElementById("listworkoutPlans");

        if (trainingsplit_idOwnerList && trainingsplit_idOwnerList.value !== "null" && trainingsplit_idOwnerList.value !== "") {
            if (!activetrainingsplit || activetrainingsplit.trainingsplit_id !== parseInt(trainingsplit_idOwnerList.value)) {
                trainingsplit_id = trainingsplit_idOwnerList.value;
            }
        }

        const trainingsplit_idSubList = document.getElementById("listsubworkoutPlans");

        if (trainingsplit_idSubList && trainingsplit_idSubList.value !== "null" && trainingsplit_idSubList.value !== "") {
            if (!activetrainingsplit || activetrainingsplit.trainingsplit_id !== parseInt(trainingsplit_idSubList.value)) {
                trainingsplit_id = trainingsplit_idSubList.value;
            }
        }

        if (trainingsplit_id) {

            saveworkoutPlansBtn.innerHTML = "Lagrer...";

            const infoHeader = { "trainingsplit_id": trainingsplit_id };
            const url = `/user/setactive/trainingsplit`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {
                saveworkoutPlansBtn.innerHTML = "Lagret!";
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                saveworkoutPlansBtn.innerHTML = "Lagre";
                respMsg.textContent = "Kunne ikke sette treningsplanen som aktiv!";
            }
        } else {
            respMsg.textContent = "Vennligst velg en treningsplan du ønsker å ha som aktiv!";
        }

    } else {
        respMsg.textContent = "Du må ha Internett-tilkobling for å sette en treningsplan som aktiv";
    }
}

// end of setActiveTrainingsplit


// setNoneActiveTrainingsplit

async function setNoneActiveTrainingsplit() {

    const respMsg = document.getElementById("respworkoutPlans");
    respMsg.textContent = "";

    if (navigator.onLine) {

        respMsg.textContent = "Fjerner treningsplanen som aktiv...";

        const infoHeader = {};
        const url = `/user/setnotactive/trainingsplit`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp === true) {
            respMsg.textContent = "Treningsplanen er ikke lenger aktiv!";
            setTimeout(() => {
                location.reload();
            }, 500);
        } else {
            respMsg.textContent = "Kunne ikke fjerne en treningsplan som er aktiv!";
        }

    } else {
        respMsg.textContent = "Du må ha Internett-tilkobling for å fjerne en treningsplan som er aktiv";
    }
}

// end of setNoneActiveTrainingsplit

// deleteTrainingsplitConfirm

async function deleteTrainingsplitConfirm(aTrainingsplit_id) {

    /*const confirmDelete = confirm("Er du sikker på at du ønsker å slette treningsplanen? Dette kan ikke angres!");
 
    if (confirmDelete === true) {
 
        const trainingsplit_id = aTrainingsplit_id;
 
        const infoHeader = { "trainingsplit_id": trainingsplit_id };
        const url = `/user/delete/trainingsplit`;
 
        const resp = await callServerAPIPost(infoHeader, url);
 
        if (resp === true) {
            sessionStorage.removeItem("trainingsplit");
            window.location.search = "";
        } else {
            //alert("Kunne ikke slette treningsplanen. Det har oppstått en feil!");
            showAlert("Kunne ikke slette treningsplanen. Det har oppstått en feil!");
        }
    }*/

    showConfirm("Er du sikker på at du ønsker å slette treningsplanen? Dette kan ikke angres!", `deleteTrainingsplit(${aTrainingsplit_id});`);
}

// end of deleteTrainingsplitConfirm

async function deleteTrainingsplit(aTrainingsplit_id) {

    const trainingsplit_id = aTrainingsplit_id;

    const infoHeader = { "trainingsplit_id": trainingsplit_id };
    const url = `/user/delete/trainingsplit`;

    const resp = await callServerAPIPost(infoHeader, url);

    if (resp === true) {
        sessionStorage.removeItem("trainingsplit");
        window.location.search = "";
    } else {
        //alert("Kunne ikke slette treningsplanen. Det har oppstått en feil!");
        showAlert("Kunne ikke slette treningsplanen. Det har oppstått en feil!");
    }
}

// end of deleteTrainingsplit


// editTrainingsplit

async function editTrainingsplit() {

    const respMsg = document.getElementById("respworkoutPlans");

    if (navigator.onLine) {

        const trainingsplit_id = document.getElementById("listworkoutPlans").value;
        if (trainingsplit_id) {
            if (trainingsplit_id !== "" && trainingsplit_id !== "null") {
                const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                const dayNum = new Date().getDay();
                const day = days[dayNum];

                redirectToTrainingsplit(trainingsplit_id, day, true);
            } else {
                respMsg.textContent = `Vennligst velg en treningsplan fra "Dine planer" listen!`;
            }
        } else {
            respMsg.textContent = "Ugyldig trainingsplit_id!";
        }

    } else {
        respMsg.textContent = "Du må ha Internett-tilkobling for å kunne redigere en treningsplan";
    }
}

// end of editTrainingsplit

// saveTrainingsplit

let isSavingTrainingsplit = false;
async function saveTrainingsplit(aReload) {

    if (isSavingTrainingsplit === false) {

        if (navigator.onLine) {

            if (trainingsplit) {

                let reload = true;

                if (aReload === false) {
                    reload = false;
                }

                isSavingTrainingsplit = true;

                const saveTrainingsplitBtn = document.getElementById("saveTrainingsplitBtn");
                saveTrainingsplitBtn.innerHTML = "Lagrer...";

                const list = [];
                const trainingsplit_name = document.getElementById("trainingsplitNameInp").value;

                const keys = Object.keys(exerciseListCount);

                const eList = [];

                if (keys.length > 0) {

                    for (let i = 0; i < keys.length; i++) {

                        const key = Object.keys(exerciseListCount[i]);
                        const count = exerciseListCount[i][key];

                        const cacheList = [];

                        let exerciseName = key[0];
                        exerciseName = exerciseName.trimLeft().trimRight();

                        if (count > 0) {

                            const exercise = key[0].toLowerCase();

                            const keywords = [
                                "skulderpress", "skulder", "skuldre", "overhead", "raise",
                                "benkpress", "skråbenk", "benk", "flies", "pushup",
                                "markløft", "pullup", "roing", "row", "hyperextension",
                                "bicep", "curl", "hammer",
                                "tricep", "pushdown", "dip", "crusher",
                                "situp", "plank", "crunch", "abs", "roll",
                                "knebøy", "leg", "hamstring", "lunge", "utfall"
                            ];

                            // shortList and keywords (/user/save/trainingsplit in server.js ~ line 1163) should be equal

                            const exerciseArr = exercise.split(" ");
                            const txt = exerciseArr.toString().toLowerCase();

                            for (let z = 0; z < keywords.length; z++) {
                                const keyword = keywords[z];
                                if (txt.includes(keyword)) {
                                    eList.push({ "count": count, "exercise": exercise });
                                    break;
                                }
                            }

                            for (let j = 0; j < count; j++) {
                                const d = ["reps", "sets", "number", "value"];
                                const enu = { "reps": "0", "sets": 0, "number": 0, "value": 0 };

                                for (let k = 0; k < d.length; k++) {
                                    const dom = document.getElementById(`${key[0]}-${j}-${d[k]}`);
                                    if (dom) {
                                        let n = dom.value;
                                        if (d[k] !== "reps") {
                                            n = parseFloat(n);
                                        }

                                        if (!isNaN(n) || d[k] === "reps") {
                                            if (d[k] === "sets") {
                                                const lowest = 0;
                                                const higest = 99;
                                                if (n < lowest || n > higest) {
                                                    if (n < lowest) {
                                                        n = lowest;
                                                    } else if (n > higest) {
                                                        n = higest;
                                                    }
                                                }
                                            } else if (d[k] === "reps") {
                                                if (n.length > 15) {
                                                    n = "0";
                                                }
                                            }
                                            enu[d[k]] = n;
                                        }
                                    }
                                }

                                // keys = enu.value
                                // make number not able to go below [0] or higher than [1]
                                // index 0 = lowest, index 1 = highest
                                const validNumbers = {
                                    0: [0, 0], // nothing
                                    1: [0, 500], // kg
                                    2: [0, 100], // percent
                                    3: [0, 10], // RPE
                                }

                                const validNumbersKeys = Object.keys(validNumbers);
                                for (let x = 0; x < validNumbersKeys.length; x++) {

                                    const current = validNumbers[validNumbersKeys[x]];
                                    const lowest = current[0];
                                    const highest = current[1];
                                    const value = parseInt([validNumbersKeys[x]]);

                                    if (enu.value === value) {
                                        const num = enu.number;
                                        if (num < lowest || num > highest) {
                                            if (num < lowest) {
                                                enu.number = lowest;
                                            } else if (num > highest) {
                                                enu.number = highest;
                                            }
                                        }
                                        break;
                                    }
                                }

                                cacheList.push(enu);
                            }
                        }

                        const newExerciseName = document.getElementById(`${key[0]}-trainingsplit_name`);

                        if (newExerciseName) {
                            if (newExerciseName.value !== exerciseName) {
                                exerciseName = newExerciseName.value.trimLeft().trimRight();
                            }
                        }

                        const listKeys = Object.keys(list);
                        if (exerciseName.length > 0 && exerciseName.length <= 30) {
                            for (let c = 0; c < listKeys.length; c++) {

                                const name = Object.keys(list[listKeys[c]])[0];

                                if (name.toLowerCase().trimLeft().trimRight() === exerciseName.toLowerCase()) {
                                    const checkSplit = exerciseName.split("#");
                                    if (checkSplit.length > 1) {
                                        exerciseName = `${checkSplit[0].trimLeft().trimRight()} #${c + 1}`;
                                    } else {
                                        exerciseName = `${exerciseName.trimLeft().trimRight()} #${c + 1}`;
                                    }
                                }
                            }

                        } else {
                            exerciseName = `Øvelse nr ${i + 1}`;
                        }

                        list.push({ [exerciseName]: cacheList });
                    }
                }

                eList.sort(function (a, b) {
                    return b.count - a.count;
                });

                const mostCountExercises = [];

                if (eList.length >= 2) {
                    mostCountExercises.push(eList[0].exercise);
                    mostCountExercises.push(eList[1].exercise);
                } else if (eList.length >= 1) {
                    mostCountExercises.push(eList[0].exercise);
                }

                const infoHeader = { "trainingsplit_id": trainingsplit.id, "day": trainingsplit.day, "list": list, "trainingsplit_name": trainingsplit_name, "mostCountExercises": mostCountExercises };
                const url = `/user/save/trainingsplit`;

                const resp = await callServerAPIPost(infoHeader, url);

                if (resp === "saved") {
                    saveTrainingsplitBtn.innerHTML = "Lagret!";
                    setTimeout(() => {
                        if (reload !== false) {
                            location.reload();
                        }
                        saveTrainingsplitBtn.innerHTML = "Lagre";
                        isSavingTrainingsplit = false;
                    }, 1000);
                } else {
                    //alert("Kunne ikke lagre treningsplanen!");
                    showAlert("Kunne ikke lagre treningsplanen!");
                }
            } else {
                //alert("Kunne ikke lagre treningsplanen!");
                showAlert("Kunne ikke lagre treningsplanen!");
            }

        } else {
            //alert("Du må ha Internett-tilkobling for å kunne lagre treningsplanen!");
            showAlert("Du må ha Internett-tilkobling for å kunne lagre treningsplanen!");
        }
    }
}

// end of saveTrainingsplit

function changeOverlayBorderColor() {

    const inpVal = document.getElementById("inp4E");

    if (inpVal) {

        const editLiftorGoal = document.getElementById("editLiftorGoal");

        if (badgeColorsJSON[inpVal.value]) {
            editLiftorGoal.style.border = `1px solid #${badgeColorsJSON[inpVal.value].border}`;
        } else {
            editLiftorGoal.style.border = "";
        }
    }
}