if (window.nova == undefined) {
    nova = new Object();
}

nova.Form = function Form(selector) {
    this.selector = selector;
};

nova.Form.prototype.init = function () {
    var obj = this;
    $(obj.selector).each(function () {
        nova.touch.bindClick($(this).find(".form-text"), function () {
            obj._initInput(this, "text");
        });

        $(this).find(".form-password").each(function () {
            var $this = $(this);
            var value = $this.html();
            $this.attr("data-value", value);
            $this.html("");
            for (var i = 0; i < value.length; i++) {
                $this.append("*");
            }
        });
        nova.touch.bindClick($(this).find(".form-password"), function () {
            obj._initInput(this, "password");
        });
        nova.touch.bindClick($(this).find(".form-checkbox"), function () {
            obj.initCheckbox(this);
        });
    });
};

nova.Form.prototype.initCheckbox = function (input) {
    var $check = $(input);
    if ($check.hasClass("checked")) {
        $check.removeClass("checked");
    }
    else {
        $check.addClass("checked");
    }
};

nova.Form.prototype._initInput = function (input, type) {
    var $text = $(input);
    var html = "<div class='form-modal'><div class='form-modal-w1'>";
    html += "<div class='form-text-w1'>";
    switch (type) {
        case "text":
            html += "<input class='pop-input' type='text' value='" + $text.html() + "' />";
            break;
        case "password":
            html += "<input class='pop-input' type='password' value='" + $text.attr("data-value") + "' />";
            break;
        case "textarea":
            html += "<textarea class='pop-input'>" + $text.html() + "</textarea>";
            break;
    }
    html += "</div>";
    html += "<div class='group'>";
    html += "<div class='btn btn-ok'><span>OK</span></div>";
    html += "<div class='btn btn-cancel'><span>Cancel</span></div>";
    html += "</div>";
    html += "</div></div>";
    var $html = $(html);
    $html.appendTo("#body");
    var $textInput = $html.find(".pop-input");
    $textInput.focus();
    nova.touch.bindClick($html.find(".btn-ok"), function () {
        var value = $html.find(".pop-input").val();
        if (type == "password") {
            $text.html("");
            for (var i = 0; i < value.length; i++) {
                $text.append("*");
            }
            $text.attr("data-value", value);
        }
        else {
            $text.html(value);
        }
        $html.remove();
    });
    nova.touch.bindClick($html.find(".btn-cancel"), function () {
        $html.remove();
    });
};