if (window.nova == undefined) {
    nova = new Object();
}

nova.Scroller = function (selector) {
    this.selector = selector;
    this.showScrollBar = false;
    this.maxOverScrollHeight = 100;
    this.slowingDowSteps = 10;
    this.formFields = "input,select,textarea,a";
    this.vertical = true;
    this.horizontal = false;
    this.fixedFooter = true;
    this.isInHorizontalScroll = false;
    this.isInVerticalScroll = false;
    this.isVerticalScrolling = null;
    this.isScrollingCancelled = false;
};

nova.Scroller.prototype.init = function () {
    var obj = this;
    if (obj.horizontal) {
        alert("horizontal scroll is not supported yet.");
        return;
    }
    $(obj.selector).each(function () {
        var $content = $(this);
        $content.addClass("scroller-content");
        var $scroller = $content.parent();
        if (!$scroller.is(".scroller")) {
            $content.wrap("<div class='scroller'></div>");
            $scroller = $content.parent();
        }

        var height = $scroller.height();
        
        // bind dom events
        var events = nova.touch.eventNames;
        this.addEventListener(events.touchstart, function (e) {
            e.preventDefault();
            isMoving = false;
            obj.isHorizontalScrolling = null;
            obj.isVerticalScrolling = null;
            obj.isScrollingCancelled = false;
            onTouchStart(nova.touch.getTouchPosition(e));
        });
        this.addEventListener(events.touchmove, function (e) {
            if (obj.isScrollingCancelled) {
                return;
            }
            if (obj.isInVerticalScroll && obj.vertical) {
                e.stopPropagation();
            }

            var position = nova.touch.getTouchPosition(e);
            if (obj.isVerticalScrolling == null) {
                if (lastPosition != null) {
                    obj.isVerticalScrolling = Math.abs(position.Y - lastPosition.Y) > Math.abs(position.X - lastPosition.X);
                }
            }
            if (obj.isInHorizontalScroll && obj.vertical && obj.isVerticalScrolling == false) {
                obj.isScrollingCancelled = true;
                return;
            }
            if (obj.isInHorizontalScroll && obj.vertical && obj.isVerticalScrolling) {
                e.stopPropagation();
            }
            onTouchMove(position);
            isMoving = true;
        });
        this.addEventListener(events.touchend, function (e) {
            if (isMoving && !obj.isScrollingCancelled) {
                onTouchMove(nova.touch.getTouchPosition(e));
                onTouchEnd();
            }
        });
        var $fields = $content.find(obj.formFields);
        if ($fields.length > 0) {
            $fields.bind(events.touchstart, function (e) {
                e.stopPropagation();
            });
            $fields.bind(events.touchmove, function (e) {
                e.stopPropagation();
            });
            $fields.bind(events.touchend, function (e) {
                e.stopPropagation();
            });
        }
        // end bind dom events

        var lastPosition = null;
        var lastContentPosition = null;
        var slowingDownTimer = null;
        var slowingDowCounter = 0;
        var contentWidth = 0;
        var contentHeight = 0;
        var vForce = 0;
        var hForce = 0;
        var vDistance = 0;
        var isMoving = false;
        var isCancelled = false;
        //events handlers

        function onTouchStart(xy) {
            clearTimeout(slowingDownTimer);
            lastPosition = xy;
            contentWidth = $content.outerWidth();
            contentHeight = $content.outerHeight();
            isMoving = false;
            lastContentPosition = $content.position();
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
            var position = $content.position();
            var maxTop = 0;
            var minTop = height - contentHeight;
            if (Math.abs(vDistance) > 5 || position.top > maxTop || position.top < minTop) {
                slowingDowCounter = obj.slowingDowSteps;
                slowDownContent();
            }
        }

        function moveContent() {
            var position = $content.position();
            if (obj.vertical) {
                var maxTop = 0;
                var minTop = height - contentHeight;
                var top = position.top + vForce;
                if (top > maxTop) {
                    if (lastContentPosition.top > maxTop) {
                        top = lastContentPosition.top + (top - lastContentPosition.top) * 0.2;
                    } else {
                        top = maxTop + (top - maxTop) * 0.2;
                    }
                    if (top > obj.maxOverScrollHeight) {
                        top = obj.maxOverScrollHeight;
                    }
                }
                if (top < minTop) {
                    if (lastContentPosition.top < minTop) {
                        top = lastContentPosition.top + (top - lastContentPosition.top) * 0.2;
                    } else {
                        top = minTop + (top - minTop) * 0.2;
                    }

                    if (top < minTop - obj.maxOverScrollHeight) {
                        top = minTop - obj.maxOverScrollHeight;
                    }
                }
                vDistance = top - lastContentPosition.top;
                $content.css("top", top + "px");
            }
            if (obj.horizontal) {

            }
            lastContentPosition = $content.position();
        }

        function slowDownContent() {
            clearTimeout(slowingDownTimer);
            if (slowingDowCounter <= 0) {
                return;
            }
            var stopped = false;
            var position = $content.position();
            if (obj.vertical) {
                var maxTop = 0;
                var minTop = height - contentHeight;
                vDistance = vDistance * 0.8;
                var top = position.top + vDistance;
                if (top > maxTop) {
                    vDistance = (top - maxTop) * 0.2;
                    top = maxTop + vDistance;
                    if (Math.abs(vDistance) < 5) {
                        vDistance = -(top - maxTop);
                    }
                }
                if (top < minTop) {
                    vDistance = (top - minTop) * 0.2;
                    top = minTop + vDistance;
                    if (Math.abs(vDistance) < 5) {
                        vDistance = -(top - minTop);
                    }
                }
                if (lastContentPosition.top > maxTop && top <= maxTop) {
                    stopped = true;
                    $content.css("top", maxTop + "px");
                }
                else if (lastContentPosition.top < minTop && top >= minTop) {
                    stopped = true;
                    $content.css("top", minTop + "px");
                }
                else {
                    $content.css("top", top + "px");
                }
            }
            if (obj.horizontal) {

            }
            lastContentPosition = $content.position();

            if (!stopped && slowingDowCounter > 0) {
                slowingDowCounter--;
                setTimeout(function () {
                    slowDownContent();
                }, 100);
            }
        }
    });



    //end events handlers
};