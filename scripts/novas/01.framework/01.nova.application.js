/// <reference path="../../jquery/jquery-1.7.2.min.js" />

if (window.nova == undefined) {
    nova = new Object();
}
nova.application = {
    histories: new Array(),
    currentPage: null,
    settings: {
        isOnDevice: true,
        isTouchable: true
    }
};

nova.application.start = function(url) {
    var app = this;
    if (app.settings.isOnDevice) {
        app.events.deviceReady(function() {
            app.events.backButton(function(e) {
                if (app.currentPage != null && app.currentPage.backButton != undefined) {
                    app.currentPage.backButton();
                } else {
                    if (app.histories.length > 0) {
                        app.goBack();
                    } else {
                        if (confirm("Are you sure you want to exit the app?")) {
                            app.exit();
                        }
                    }
                }
            });
            console.log("app started from: " + url);
            $("#body").height($(window).height() + "px");
            app.gotoPage(url);
        });
    } else {
        $("#body").height($(window).height() + "px");
        app.gotoPage(url);
    }
};

nova.application.gotoPage = function (pageOrUrl) {
    var app = this;
    var page = null;
    
    if (pageOrUrl instanceof nova.Page) {
        page = pageOrUrl;
    }
    else {
        page = new nova.Page(pageOrUrl);
    }
    
    if (app.currentPage != null) {
        app.histories.push(app.currentPage.clone());
    }
    page.load();
    app.currentPage = page;
};

nova.application.goBack = function () {
    this.currentPage = this.histories.pop();
    this.currentPage.load();
};

nova.application.exit = function() {
    navigator.app.exitApp();
};

nova.application.changeThemes = function(themes) {
    var $themes = $("#themes");
    $themes.empty();
    for (var i = 0; i < themes.length; i++) {
        $themes.append('<link href="' + themes[i] + '" rel="stylesheet" />');
    }
};

nova.application.events = {
    deviceReady: function (callback) {
        document.addEventListener("deviceready", callback, false);
    },
    backButton: function (callback) {
        document.addEventListener("backbutton", callback, false);
    },
    menuButton: function (callback) {
        document.addEventListener("menubutton", callback, false);
    },
    pause: function (callback) {
        document.addEventListener("pause", callback, false);
    },
    resume: function (callback) {
        document.addEventListener("resume", callback, false);
    },
    searchButton: function (callback) {
        document.addEventListener("searchbutton", callback, false);
    },
    online: function (callback) {
        document.addEventListener("online", callback, false);
    },
    offline: function (callback) {
        document.addEventListener("offline", callback, false);
    },
    batteryCritical: function (callback) {
        document.addEventListener("batterycritical", callback, false);
    },
    batteryLow: function (callback) {
        document.addEventListener("batterylow", callback, false);
    },
    batteryStatus: function (callback) {
        document.addEventListener("batterystatus", callback, false);
    },
    startCallButton: function (callback) {
        document.addEventListener("startcallbutton", callback, false);
    },
    endCallButton: function (callback) {
        document.addEventListener("endcallbutton", callback, false);
    },
    volumeDownButton: function (callback) {
        document.addEventListener("volumedownbutton", callback, false);
    },
    volumeUpButton: function (callback) {
        document.addEventListener("volumeupbutton", callback, false);
    }
};


nova.application.serialize = function(obj) {
    var msg = "";
    for (p in obj) {
        msg += p + ": " + obj[p] + "\r\n";
    }
    return msg;
};