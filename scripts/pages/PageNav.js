/// <reference path="../novas/nova.application.js" />
/// <reference path="../novas/nova.ui.js" />
/// <reference path="../novas/nova.helpers.touch.js" />
/// <reference path="../novas/nova.page.js" />

nova.application.currentPage.onLoaded(function () {
    nova.helpers.touch.initScroll();
    nova.helpers.touch.bindClick("#btnBack", function () {
        nova.application.goBack();
    });
});