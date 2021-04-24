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
            <input id="inp2C" class="inputLiftOrGoal" type="text"
               onkeypress="return onlyAllowedKeys(event,'create','kg')" placeholder="Eks: 35.25"></input>
         </div>
         <div id="Gtitle4C">
            <p id="title4C">Reps</p>
         </div>
         <div id="Gline4C">
            <hr id="line4C">
         </div>
         <div id="Ginp3C">
            <input id="inp3C" class="inputLiftOrGoal" type="text"
               onkeypress="return onlyAllowedKeys(event,'create','reps')" placeholder="Eks: 4"></input>
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
            <input id="inp1E" class="inputLiftOrGoal" type="text"
               onkeypress="return onlyAllowedKeys(event,'edit', 'kg')" placeholder="Eks: 35.25"></input>
         </div>
         <div id="Gtitle3E">
            <p id="title3E">Reps</p>
         </div>
         <div id="Gline3E">
            <hr id="line3E">
         </div>
         <div id="Ginp2E">
            <input id="inp2E" class="inputLiftOrGoal" type="text"
               onkeypress="return onlyAllowedKeys(event,'edit', 'reps')" placeholder="Eks: 4"></input>
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