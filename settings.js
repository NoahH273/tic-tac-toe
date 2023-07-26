/*
    this file is for handling the settings ui
    and user preferances
*/
const startButton = document.querySelector(".start");
startButton.addEventListener('click', changeScreen);

function changeScreen() {
    const settingsContainer = document.querySelector('.settings-container');
    const gameContainer = document.querySelector('.game-container');
    settingsContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
}