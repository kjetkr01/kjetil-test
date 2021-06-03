// createNewLiftorGoalOverlay
function getCreateNewLiftorGoalOverlay() {

   if (document.getElementById("createNewLiftorGoal") === null) {


      const html = `
        
        <div id="createNewLiftorGoal" class="createNewLiftorGoal">
         <div id="Gtitle1C">
            <p id="title1C"></p>
         </div>
         <div id="Gline1C">
            <hr id="line1C">
         </div>
         <div id="Gtitle2C">
            <p id="title2C">Øvelse</p>
         </div>
         <div id="Gline2C">
            <hr id="line2C">
         </div>
         <div id="Ginp1C">
            <select id="inp1C" class="selectLiftOrGoal">
            </select>
         </div>
         <div id="Gtitle3C">
            <p id="title3C">Antall KG</p>
         </div>
         <div id="Gline3C">
            <hr id="line3C">
         </div>
         <div id="Ginp2C">
            <input id="inp2C" class="inputLiftOrGoal" type="text" maxlength="6"
               onkeypress="return onlyAllowedKeys(event,'kg')" placeholder="Eks: 51.25"></input>
         </div>
         <div id="Gtitle4C">
            <p id="title4C">Reps</p>
         </div>
         <div id="Gline4C">
            <hr id="line4C">
         </div>
         <div id="Ginp3C">
            <input id="inp3C" class="inputLiftOrGoal" type="text" maxlength="3"
               onkeypress="return onlyAllowedKeys(event,'reps')" placeholder="Eks: 3"></input>
         </div>
         <div id="Gtitle5C">
            <p id="title5C">Dato</p>
         </div>
         <div id="Gline5C">
            <hr id="line5C">
         </div>
         <div id="Ginp4C">
            <input id="inp4C" class="inputLiftOrGoal" type="date"></input>
         </div>
         <div id="GrespC">
            <p id="respC"></p>
         </div>
         <div id="GcancelC">
            <button id="cancelC" class="pointer" onclick="disableOverlays();">Avbryt</button>
         </div>
         <div id="GsaveC">
         </div>
      </div>

        `;

      document.getElementById("createNewLiftorGoalOverlay").innerHTML = html;


   }

}



// editLiftorGoalOverlay
function getEditLiftorGoalOverlay() {

   if (document.getElementById("editLiftorGoal") === null) {


      const html = `
        
        <div id="editLiftorGoal" class="editLiftorGoal">
         <div id="Gtitle1E">
            <p id="title1E"></p>
         </div>
         <div id="Gline1E">
            <hr id="line1E">
         </div>
         <div id="Gtitle2E">
            <p id="title2E">Antall KG</p>
         </div>
         <div id="Gline2E">
            <hr id="line2E">
         </div>
         <div id="Ginp1E">
            <input id="inp1E" class="inputLiftOrGoal" type="text" maxlength="6"
               onkeypress="return onlyAllowedKeys(event, 'kg')" placeholder="Eks: 51.25"></input>
         </div>
         <div id="Gtitle3E">
            <p id="title3E">Reps</p>
         </div>
         <div id="Gline3E">
            <hr id="line3E">
         </div>
         <div id="Ginp2E">
            <input id="inp2E" class="inputLiftOrGoal" type="text" maxlength="3"
               onkeypress="return onlyAllowedKeys(event, 'reps')" placeholder="Eks: 3"></input>
         </div>
         <div id="Gtitle4E">
            <p id="title4E">Dato</p>
         </div>
         <div id="Gline4E">
            <hr id="line4E">
         </div>
         <div id="Ginp3E">
            <input id="inp3E" class="inputLiftOrGoal" type="date"></input>
         </div>
         <div id="Gtitle5E">
            <p id="title5E">Farge</p>
         </div>
         <div id="Gline5E">
            <hr id="line5E">
         </div>
         <div id="Ginp4E">
            <select id="inp4E" onchange="changeOverlayBorderColor();" class="selectLiftOrGoal"></select>
         </div>
         <div id="GdeleteE">
         </div>
         <div id="GrespE">
            <p id="respE"></p>
         </div>
         <div id="GcancelE">
            <button id="cancelE" class="pointer" onclick="disableOverlays();">Lukk</button>
         </div>
         <div id="GsaveE">
         </div>
      </div>

        `;

      document.getElementById("editLiftorGoalOverlay").innerHTML = html;


   }
}


