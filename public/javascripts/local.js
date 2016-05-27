// Make the control panel the height of the content
// upon loading and any time the window is resized
$(window).on("resize load", function() {
    $("#control-panel").height($("#mainbody").height() - 25);
    $(".annotation-list").width($("#control-panel").width() - 20);
});

$(document).ready(function(){
    String.prototype.toUpperFirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function resetCodeSliders() {
        $("div[id^='range-field-']").hide();
        $("input[id^='range-input-']").val(0);
        $("input#codevalue").val(0);
    }

    $("#coding-mode").on('click', function() {
        mode = 'c';
    });
    $("#annotation-mode").on('click', function() {
        mode = 'a';
    });

    $('body').on('dialogbeforeclose', '.ui-dialog', function() {
        resetCodeSliders();
        $("button#saveNewCode").prop("disabled", true);
        $("button#saveNewAnn").prop("disabled", true);
    });

	$('div[id^="accordion-"]').on('click', 'a[href^="#t"]', function (e) {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 200
                }, 750, 'swing');
                return false;
            }
        }
	});

    $('body').on('change', '#codefield', function(e) {
        var code = $(this).val();
        resetCodeSliders();
        $("div#range-field-" + code).show();
        $("span#range-input-label-" + code).text("0");
        $("button#saveNewCode").prop("disabled", false);
    });

    $("body").on('input', "input[id^='range-input-']", function() {
        var parts = $(this).attr('id').split("-");
        var id = parts[2];

        $("span#range-input-label-" + id).text($(this).val());
        $("input#codevalue").val($(this).val());
    });

    $("body").on('keyup', '#note', function() {
        if ($(this).val().length > 0) {
            $("button#saveNewAnn").prop("disabled", false);
        } else {
            $("button#saveNewAnn").prop("disabled", true);
        }
    });

    $('select.input-md').select2({
        tags: true
    });

    $('select#collections').select2();
    $('select#usergroups').select2();
    $('select#coding-rules').select2();


    $('select.input-md').on('select2:open', function() {
        $('.select2-container--open .select2-search__field').attr('placeholder', 'Type your own field name here');
    });

    $('#tab_logic .delete-row').hide();

    function EditableTable(el, newRow) {
        this.el = el;
        this.newRow = newRow;
        this.rows = 1;
        this.i = 1;
    }

    EditableTable.prototype = {
        addRow: function() {
            var html = this.newRow.replace(/CNT/g, this.i)
            $(this.el + ' tbody').append(html);
            this.i++;
            this.rows++;
            $(this.el + ' .delete-row').show();
            $(this.el + ' select.input-md').select2({
                tags: true
            });

            $(this.el + ' select.input-md').on('select2:open', function() {
                $('.select2-container--open .select2-search__field').attr('placeholder', 'Type in your own field name here.');
            });
        },
        deleteRow: function (id) {
            $(this.el + " #md"+id).html('');
            this.rows--;
            if (this.rows < 2) {
                $(this.el + ' .delete-row').hide();
            } else {
                $(this.el + ' .delete-row').show();
            }
        }
    }

    var options = "<option></option><option>Date</option><option>Description</option><option>Location</option><option>Source</option><option>Year</option>";

    var tablogichtml = "<tr id='mdCNT'><td style='width: 40%'><select name='attCNT' class='form-control input-md' style='width: 100%'>"+options+"</select></td><td style='width: 40%'><input name='valCNT' type='text' placeholder='Value' class='form-control input-md'></td><td class='text-center' style='vertical-align: middle; width: 20%;'><a id='add_row' class='btn btn-link'><span class='material-icons text-success'>add</span></a><a id='CNT' class='delete-row btn btn-link'><span class='material-icons text-danger'>delete</span></a></td></tr>";
    var tablogic = new EditableTable("#tab_logic", tablogichtml);

    $("#tab_logic").on('click', '#add_row', function() {
        tablogic.addRow();
    });
    $("#tab_logic").on('click', '.delete-row', function() {
        tablogic.deleteRow($(this).attr('id'));
    });

    $('#collection-help').popover();
    $('#usergroup-help').popover();
    $('#metadata-help').popover();
    $('#contributors-help').popover();
    $('#coding-help').popover();

    var highlightOn = function() {
        var start = $(this).data('start');
        var end = $(this).data('end');
        $('#t' + start).addClass('highlighted-start');
        for (var i = start; i <= end; i++) {
            $('#t' + i).addClass('highlighted');
        }
        $('#t' + end).addClass('highlighted-end');
    }

    var highlightOff = function() {
        var start = $(this).data('start');
        var end = $(this).data('end');
        $('#t' + start).removeClass('highlighted-start');
        for (var i = start; i <= end; i++) {
            $('#t' + i).removeClass('highlighted');
        }
        $('#t' + end).removeClass('highlighted-end');
    }

    $('div[id^="accordion-"]').on( "mouseenter", ".annotation-panel", highlightOn );
    $('div[id^="accordion-"]').on( "mouseleave", ".annotation-panel", highlightOff );
    $('div.panel-body').on( "mouseenter", ".codedphrase", highlightOn );
    $('div.panel-body').on( "mouseleave", ".codedphrase", highlightOff );

    $('form#formAddDoc').on( "click", "button.addUnit", function() {
        $("#addUnit").html();
        var url = "/" + $(this).data('modaltype') + '/new';
        $("#addUnit").load(url, function() {
            $('#tab_codes .delete-row').hide();

            var tabcodeshtml = "<tr id='mdCNT'><td style='width: 40%'><input class='form-control' type='text' name='codeCNT' placeholder='Code'></td><td style='width: 20%'><input name='minCNT' type='text' placeholder='Min Value' class='form-control input-md'></td><td style='width: 20%'><input name='maxCNT' type='text' placeholder='Max Value' class='form-control input-md'></td><td class='text-center' style='vertical-align: middle; width: 20%;'><a id='add_row' class='btn btn-link'><span class='material-icons text-success'>add</span></a><a id='CNT' class='delete-row btn btn-link'><span class='material-icons text-danger'>delete</span></a></td></tr>";
            var tabcodes = new EditableTable("#tab_codes", tabcodeshtml);

            $('select#users').select2();
            $("#tab_codes").on('click', '#add_row', function() {
                tabcodes.addRow();
            });
            $("#tab_codes").on('click', '.delete-row', function() {
                tabcodes.deleteRow($(this).attr('id'));
            });

            $("#addUnit").on('keyup', '#name', function() {
                if ($(this).val().length > 0) {
                    $("button#saveNewUnit").prop("disabled", false);
                } else {
                    $("button#saveNewUnit").prop("disabled", true);
                }
            });
        });
    });
});
