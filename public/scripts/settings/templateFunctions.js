function getTemplate(aSetting, aDivId, aInfo, aSpacingTop) {

   const setting = aSetting || "Innstillingen finnes ikke!";
   const divId = aDivId || "";
   const info = aInfo || "";
   const spacingTop = aSpacingTop || "";
   let borderT = "";

   if (spacingTop) {
      borderT = "borderT";
   }

   const html =
      `
 <div id="${divId}" class="userSettingsDefault noselect ${spacingTop}">
          <div id="cS1" class="${borderT}">
          </div>
          <div id="gsSetting">
             <p id="sSetting">
                ${setting}
             </p>
          </div>
          <div id="gsInfo">
             <p id="sInfo">
                ${info}
             </p>
          </div>
          <div id="cS4" class="borderB">
          </div>
       </div>
 `;
   return html;
}

function getTemplateWithBtn(aSetting, aDivId, aSpacingTop) {

   const setting = aSetting || "Innstillingen finnes ikke!";
   const divId = aDivId || "";
   const spacingTop = aSpacingTop || "";
   let borderT = "";

   if (spacingTop) {
      borderT = "borderT";
   }

   const html =
      `
       <div id="${divId}" class="userSettingsDefault noselect ${spacingTop}">
          <div id="cS1" class="${borderT}">
          </div>
          <div id="gsSetting">
             <p id="sSetting">
                ${setting}
             </p>
          </div>
          <div id="gsInfo">
             <svg id="sInfo" class="settingsIcons pointer" draggable="false" onclick="loadSetting('${setting}');"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.49 39.22">
                <g id="Layer_2" data-name="Layer 2">
                   <g id="Layer_1-2" data-name="Layer 1">
                      <polyline class="cls-1" points="1.24 1.24 20.02 20.02 2.04 37.99" />
                   </g>
                </g>
             </svg>
          </div>
          <div id="cS4" class="borderB">
          </div>
       </div>
`;
   return html;
}



function getTemplateWithCheckbox(aSetting, aDivId, aChecked, aOnClickInfo, aSpacingTop) {

   const setting = aSetting || "Innstillingen finnes ikke!";
   const divId = aDivId || "";
   const isChecked = aChecked || false;
   const onClickInfo = aOnClickInfo || "";
   const spacingTop = aSpacingTop || "";
   let borderT = "";
   let disabled = "";
   let lowerOpacityStyle = "";

   if (!navigator.onLine) {
      disabled = "disabled";
      lowerOpacityStyle = `style='opacity:60%;'`;
   }

   if (spacingTop) {
      borderT = "borderT";
   }

   let html =
      `
       <div id="${divId}" class="userSettingsDefault noselect ${spacingTop}">
          <div id="cS1" class="${borderT}">
          </div>
          <div id="gsSetting">
             <p id="sSetting">
                ${setting}
             </p>
          </div>
          <div id="gsInfo">
             <label id="sInfo" class="settingsCheckbox" ${lowerOpacityStyle}>
                <input class="inputCategory" ${disabled} onClick="updateCheckboxSetting('${onClickInfo}', true);" type="checkbox">
                <span class="slider round"></span>
             </label>
          </div>
          <div id="cS4" class="borderB">
          </div>
       </div>
`;

   if (isChecked === true) {
      html =
         `
       <div id="${divId}" class="userSettingsDefault noselect ${spacingTop}">
          <div id="cS1" class="${borderT}">
          </div>
          <div id="gsSetting">
             <p id="sSetting">
                ${setting}
             </p>
          </div>
          <div id="gsInfo">
             <label id="sInfo" class="settingsCheckbox" ${lowerOpacityStyle}>
                <input class="inputCategory" ${disabled} onClick="updateCheckboxSetting('${onClickInfo}', false);" type="checkbox" checked>
                <span class="slider round"></span>
             </label>
          </div>
          <div id="cS4" class="borderB">
          </div>
       </div>
`;
   }

   return html;
}

