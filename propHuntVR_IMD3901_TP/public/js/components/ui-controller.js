import * as database from './../database/data.js';
const socket = io({transports: ['websocket'], upgrade: false});

// HTML selectors
let lookingForImage = document.getElementById('searchingForBox');
let lookingForText = document.getElementById('itemName');
let lookingForHint = document.getElementById('hint');
let part1Box = document.getElementById('inventoryBox1');
let part2Box = document.getElementById('inventoryBox2');
let part3Box = document.getElementById('inventoryBox3');

let allPartsFound = [];

let messageBoard = document.getElementById('messageBox');

// Update UI when a part of an exhibit is found or when an exhibit is completed
socket.on('updateUIExhibits', (data) => {
    // Create path to image and text
    let pathToImage;
    let pathToText;

    let allPartsFoundBool = data.allPartsFoundBool;

    // This exhibit's ID
    let currentExhibitItemId = data.currentExhibitItemId - 1;
    // This exhibit's part
    let partNumber = data.partNumber;

    // Check if all parts have been found
    let numberOfParts = database.exhibitItems[currentExhibitItemId].numOfParts;
    allPartsFound[partNumber] = partNumber;

    // Update the looking for image
    pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[3];
    lookingForImage.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';

    // Update name of prop
    pathToText = database.exhibitItems[currentExhibitItemId].name;
    lookingForText.innerHTML = pathToText;

    //Update hint of prop
    pathToText = database.exhibitItems[currentExhibitItemId].hint;
    lookingForHint.innerHTML = pathToText;

    if (allPartsFound[1] == 1) {
        pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[0];
        part1Box.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';
    }

    if (allPartsFound[2] == 2) {
        pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[1];
        part2Box.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';
    }

    if (allPartsFound[3] == 3) {
        pathToImage = database.exhibitItems[currentExhibitItemId].pathToImages[2];
        part3Box.innerHTML = '<img class="propImage" src="' + pathToImage + '"></img>';
    }

    if (allPartsFoundBool == 'True') {
        part1Box.innerHTML = '';
        part2Box.innerHTML = '';
        part3Box.innerHTML = '';
    }
    
}); 

// 
socket.on('updateUIExhibits', (data) => {

// Update message board
socket.on('updateUIMessage', (data) => {
    let message = data.message;
    messageBoard.innerHTML = message;
});