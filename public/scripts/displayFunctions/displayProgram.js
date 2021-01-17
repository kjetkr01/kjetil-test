function displayProgram() {

    if (Object.entries(program).length > 0) {

        let keys = Object.keys(program);
        list.innerHTML = "<tr>";

        if (keys.length > 0) {
            listTitle.innerHTML = "Treningsplan:<hr>"
            for (let i = 0; i < keys.length; i++) {

                let liftKeys = program[keys[i]];

                if (liftKeys !== "0" && liftKeys !== 0 && liftKeys !== "") {

                    let msg = `
                    <td>${keys[i]}:</td><td>${liftKeys}</td>
                    `;

                    list.innerHTML += msg;
                }
            }

        }

        list.innerHTML += "</tr>";
    }

}