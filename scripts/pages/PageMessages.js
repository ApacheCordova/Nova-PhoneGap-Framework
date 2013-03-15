/// <reference path="../novas/nova.application.js" />
/// <reference path="../novas/nova.ui.js" />
/// <reference path="../novas/nova.helpers.touch.js" />
/// <reference path="../novas/nova.page.js" />

nova.application.currentPage.onLoaded(function () {
    nova.helpers.touch.initScroll();
    nova.helpers.touch.bindClick("#btnBack", function () {
        nova.application.goBack();
    });
    nova.helpers.touch.bindClick("#btnToast", function () {
        nova.ui.toast("You clicked a toast");
    });
    nova.helpers.touch.bindClick("#btnAlert", function () {
        var dialog = new nova.ui.Dialog();
        dialog.show();
    });
    nova.helpers.touch.bindClick("#btnDialog", function () {
        var dialog = new nova.ui.Dialog();
        dialog.title = "Hello";
        dialog.content = "this is a dialog!";
        dialog.buttons = {
            "OK": function () {
                alert("ok");
            },
            "Cancel": function () {
                alert("cancelled!");
            }
        };
        dialog.show();
    });
});