if (window.nova == undefined) {
    nova = new Object();
}

nova.Carousel = function (id) {
    this.id = id;
    this.vertical = false;
    this.horizontal = true;
    this.looping = true;
};

nova.Carousel.prototype.init = function () {
    var obj = this;
    var $carousel = $("#" + this.id);
    var $wrapper = $carousel.parent();
    $wrapper.addClass("carousel-container");
    $carousel.addClass("carousel");
    var height = $wrapper.innerHeight();
    var width = $wrapper.innerWidth();
    if (obj.horizontal) {
        $carousel.width($carousel.children().length * width + "px");
    }
    else if (obj.vertical) {
        $carousel.height($carousel.children().length * height + "px");
    }
    $carousel.children().each(function() {
        var $child = $(this);
        var horizontalPadding = $child.outerWidth() - $child.width();
        var verticalPadding = $child.outerHeight() - $child.height();
        $child.width(width - horizontalPadding + "px");
        $child.height(height - verticalPadding + "px");
        $child.addClass("carousel-view");
    });

    // bind dom events
    var events = nova.touch.eventNames;
    $carousel[0].addEventListener(events.touchstart, function (e) {
        e.preventDefault();
        isMoving = false;
        onTouchStart(nova.touch.getTouchPosition(e));
    });
    $carousel[0].addEventListener(events.touchmove, function (e) {
        if (obj.vertical) {
            if (e.scrollingVertical) {
                return;
            }
            else {
                e.scrollingVertical = true;
            }
        }
        if (obj.horizontal) {
            if (e.scrollingHorizontal) {
                return;
            }
            else {
                e.scrollingHorizontal = true;
            }
        }
        isMoving = true;
        onTouchMove(nova.touch.getTouchPosition(e));
    });
    $carousel[0].addEventListener(events.touchend, function (e) {
        if (isMoving) {
            onTouchMove(nova.touch.getTouchPosition(e));
            onTouchEnd();
        }
    });

    var lastPosition = null;
    var lastCarouselPosition = null;
    var slowingDownTimer = null;
    var slowingDowCounter = 0;
    var vForce = 0;
    var hForce = 0;
    var vDistance = 0;
    var isMoving = false;
    var targetLeft = 0;
    var slowdownWidth = 0;
    //events handlers

    function onTouchStart(xy) {
        clearTimeout(slowingDownTimer);
        lastPosition = xy;
        isMoving = false;
        lastCarouselPosition = $carousel.position();
    }

    function onTouchMove(xy) {
        if (xy == null) {
            return;
        }
        if (lastPosition == null) {
            lastPosition = xy;
            return;
        }
        vForce = 0;
        hForce = 0;
        if (obj.vertical) {
            vForce = xy.Y - lastPosition.Y;
        }
        if (obj.horizontal) {
            hForce = xy.X - lastPosition.X;
        }
        moveContent();
        lastPosition = xy;
    }

    function onTouchEnd() {
        if (!isMoving) {
            return;
        }
        var position = $carousel.position();

        if (obj.horizontal) {
            if (Math.abs(hForce) > 5) {
                var hForceRate = Math.abs(hForce) / hForce;
                if (Math.abs(hForce) > width / 5) {
                    hForce = width / 5 * hForceRate;
                }
                $carousel.css("left", (position.left + hForce * 2) + "px");
                position = $carousel.position();
            }
            targetLeft = Math.round(position.left / width) * width;
            if (targetLeft > 0) {
                targetLeft = 0;
            }
            if (targetLeft < -$carousel.children().length * width + width) {
                targetLeft = -$carousel.children().length * width + width;
            }
        }
        slowingDowCounter = 5;
        var minSlowWidth = Math.ceil(Math.abs(position.left - targetLeft) / slowingDowCounter);
        if (Math.abs(hForce) < minSlowWidth) {
            slowdownWidth = minSlowWidth;
        }
        else {
            slowdownWidth = Math.abs(hForce);
        }
        slowDownContent();
    }

    function moveContent() {
        var position = $carousel.position();
        if (obj.horizontal) {
            $carousel.css("left", (position.left + hForce) + "px");
        }
    }

    function slowDownContent() {
        clearTimeout(slowingDownTimer);
        if (slowingDowCounter <= 0) {
            return;
        }
        var stopped = false;
        var position = $carousel.position();
        var newLeft = 0;
        if (obj.horizontal) {
            if (position.left > targetLeft) {
                newLeft = position.left - slowdownWidth;
                if (newLeft < targetLeft) {
                    stopped = true;
                }
            } else {
                newLeft = position.left + slowdownWidth;
                if (newLeft > targetLeft) {
                    stopped = true;
                }
            }
            if (stopped || slowingDowCounter <= 0) {
                newLeft = targetLeft;
            }
            $carousel.css("left", newLeft + "px");
        }
        if (!stopped && slowingDowCounter > 0) {
            slowingDowCounter--;
            setTimeout(function () {
                slowDownContent();
            }, 50);
        }
    }
};

nova.Carousel.prototype.goto = function(indexOrSelector) {

};

nova.Carousel.prototype.onViewChanged = function (handler) {
    $(this).bind("onViewChanged", handler);
};