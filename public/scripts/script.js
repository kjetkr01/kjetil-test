function test(displayName) {

    let firstLetter = displayName[0];
    displayName = displayName.split(" ");
    let firstName = displayName[0];

    return { "firstLetter": firstLetter, "firstName": firstName };
}