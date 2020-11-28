function validate(displayname, username, password, confirmpassword) {

    const minCharLength = 3;
    const maxCharLength = 20;

    let blacklistedChars = ["|","§","!","#","¤","%","&","/","("];

    let message = "";
    let errorMsg = `må være lengre enn ${minCharLength} tegn og kortere enn ${maxCharLength} tegn`;

    if (password === confirmpassword) {

        if (displayname.length > minCharLength && displayname.length < maxCharLength) {

            if (username.length > minCharLength && username.length < maxCharLength) {

                for (let i = 0; i < blacklistedChars.length; i++) {
                    if (username.indexOf(blacklistedChars[i]) <= 0) {

                        //callServerAPI?
                        message = "godkjent";

                    } else {
                        message = `Brukernavnet kan ikke inneholde mellomrom eller følgende tegn: ${blacklistedChars[i]}`;
                    }
                }

            } else {
                message = `Brukernavnet ${errorMsg}`;
            }

        } else {
            message = `Visningsnavnet ${errorMsg}`;
        }

    } else {
        message = "Passordene stemmer ikke.";
    }

    return message;

}