/// <reference path="../novas/nova.application.js" />
/// <reference path="../novas/nova.helpers.touch.js" />
/// <reference path="../novas/nova.page.js" />



nova.application.currentPage.onLoaded = function () {
    nova.helpers.touch.initScroll();

    nova.helpers.touch.bindClick("#linkBindEvents", function () {
        nova.application.gotoPage("features/intelisense.html");
    });
    nova.helpers.touch.bindClick("#linkPageNav", function () {
        nova.application.gotoPage("features/pageNav.html");
    });
    nova.helpers.touch.bindClick("#linkMessages", function () {
        nova.application.gotoPage("features/messages.html");
    });
    nova.helpers.touch.bindClick("#linkScroller", function () {
        nova.application.gotoPage("features/scroller.html");
    });
};
