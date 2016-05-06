// Make the control panel the height of the content
// upon loading and any time the window is resized
$(window).on("resize load", function() {
    $("#control-panel").height($("#mainbody").height() - 25);
    $(".annotation-list").width($("#control-panel").width() - 20);
});
