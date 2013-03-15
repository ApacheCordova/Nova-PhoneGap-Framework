/// <reference path="../novas/nova.application.js" />
/// <reference path="../novas/nova.helpers.touch.js" />
/// <reference path="../novas/nova.page.js" />

nova.application.currentPage.onLoaded(function () {
    $("#btnBack").click(function() {
        nova.application.goBack();
    });
    $("h1").html(nova.application.currentPage.Title);

    nova.helpers.touch.initScroll();

    nova.helpers.touch.bindClick("select", function() {
        $("h1").html("select clicked");
    });
});