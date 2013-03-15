if (window.nova == undefined) {
    window.nova = new Object();
}
if (window.nova.widgets == undefined) {
    window.nova.widgets = new Object();
}
nova.widgets.BusyIndicator = function() {
    nova.Widget.call(this, "#body");
    this.content = "Loading...";
    this.cancelable = false;
};
nova.widgets.BusyIndicator.prototype = new nova.Widget();
nova.widgets.BusyIndicator.constructor = nova.widgets.BusyIndicator;

nova.widgets.BusyIndicator.prototype.show = function() {
    var $busy = $(".busy");
    if($busy.length==0) {
        $busy = $("<div class='busy'></div>");
        $busy.appendTo(this.wrapper);
    }
    $busy.show();
};

nova.widgets.BusyIndicator.prototype.remove = function() {
    $(".busy").remove();
};
