

nova.application.currentPage.onLoaded(function () {
    var $items = $(".items");
    for (var i = 1; i < 100; i++) {
        $items.append("<p>here is some very long text, list item " + i + "</p>");
    }

    var scroller = new nova.helpers.touch.Scroller("scrollingContent");
    scroller.init();
});