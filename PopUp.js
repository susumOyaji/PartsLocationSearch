'use strict';

const popup = document.getElementById('popup');
const close = document.getElementById('close');
const popWin = document.getElementById('popWin');
popup.addEventListener('click', () => {
    popWin.style.display = 'flex';
});
close.addEventListener('click', () => {
    popWin.style.display = 'none';
});