// editworkoutPlanOverlay
function geteditworkoutPlanOverlay() {

   if (document.getElementById("workoutPlans") === null) {


      const html = `
        
      <div id="workoutPlans" class="workoutPlans">
      <div id="Gtitle1workoutPlans">
         <p id="title1workoutPlans">Treningsplan</p>
      </div>
      <div id="Gline1workoutPlans">
         <hr id="line1workoutPlans">
      </div>
      <div id="Gtitle2workoutPlans">
         <p id="title2workoutPlans">Dine planer</p>
      </div>
      <div id="Gline2workoutPlans">
         <hr id="line2workoutPlans">
      </div>
      <div id="GlistworkoutPlans">
         <select id="listworkoutPlans">
         </select>
      </div>
      <div id="GviewplanworkoutPlans">
      </div>
      <div id="GeditplanworkoutPlans">
      </div>
      <div id="GcreateplanworkoutPlans">
      </div>

      <div id="Gtitle3workoutPlans">
         <p id="title3workoutPlans">Abonnerte planer</p>
      </div>
      <div id="Gline3workoutPlans">
         <hr id="line3workoutPlans">
      </div>
      <div id="GlistsubworkoutPlans">
         <select id="listsubworkoutPlans">
         </select>
      </div>
      <div id="GviewsubplanworkoutPlans">
      </div>


      <div id="Gtitle4workoutPlans">
         <p id="title4workoutPlans">Aktiv plan</p>
      </div>
      <div id="Gline4workoutPlans">
         <hr id="line4workoutPlans">
      </div>
      <div id="GtextworkoutPlans">
         <p id="textworkoutPlans">
         </p>
      </div>
      <div id="GsetNoneActivePlanworkoutPlans">
      </div>
      <div id="GrespworkoutPlans">
         <p id="respworkoutPlans"></p>
      </div>
      <div id="GcancelworkoutPlans">
         <button id="cancelworkoutPlans" class="pointer" onclick="disableOverlays();">Avbryt</button>
      </div>
      <div id="GsaveworkoutPlans">
      </div>
   </div>

        `;

      document.getElementById("editworkoutPlanOverlay").innerHTML = html;


   }
}

// viewLiftorGoalOverlay
function getViewLiftorGoalOverlay() {

   if (document.getElementById("viewLiftorGoal") === null) {


      const html = `
       
       <div id="viewLiftorGoal" class="viewLiftorGoal">
        <div id="Gtitle1W">
           <p id="title1W"></p>
        </div>
        <div id="Gline1W">
           <hr id="line1W">
        </div>
        <div id="Gtitle2W">
           <p id="title2W">Antall KG</p>
        </div>
        <div id="Gline2W">
           <hr id="line2W">
        </div>
        <div id="Ginp1W">
           <p id="inp1W" class="inputLiftOrGoal"></p>
        </div>
        <div id="Gtitle3W">
           <p id="title3W">Reps</p>
        </div>
        <div id="Gline3W">
           <hr id="line3W">
        </div>
        <div id="Ginp2W">
           <p id="inp2W" class="inputLiftOrGoal"></p>
        </div>
        <div id="Gtitle4W">
           <p id="title4W">Dato</p>
        </div>
        <div id="Gline4W">
           <hr id="line4W">
        </div>
        <div id="Ginp3W">
           <p id="inp3W" class="inputLiftOrGoal"></p>
        </div>
        <div id="GcancelW">
           <button id="cancelW" class="pointer" onclick="disableOverlays();">Lukk</button>
        </div>
        <div id="GeditW">
        </div>
     </div>

       `;

      document.getElementById("viewLiftorGoalOverlay").innerHTML = html;


   }

}


// TSAlertOverlay
function getTSAlertOverlay() {

   if (document.getElementById("TSAlert") === null) {


      const html = `
       
         <div id="TSAlert" class="TSAlert noselect">
         <div id="GinformationTSAlert">
            <p id="informationTSAlert"></p>
         </div>
         <div id="GextraTSAlert">
            <p id="extraTSAlert"></p>
         </div>
      </div>

       `;

      document.getElementById("TSAlertOverlay").innerHTML = html;

   }
}

