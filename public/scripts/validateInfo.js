// usage: " validate("Kjetil Kristiansen", "kjetkr01", "123", "123"); "
function validate(displayname, username, password, confirmpassword) {

    const minCharLength = 3;
    const maxCharLength = 20;
    let checkTries = 0;
    let listOfBlacklistedChars = "";

    const blacklistedChars = ["|", "§", "!", "#", "¤", "%", "&", "/", "(", ")", " ", "=", "?", "+", "`", "<", ">", "^", "¨", "'", "*", ";", ":"];

    let message = "";
    let errorMsg = `må være lengre enn ${minCharLength} tegn og kortere enn ${maxCharLength} tegn`;

    if (password === confirmpassword) {

        if (displayname.length > minCharLength && displayname.length < maxCharLength) {

            if (username.length > minCharLength && username.length < maxCharLength) {

                for (let i = 0; i < blacklistedChars.length; i++) {

                    if (username.includes(blacklistedChars[i])) {

                        listOfBlacklistedChars += blacklistedChars[i];

                        checkTries++;

                    } else {

                    }
                }

                if (checkTries === 0) {


                    let splitDisplayName = displayname.split(" ");
                    let fixedDisplayname = "";

                    for (let i = 0; i < splitDisplayName.length; i++) {

                        function upperCaseFirstLetter(string) {
                            return string.charAt(0).toUpperCase() + string.slice(1);
                        }

                        function lowerCaseAllWordsExceptFirstLetters(string) {
                            return string.replace(/\S*/g, function (word) {
                                return word.charAt(0) + word.slice(1).toLowerCase();
                            });
                        }

                        fixedDisplayname += upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(splitDisplayName[i])) + " ";

                    }

                    fixedDisplayname = fixedDisplayname.trimRight();

                    //console.log(fixedDisplayname)

                    //callServerAPI?
                    message = "godkjent";
                } else {
                    message = `Brukernavnet kan ikke inneholde mellomrom eller følgende tegn: ${listOfBlacklistedChars}`;
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