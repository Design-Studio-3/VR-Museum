import * as database from './../database/data.js';

// HTML selectors
let lookingForImage = document.getElementById('searchingForBox');
let lookingForText = document.getElementById('itemName');
let lookingForHint = document.getElementById('hint');
let part1Box = document.getElementById('inventoryBox1');
let part2Box = document.getElementById('inventoryBox2');
let part3Box = document.getElementById('inventoryBox3');

let messageBoard = document.getElementById('messageBox');

// Update UI when a part of an exhibit is found or when an exhibit is completed
socket.on('updateUIExhibits', (data) => {
    // Create path to image and text
    let pathToImage;
    let pathToText;

    let allPartsFoundBool = data.allPartsFoundBool;
    // This exhibit's ID
    let currentExhibitItemId = data.currentExhibitItemId - 1;

    // Update the looking for image
    pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[3];
    lookingForImage.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';

    // Update name of prop
    pathToText = database.exhibitItems[currentExhibitItemId].name;
    lookingForText.innerHTML = pathToText;

    //Update hint of prop
    pathToText = database.exhibitItems[currentExhibitItemId].hint;
    lookingForHint.innerHTML = pathToText;

    // Display which parts have been found in the UI
    let partsFoundArray = [];
    let partsFound = data.partsFound;
    for (var i = 0 ; i <= partsFound.length ; i++) {
        let thisPartNumber = partsFound.slice(i, i+1);
        partsFoundArray[thisPartNumber] = thisPartNumber;
    }

    // Display exhibit part
    if (partsFoundArray[1] == 1) {
        pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[0];
        part1Box.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';
    }

    if (partsFoundArray[2] == 2) {
        pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[1];
        part2Box.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';
    }

    if (partsFoundArray[3] == 3) {
        pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[2];
        part3Box.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';
    }

    // Reset UI when all parts of an exhibit have been found
    if (allPartsFoundBool === 'True') {
        console.log('test');
        part1Box.innerHTML = '';
        part2Box.innerHTML = '';
        part3Box.innerHTML = '';
    }

});

// Update message board
socket.on('updateUIMessage', (data) => {
    let message = data.message;
    messageBoard.innerHTML = message;
});

// Handle noises
socket.on('makeANoise', (data) => {
    let noiseToPlay = data.sound;
    switch (noiseToPlay) {
        case 'wrong exhibit':
            var audio = new Audio('../../assets/audio/wrong.mp3');
            audio.play();
            break;
        case 'ding':
            var audio = new Audio('../../assets/audio/ding.wav');
            audio.play();
            break;
    }   
});
