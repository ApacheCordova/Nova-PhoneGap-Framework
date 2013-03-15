nova.application.currentPage.onLoaded(function () {
    $("#content").height(($(window).height() - 92) + "px");


    //nova.application.gotoPage("/demos/scroller/nested.html");

    nova.touch.bindClick("#demoScroller", function () {
        nova.application.gotoPage("/demos/scroller/nested.html");
    });
    nova.touch.bindClick("#demoDialog", function () {
        nova.application.gotoPage("/demos/dialog/firstlook.html");
    });
    nova.touch.bindClick("#novaSoftware", function() {
        var page = new nova.Page("novas/index.html");
        page.needAddingToHistory = false;
        nova.application.gotoPage(page);
    });

    var carousel = new nova.Carousel("carousel");
    carousel.init();

    var scroller = new nova.Scroller("featuresView");
    scroller.isInHorizontalScroll = true;
    scroller.init();
    
    //nova.application.gotoPage("/novas/casestudies/index.html");
});