// TSConfirmOverlay
function getTSConfirmOverlay() {

   if (document.getElementById("TSConfirm") === null) {


      const html = `
       
      <div id="TSConfirm" class="TSConfirm noselect">
         <div id="GinformationTSConfirm">
            <p id="informationTSConfirm">Ønsker du å godta denne meldingen?</p>
         </div>
         <div id="GcancelBtnTSConfirm">
         </div>
         <div id="GacceptBtnTSConfirm">
         </div>
      </div>

       `;

      document.getElementById("TSConfirmOverlay").innerHTML = html;

   }
}

function showAlert(aInformation, aDisplayCloseBtn, aPerformWhenUserCloseOverlay) {
   const TSAlertOverlay = document.getElementById("TSAlertOverlay");
   const informationTSAlert = document.getElementById("informationTSAlert");
   const extraTSAlert = document.getElementById("extraTSAlert");

   if (TSAlertOverlay && informationTSAlert && extraTSAlert) {
      if (TSAlertOverlay.style.display === "none") {
         const information = aInformation;
         if (information) {
            const displayCloseBtn = aDisplayCloseBtn;
            const performWhenUserCloseOverlay = aPerformWhenUserCloseOverlay;

            TSAlertOverlay.style.display = "block";
            informationTSAlert.innerHTML = information;
            extraTSAlert.innerHTML = "";

            if (displayCloseBtn === true) {
               extraTSAlert.innerHTML = `<button onClick="disableOverlays();${performWhenUserCloseOverlay}" class="TSAlertBtn pointer">Ok</button>`;
            } else {
               // auto close alert.
               let secondsLeft = 4;
               extraTSAlert.innerHTML = `Lukkes om ${secondsLeft} sekunder`;
               let countDown = setInterval(() => {
                  secondsLeft--;
                  if (secondsLeft <= 0) {
                     clearInterval(countDown);

                     informationTSAlert.innerHTML = "";
                     extraTSAlert.innerHTML = "";
                     TSAlertOverlay.style.display = "none";
                  } else {
                     extraTSAlert.innerHTML = `Lukkes om ${secondsLeft} sekunder`;
                  }
               }, 1000);
            }
         }
      }
   }
}

function showConfirm(aInformation, aPerformWhenUserAccept, aPerformWhenUserDeny) {
   const TSConfirmOverlay = document.getElementById("TSConfirmOverlay");
   const informationTSConfirm = document.getElementById("informationTSConfirm");
   const GcancelBtnTSConfirm = document.getElementById("GcancelBtnTSConfirm");
   const GacceptBtnTSConfirm = document.getElementById("GacceptBtnTSConfirm");

   if (TSConfirmOverlay && informationTSConfirm && GacceptBtnTSConfirm) {
      if (TSConfirmOverlay.style.display === "none") {
         GcancelBtnTSConfirm.innerHTML = `<button id="cancelBtnTSConfirm" class="TSConfirmBtn pointer" onClick="disableOverlay('TSConfirmOverlay');">Avbryt</button>`;
         GacceptBtnTSConfirm.innerHTML = "";
         const information = aInformation;
         const performWhenUserAccept = aPerformWhenUserAccept;
         const performWhenUserDeny = aPerformWhenUserDeny;
         if (information && performWhenUserAccept) {
            TSConfirmOverlay.style.display = "block";
            informationTSConfirm.innerHTML = information;
            GacceptBtnTSConfirm.innerHTML = `<button id="acceptBtnTSConfirm" class="TSConfirmBtn pointer" onClick="disableOverlay('TSConfirmOverlay');${performWhenUserAccept}">Godta</button>`;
            GcancelBtnTSConfirm.innerHTML = `<button id="cancelBtnTSConfirm" class="TSConfirmBtn pointer" onClick="disableOverlay('TSConfirmOverlay');${performWhenUserDeny}">Avbryt</button>`;
         }
      }
   }
}

function disableOverlay(aOverlay) {
   const overlayDom = document.getElementById(aOverlay);
   if (overlayDom) {
      overlayDom.style.display = "none";
   }
}

function disableOverlays() {

   const overlayIDs = ["createNewLiftorGoalOverlay", "viewLiftorGoalOverlay", "editLiftorGoalOverlay", "editworkoutPlanOverlay", "TSAlertOverlay", "TSConfirmOverlay"];

   for (let i = 0; i < overlayIDs.length; i++) {
      const overlayDom = document.getElementById(overlayIDs[i]);
      if (overlayDom) {
         overlayDom.style.display = "none";
      }
   }
}