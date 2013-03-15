if (window.nova == undefined) {
    window.nova = new Object();
}
if (window.nova.widgets == undefined) {
    window.nova.widgets = new Object();
}

nova.widgets.Dialog = function (id) {
    nova.Widget.call(this, "#body");
    this.id = id == undefined ? "dialog" + new Date().getTime() : id;
    this.modal = true;
    this.title = "";
    this.content = "";
    this.buttons = null;
    this.css = "";
    this.width = 0.8;
    this.height = 0.6;
    this.canClose = true;
    this.autoRemove = false;

    this.opened = null;
    this.closed = null;
    this.closing = null;
};

nova.widgets.Dialog.prototype = new nova.Widget();
nova.widgets.Dialog.constructor = nova.widgets.Dialog;

nova.widgets.Dialog.prototype.show = function () {
    var dialog = this;

    var $dialog = $("#" + dialog.id);
    if ($dialog.length > 0) {
        $dialog.show();
        return;
    }

    $dialog = $("<div id='" + dialog.id + "' class='dialog'></div>");
    $dialog.appendTo($(dialog.wrapper));
    if (dialog.css != "") {
        $dialog.addClass(dialog.css);
    }
    if (dialog.modal) {
        $dialog.addClass("modal");
    }

    var $win = $("<div class='dialog-window'></div>");
    $win.appendTo($dialog);
    var winHeight = $(window).height();
    var winWidth = $(window).width();

    if (dialog.width <= 1) {
        $win.width(dialog.width * 100 + "%");
        $win.css("left", (1 - dialog.width) * 100 / 2 + "%");
    }
    else {
        $win.width(dialog.width + "px");
        $win.css("left", (winWidth - dialog.width) / 2 + "px");
    }
    if (dialog.height <= 1) {
        $win.height(dialog.height * 100 + "%");
        $win.css("top", (1 - 1 * dialog.height) * 100 / 2 + "%");
    }
    else {
        $win.height(dialog.height + "px");
        $win.css("top", (winHeight - dialog.height) / 2 + "px");
    }

    var $header = $("<div class='dialog-header'><div class='dialog-title'>" + dialog.title + "</div></div>");
    $header.appendTo($win);

    if (dialog.canClose) {
        var $close = $("<div class='dialog-close'><span></span></div>");
        $close.appendTo($header);
        nova.touch.bindClick($close, function () {
            dialog.close();
        });
    }

    var $content = $("<div class='dialog-content'><div class='dialog-content-wrap'>" + dialog.content + "</div></div>");
    $content.appendTo($win);

    var $footer = null;
    if (dialog.buttons != null) {
        $footer = $("<div class='dialog-footer'><div class='dialog-footer-w1'><div class='dialog-footer-w2'></div></div></div>");
        $footer.appendTo($win);
        var $footerWrap = $footer.find(".dialog-footer-w2");
        for (p in dialog.buttons) {
            var property = p;
            var value = dialog.buttons[property];
            if (typeof (value) == "function") {
                var $button = $("<div class='btn' data-text='" + property + "'><span>" + property + "</span></div>");
                $button.data("data", dialog);
                $button.appendTo($footerWrap);
                nova.touch.bindClick($button, function () {
                    try {
                        var text = $(this).attr("data-text");
                        dialog.buttons[text]();
                    }
                    catch (err) {
                        alert("error: " + err);
                    }
                });
            }
        }
    }

    var contentHeight = $win.height() - $header.height();
    if ($footer != null) {
        contentHeight -= $footer.height();
    }
    $content.height(contentHeight + "px");
    if (dialog.opened != null) {
        dialog.opened();
    }
};

nova.widgets.Dialog.prototype.close = function () {
    var obj = this;
    var closingCancelled = false;
    if (obj.closing != null) {
        closingCancelled = obj.closing() == false;
    }
    if (closingCancelled) {
        return;
    }
    if (obj.autoRemove) {
        obj.remove();
    }
    else {
        $("#" + obj.id).hide();
    }
    if (obj.closed != null) {
        obj.closed();
    }
};

nova.widgets.Dialog.prototype.remove = function () {
    $("#" + this.id).remove();
};