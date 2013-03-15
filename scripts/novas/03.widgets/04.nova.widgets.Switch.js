if(window.nova == undefined) {
    window.nova = { };
}
if(nova.widgets == undefined) {
    nova.widgets = { };
}

nova.widgets.Switch = function() {
    this.wrapper = "";
    this.on = true;
    this.rederToFunc = null;
};

nova.widgets.Switch.prototype.render = function() {
    var $switch = $("<div class='switch " + (this.on ? "on" : "") + "'></div>");
    if (this.rederToFunc == null) {
        $(this.wrapper).append($switch);
    }
    else {
        this.rederToFunc($switch);
    }
    nova.touch.bindClick($switch, function() {
        //todo: switch state
    });
};