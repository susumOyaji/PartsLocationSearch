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


$(function() {

    // show popupボタンクリック時の処理
    $('#show').click(function(e) {
        $('#popup, #layer').show();
    });

    // レイヤー/ポップアップのcloseボタンクリック時の処理
    $('#close, #layer').click(function(e) {
        $('#popup, #layer').hide();
    });

});