// display settings

function displaySettings() {

    if (settings) {

        listTitle.innerHTML = "Innstillinger<hr>";

        const keys = Object.keys(settings);
        list.innerHTML = "";

        if (keys.length > 0) {
            list.innerHTML = "<tr>";
            for (let i = 0; i < keys.length; i++) {
                if (settings[keys[i]].value === true) {
                    list.innerHTML += `<td>
                                  ${settings[keys[i]].name}
                                  </td>
                                  <td>
                                  <input type="checkbox" id="${keys[i]}Box" checked onClick="updateSetting('${keys[i]}', false)">
                                  </td>`;
                }
                else if (settings[keys[i]].value === false) {
                    list.innerHTML += `<td>
                                  ${settings[keys[i]].name}
                                  </td>
                                  <td>
                                  <input type="checkbox" id="${keys[i]}Box" onClick="updateSetting('${keys[i]}', true)">
                                  </td>`;
                }
                else if (settings[keys[i]].value === "auto" || settings[keys[i]].value === "light" || settings[keys[i]].value === "dark") {

                    switch (settings[keys[i]].value) {
                        case "auto":
                            list.innerHTML += `
                      <td>
                      <label>${settings[keys[i]].name}</label>
                      </td>
                      <td>
                      <select id="preferredColorThemeDom" onChange="checkPreferredColorTheme();">
                      <option value="auto" selected>Automatisk</option>
                      <option value="light">Lys</option>
                      <option value="dark">Mørk</option>
                      </select>
                      </td>`;
                            break;
                        case "light":
                            list.innerHTML += `
                      <td>
                      <label>${settings[keys[i]].name}</label>
                      </td>
                      <td>
                      <select id="preferredColorThemeDom" onChange="checkPreferredColorTheme();">
                      <option value="auto">Automatisk</option>
                      <option value="light" selected>Lys</option>
                      <option value="dark">Mørk</option>
                      </select>
                      </td>`;
                            break;
                        case "dark":
                            list.innerHTML += `
                      <td>
                      <label>${settings[keys[i]].name}</label>
                      </td>
                      <td>
                      <select id="preferredColorThemeDom" onChange="checkPreferredColorTheme();">
                      <option value="auto">Automatisk</option>
                      <option value="light">Lys</option>
                      <option value="dark" selected>Mørk</option>
                      </select>
                      </td>`;
                            break;

                    }

                }
            }

            list.innerHTML += "<tr>";
        }
    }
}

function checkPreferredColorTheme() {
    const preferredColorThemeDom = document.getElementById("preferredColorThemeDom");

    if (preferredColorThemeDom.value !== settings.preferredColorTheme.value) {
        if (preferredColorThemeDom.value === "auto" || preferredColorThemeDom.value === "light" || preferredColorThemeDom.value === "dark") {

            updateSetting("preferredColorTheme", preferredColorThemeDom.value);
        }

    }

}

async function updateSetting(setting, value) {

    if (!setting || value !== true && value !== false && value !== "auto" && value !== "light" && value !== "dark") {
        return;
    } else {

        if (token && user) {

            const infoMsgDom = document.getElementById("showTotalLift")

            infoMsgDom.innerHTML = "Lagrer endringer...";

            const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
            const url = `/user/update/settings/${setting}`;

            const resp = await callServerAPI(body, url);

            console.log(resp)

            if (resp === "updated setting") {

                infoMsgDom.innerHTML = "Lagret!";

                getUserDetails();

            } else {
                infoMsgDom.innerHTML = `En feil har oppstått, innstillingen "${setting}" kunne ikke oppdatert.`;
                setTimeout(function () {
                    infoMsgDom.innerHTML = "";
                }, 3000);
            }
        }
    }
}

 // end of settings