function getLogoutBtn() {

   const html =
      `
<div class="userSettingsDefault noselect spacingTop" style="margin-bottom:80px;">
    <div id="cS1" class="borderT">
    </div>
    <div id="gsSetting">
       <button id="sSetting" class="settingsButton pointer" style="color:red;" onClick="confirmLogout();">
          Logg ut
       </button>
    </div>
    <div id="gsInfo">
       <p id="sInfo">
          
       </p>
    </div>
    <div id="cS4" class="borderB">
    </div>
 </div>
`;
   return html;
}


function getPendingRequestsTemplate() {

   const html =
      `
       <div id="pendingRequestsDiv" class="userSettingsDefault noselect">
          <div id="cS1">
          </div>
          <div id="gsSetting">
             <p id="sSetting" name="pendingRequestsTxt">
                ${ELoadSettings.pendingUsers.name}
             </p>
          </div>
          <div id="gsInfo">
             <svg id="sInfo" class="settingsIcons pointer" draggable="false" onclick="loadSetting('${ELoadSettings.pendingUsers.name}');"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.49 39.22">
                <g id="Layer_2" data-name="Layer 2">
                   <g id="Layer_1-2" data-name="Layer 1">
                      <polyline class="cls-1" points="1.24 1.24 20.02 20.02 2.04 37.99" />
                   </g>
                </g>
             </svg>
          </div>
          <div id="cS4" class="borderB">
          </div>
       </div>
`;
   return html;
}

function getCenteredTextTemplate(aDetails, aDivId, aSpacingTop) {

   const details = aDetails || "Det har oppstått et problem";
   const divId = aDivId || "";
   const spacingTop = aSpacingTop || "";
   let borderT = "";

   if (spacingTop) {
      borderT = "borderT";
   }

   const html =
      `
<div id="${divId}" class="userSettingsCenteredItems noselect ${spacingTop}">
    <div id="cSC1" class="${borderT}">
    </div>
    <div id="gsCenteredItems">
       <p id="sCenteredItems">
          ${details}
       </p>
    </div>
    <div id="cSC2" class="borderB">
    </div>
 </div>
`;
   return html;
}

function getLeftTextTemplate(aDetails, aDivId, aSpacingTop) {

   const details = aDetails || "Det har oppstått et problem";
   const divId = aDivId || "";
   const spacingTop = aSpacingTop || "";
   let borderT = "";

   if (spacingTop) {
      borderT = "borderT";
   }

   const html =
      `
<div id="${divId}" class="userSettingsLeftItems noselect ${spacingTop}">
    <div id="cSLC1" class="${borderT}">
    </div>
    <div id="gsLeftItems">
       <p id="sLeftItems">
          ${details}
       </p>
    </div>
    <div id="cSLC2" class="borderB">
    </div>
 </div>
`;
   return html;
}

function justTextTemplate(aText, aTextAlign) {

   if (aTextAlign !== "left" && aTextAlign !== "center") {
      aTextAlign = "left";
   }

   const text = aText;
   const textAlign = aTextAlign;

   const html =
      `
<div class="userSettingsJustText noselect" style="text-align: ${textAlign};">
    <div id="cSJC1">
    </div>
    <div id="gsJustText">
       <p id="sJustText">
          ${text}
       </p>
    </div>
    <div id="cSJC2">
    </div>
 </div>
`;
   return html;
}

function getAPITextTemplate(aDetails, aDivId, aSpacingTop) {

   const details = aDetails || "Det har oppstått et problem";
   const divId = aDivId || "";
   const spacingTop = aSpacingTop || "";
   let borderT = "";

   if (spacingTop) {
      borderT = "borderT";
   }

   const html =
      `
    <div id="${divId}" class="userSettingsAPIList ${spacingTop}">
    <div id="cSCA1" class="${borderT}">
    </div>
    <div id="gsaCenteredItems">
       <p id="saCenteredItems">
          ${details}
       </p>
    </div>
    <div id="cSCA2" class="borderB">
    </div>
    </div>
    `;
   return html;
}



function getBottomSpacingTemplate() {

   const html =
      `
    <div class="userSettingsJustText noselect" style="margin-bottom:30px;">
    <div id="cSJC1">
    </div>
    <div id="gsJustText">
    <p id="sJustText">
    </p>
    </div>
    <div id="cSJC2">
    </div>
    </div>
    `;
   return html;
}