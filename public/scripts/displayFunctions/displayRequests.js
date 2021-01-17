async function displayRequests() {

    if (token && user) {

        listTitle.innerHTML = loadingText;

        const body = { "authToken": token, "userInfo": user };
        const url = `/users/list/pending`;

        const resp = await callServerAPI(body, url);

        if (resp) {

            if (resp[0].username) {

                listTitle.innerHTML = "Forespørsler:<hr>";

                list.innerHTML.innerHTML = "<tr>";

                for (let i = 0; i < resp.length; i++) {
                    list.innerHTML += `
                <td>
                Navn:
                <br>
                ${resp[i].displayname}
                </td>
                <td>
                Brukernavn:
                <br>
                ${resp[i].username}
                </td>
                <td>
                <button class="listButton" onClick='acceptPendingUser("${resp[i].username}", true)'>Godta</button>
                <button class="listButton" onClick='acceptPendingUser("${resp[i].username}", false)'>Avslå</button>
                </td>
                `;
                }

                list.innerHTML += "</tr>";
                /*
                if (resp.length === 1) {
                   list.innerHTML += "Det er " + resp.length + " forespørsel (bruker)!";
                } else {
                   list.innerHTML += "Det er totalt " + resp.length + " forespørseler (brukere)!";
                }
                */

            } else {
                listTitle.innerHTML = errorLoadingText;
            }

        } else {
            listTitle.innerHTML = "Det er ingen forespørseler!";
        }

    }

}

// acceptOrDeny users

async function acceptPendingUser(username, acceptOrDeny) {
    if (!username || acceptOrDeny === "") {
        return;
    }

    let statusMsg = "godta";
    let statusMsg2 = "Du har nå godtatt forespørselen til: ";

    if (!acceptOrDeny) {
        statusMsg = "avslå";
        statusMsg2 = "Du har nå avslått forespørselen til: ";
    }

    const confirmPress = confirm("Er du sikker på at du vil " + statusMsg + " " + username + " sin forespørsel?");
    if (confirmPress === true) {

        const body = { "authToken": token, "userInfo": user, "pendingUser": username, "acceptOrDeny": acceptOrDeny };
        const url = `/users/pending/${username}/${acceptOrDeny}`;

        const results = await callServerAPI(body, url);

        if (results === "Ok") {
            alert(statusMsg2 + username);
        } else {
            alert("Feil, brukeren finnes ikke!");
        }

        //displayRequests();
        changelistContent("requests");
    }
}