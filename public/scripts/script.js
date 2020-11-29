async function callServerAPI(body, url) {

    if(offlineMode){
        console.log("Offline mode is enabled, server fetching is disabled!");
        return;
    }

    if (!body || !url) {
        return;
    }

    const config = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(url, config);
    const data = await response.json();
    console.log(response.status);
    return { "response": response, "data": data };

}

function loadPage(page) {

    if(offlineMode){
        console.log("Offline mode is enabled, ajax fetching is disabled!");
        return;
    }

    const pages = ["index", "login", "access"];
    let redirect = false;

    for (let i = 0; i < pages.length; i++) {

        if (page === pages[i]) {
            console.log("exists");
            redirect = true;
        }

    }

    if (redirect) {

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.documentElement.innerHTML =
                    this.responseText;
            }
        };
        xhttp.open("GET", `${page}.html`, true);
        xhttp.send();

    }else{
        console.log("Page does not exist!");
    }
}