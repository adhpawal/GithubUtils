/**
 * Created by eyeshield on 7/3/15.
 */
$(document).on("ready", function () {
    //Defines Draggable Element
    $(".draggable").draggable({
        revert: "invalid",
        zIndex: 10000,
        appendTo: "body",
        stack: ".draggable"
    });

    //Defines Droppable Element
    $(".droppable").droppable({
        tolerance: "intersect",
        drop: function (event, ui) {
        }
    });

    $("#github-user-setting").on("submit", function(event){
        $(".alert").hide();
        event.preventDefault();
        if(!$("#repoId").val() || !$("#milestone").val() || !$("#lane1").val() || !$("#lane2").val() || !$("#lane3").val() || !$("#lane4").val()){
            $(".alert-danger").show();
            return false;
        }
        $(".alert-success").show();
        //reload page
    });
});