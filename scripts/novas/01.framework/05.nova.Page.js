if (window.nova == undefined) {
    nova = new Object();
}

nova.Page = function (url, wrapper) {
    nova.View.call(this, url, wrapper);
    this.needAddingToHistory = true;
    this.historyUrl = null;
};

nova.Page.prototype = new nova.View();
nova.Page.constructor = nova.Page;

nova.Page.prototype.clone = function() {
    var page = new nova.Page(this.url, this.wrapper);
    for (p in this) {
        var value = this[p];
        if (p.indexOf("jQuery") != 0) {
            page[p] = value;
        }
    }
    return page;
};