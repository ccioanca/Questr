$(document).ready(function () {
    var modBoolPlus = true;

    var battleTimerSec = 0;
    var battleTimerMin = 0;
    var battleTracker = 0;

    var todLenLetter = "H";
    var todTimeMin = 0;
    var todTimeHour = 12;
    var todTimePeriod = "PM"

    function setDefaultToastOptions() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-bottom-left",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }


    function makeTimer(secTime, minTime) {
        var strSec;
        var strMin;

        strSec = ((secTime < 10) ? "0" + secTime : secTime);
        strMin = ((minTime < 10) ? "0" + minTime : minTime);

        return strMin + ":" + strSec;
    };

    $("#btn-add-turn").click(function () {
        battleTimerSec += 6;
        if(battleTimerSec >= 60)
        {
            battleTimerMin++;
            battleTimerSec = 0;
        }
        battleTracker++;
        var textShow = makeTimer(battleTimerSec, battleTimerMin);

        $("#turn-value-time").val(textShow);
        $("#turn-value-num").text(battleTracker);
    });

    $("#btn-reset-turn").click(function () {
        battleTimerMin = 0;
        battleTimerSec = 0;
        battleTracker = 0;
        $("#turn-value-time").val("00:00");
        $("#turn-value-num").text("0");
    });

    $(function () {
        $("#sortable").sortable({
            axis: "x",
            scroll: false,
            helper: "clone",
            opacity: 0.7
        });
        $("#sortable").disableSelection();
    });

    $('#btnToggleMod').click(function () {
        if ($(this).val() == "+") {
            $(this).val("-");
            $(this).addClass("btn-danger");
            $(this).removeClass("btn-success");
            modBoolPlus = false;
        }
        else {
            $(this).val("+");
            $(this).removeClass("btn-danger");
            $(this).addClass("btn-success");
            modBoolPlus = true;
        }
    });
    $(document).on('mouseup', '.btn', function () {
        $(this).blur();
    });

    $("#btnClear").click(function () {
        $("#taResults").val("");
        $("#inResult").val("");
    });

    $("#btnRoll").click(function () {
        //warning toast
        if (!$.isNumeric($("#inAmt").val()) || !$.isNumeric($("#inNFace").val())) {
            setDefaultToastOptions();
            Command: toastr["warning"]("Roll Not Valid: NaN", "Warning");
        }
        else if (parseFloat($("#inAmt").val()) <= 0) {
            setDefaultToastOptions();
            Command: toastr["warning"]("Roll Not Valid: Amount must be at least One (1).", "Warning");
        }
        else if (parseFloat($("#inNFace").val()) <= 1) {
            setDefaultToastOptions();
            Command: toastr["warning"]("Roll Not Valid: Number of die faces must be at least Two (2).", "Warning")
        }
        else {
            //number of rolls
            var str = $("#inAmt").val() + "d" + $("#inNFace").val() + " rolls: [";
            var total = 0;

            for (var i = 0; i < $("#inAmt").val() ; ++i) {
                //random dice roll of the correct size
                var d = "" + $("#inNFace").val();
                var num = Math.floor((Math.random() * d) + 1);
                str += num;

                if (i != ($("#inAmt").val() - 1))
                    str += ", ";
                else
                    str += " ";

                total += num;
            }
            if ($.isNumeric($("#inMod").val()) && modBoolPlus == true) {
                str += "+ [" + $("#inMod").val() + "]";
                total += parseFloat($("#inMod").val());
            }
            else if ($.isNumeric($("#inMod").val()) && modBoolPlus == false) {
                str += "- [" + $("#inMod").val() + "]";
                total -= parseFloat($("#inMod").val());
            }
            str += "]";

            var wholeStr = $("#taResults").val();
            var newStr = str + "\n" + wholeStr;
            $("#taResults").val(newStr);
            $("#inResult").val(total);
        }
    });

    $("#btn-tod-len").click(function () {
        if(todLenLetter == "M")
        {
            //change the letter to H, change the class on the object
            $("#btn-tod-len").val("H");
            $("#btn-tod-len").addClass("blackButton");
            todLenLetter = "H";
        }
        else if(todLenLetter == "H")
        {
            $("#btn-tod-len").val("M");
            $("#btn-tod-len").removeClass("blackButton");
            todLenLetter = "M";
        }
    });

    $("#tod-go").click(function () {
        var input = $("#tod-mod").val();
        //add time to either hour or minute depending on the todLenLetter variable.
        if(parseInt(input))
        {
            //add to either minute or second depending on the letter
            if(todLenLetter == "M")
            {
                //add minutes
                todTimeMin += parseInt(input);
                while(todTimeMin >= 60)
                {
                    todTimeMin = todTimeMin - 60;
                    todTimeHour++;
                }
            }
            else if(todLenLetter == "H")
            {
                //add hours
                todTimeHour += parseInt(input);
            }

            while (todTimeHour >= 12) {
                todTimeHour = todTimeHour - 12;
                if (todTimePeriod == "AM")
                    todTimePeriod = "PM";
                else
                    todTimePeriod = "AM";
            }
            //wrap all that up into a neat "00:00 AM" format and set that up.
            var retVal;

            if (todTimeHour == 0) {
                retVal = "12";
                if (todTimePeriod == "AM")
                    todTimePeriod == "PM";
            }
            else
                retVal = (todTimeHour < 10) ? "0" + todTimeHour : todTimeHour;
            retVal += ":"
            retVal += (todTimeMin < 10) ? "0" + todTimeMin : todTimeMin;
            retVal += " " + todTimePeriod;

            $("#tod-val").val(retVal);
        }
        //check to see if input has a ":". if so, they may be trying to add a set timeframe, do that.
        else if(input.includes(":"))
        {
            //var ar = input.split(":");
            setDefaultToastOptions();
            Command: toastr["warning"]("We don't allow that yet, though we will soon.", "Warning");

        }
        else {
            //var ar = input.split(":");
            setDefaultToastOptions();
            Command: toastr["warning"]("Sorry we didn't recognize that.", "Warning");
        }
    });

    //MM section

    $(".nav-tabs-mm").on("click", "a", function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
    .on("click", "span", function () {
        var anchor = $(this).siblings('a');
        var $this = $(this);
        bootbox.confirm({
            message: "Are you sure want to delete this tab?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-danger'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-default'
                }
            },
            callback: function (result) {
                // alert("Confirm result: " + result);
                if (result == true) {
                    var anchor = $this.siblings('a');
                    $(anchor.attr('href')).remove();
                    $this.parent().remove();
                    $(".nav-tabs-mm li").children('a').first().click();
                }
            }
        });

    });

    function addTab(content) {
        var label = $("#newTabName").val();
        var id = $(".nav-tabs-mm").children().length;

        var nav = $(".nav-tabs-mm");
        var tabs = $(".tab-content-mm");

        if (id == 1) {
            var new_tab = $('<div>').addClass('tab-pane in active').attr('id', 'tab_' + id).append(content);
            $("#add-btn-mm").closest('li').before('<li class="active"><a href="#tab_' + id + '" class="mm-tab-label">' + label + '</a><span style="line-height: 28px">✕</span></li>');
        }
        else {
            var new_tab = $('<div>').addClass('tab-pane in').attr('id', 'tab_' + id + '_mm').append(content);
            $("#add-btn-mm").closest('li').before('<li><a href="#tab_' + id + '_mm">' + label + '</a><span style="line-height: 30px">✕</span></li>');
        }
        tabs.append(new_tab);

        // if(id == 1){
        //     var tab = $('.nav-tabs').children().get(0);
        //     tab.addClass("active");
        // }
    };

    $('#add-tab-mm').click(function () {
        addTab("Test");
    });

    //EO MM

});