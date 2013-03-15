
if (window.nova == undefined) {
    nova = new Object();
}
if (nova.touch == undefined) {
    nova.touch = {
        eventNames: {
            touchstart: "touchstart",
            touchmove: "touchmove",
            touchend: "touchend",
            touchcancel: "touchcancel"
        }
    };
}

nova.touch.bindClick = function (selector, func) {
    if(nova.application.settings.isTouchable == false) {
        $(selector).click(function () {
            func.call(this);
        });
    }
    else {
        var isMoving = false;
        var startTime = null;
        $(selector).bind(this.eventNames.touchstart, function (e) {
            isMoving = false;
            startTime = new Date();
            $(this).addClass("touching");
        });
        $(selector).bind(this.eventNames.touchmove, function (e) {
            isMoving = true;
        });
        $(selector).bind(this.eventNames.touchend, function (e) {
            $(this).removeClass("touching");
            var duration = new Date() - startTime;
            if (!isMoving && duration < 1000) {
                func.call(this);
                $(this).addClass("clicking");
                setTimeout(function () {
                    $(this).removeClass("clicking");
                }, 500);
            }
        });
    }
};

nova.touch.getTouchPosition = function (event) {
    try {
        var touch = event.targetTouches[0];
        if (touch == undefined) {
            return null;
        }
        return {
            X: touch.pageX,
            Y: touch.pageY
        };
    }
    catch (ex) {
        alert(ex);
    }
};