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
            <button id="cancelC" class="pointer" onclick="disableOverlay('createLiftOrGoal');">Avbryt</button>
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
            <button id="cancelE" class="pointer" onclick="disableOverlay('editLiftOrGoal');">Avbryt</button>
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
         <button id="cancelworkoutPlans" class="pointer" onclick="disableOverlay('editDays');">Avbryt</button>
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
           <p id="inp1E" class="inputLiftOrGoal"></p>
        </div>
        <div id="Gtitle3E">
           <p id="title3E">Reps</p>
        </div>
        <div id="Gline3E">
           <hr id="line3E">
        </div>
        <div id="Ginp2E">
           <p id="inp2E" class="inputLiftOrGoal"></p>
        </div>
        <div id="Gtitle4E">
           <p id="title4E">Dato</p>
        </div>
        <div id="Gline4E">
           <hr id="line4E">
        </div>
        <div id="Ginp3E">
           <p id="inp3E" class="inputLiftOrGoal"></p>
        </div>
        <div id="GcancelE">
           <button id="cancelE" class="pointer" onclick="disableOverlay('viewLiftOrGoal');">Lukk</button>
        </div>
     </div>

       `;

      document.getElementById("viewLiftorGoalOverlay").innerHTML = html;


   }

}