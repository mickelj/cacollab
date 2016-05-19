// Make the control panel the height of the content
// upon loading and any time the window is resized
$(window).on("resize load", function() {
    $("#control-panel").height($("#mainbody").height() - 25);
    $(".annotation-list").width($("#control-panel").width() - 20);
});

$(document).ready(function(){
    $('select.input-md').select2({
        tags: true
    });

    $('select#collections').select2();
    $('select#usergroups').select2();
    $('select#coding-rules').select2();

    $('select.input-md').on('select2:open', function() {
        $('.select2-container--open .select2-search__field').attr('placeholder', 'Type your own field name here');
    });

    $('.delete-row').hide();
    var i = 1;
    var rows = 1;
    var options = "<option>Date</option><option>Description</option><option>Location</option><option>Source</option><option>Year</option>";

    $("#tab_logic").on('click', '#add_row', function(){
        $('#tab_logic tbody').append("<tr id='md"+i+"'><td style='width: 40%'><select name='att"+i+"' class='form-control input-md' style='width: 100%'>"+options+"</select></td><td style='width: 40%'><input name='val"+i+"' type='text' placeholder='Value' class='form-control input-md'></td><td class='text-center' style='vertical-align: middle; width: 20%;'><a id='add_row' class='btn btn-link'><span class='glyphicon glyphicon-plus-sign text-success'></span></a><a id='"+i+"' class='delete-row btn btn-link'><span class='glyphicon glyphicon-remove-sign text-danger'></span></a></td></tr>");
        i++;
        rows++;
        $('.delete-row').show();
        $('select.input-md').select2({
            tags: true
        });

        $('select.input-md').on('select2:open', function() {
            $('.select2-container--open .select2-search__field').attr('placeholder', 'Type your own field name here');
        });
    });

    $("#tab_logic").on('click', '.delete-row', function() {
        var id = $(this).attr('id');
		$("#md"+id).html('');
        rows--;
        if (rows < 2) {
            $('.delete-row').hide();
        } else {
            $('.delete-row').show();
        }
	});


    $('#collection-help').popover();
    $('#usergroup-help').popover();
    $('#metadata-help').popover();
    $('#contributors-help').popover();
    $('#coding-help').popover();

    $('.annotation-panel').on({
        mouseenter: function() {
            var start = $(this).data('start');
            var end = $(this).data('end');
            $('#t' + start).addClass('highlighted-start');
            for (var i = start; i <= end; i++) {
                $('#t' + i).addClass('highlighted');
            }
            $('#t' + end).addClass('highlighted-end');
        },
        mouseleave: function() {
            var start = $(this).data('start');
            var end = $(this).data('end');
            $('#t' + start).removeClass('highlighted-start');
            for (var i = start; i <= end; i++) {
                $('#t' + i).removeClass('highlighted');
            }
            $('#t' + end).removeClass('highlighted-end');
        }
    });

});
