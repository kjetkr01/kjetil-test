async function callServerAPI(body, url) {

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