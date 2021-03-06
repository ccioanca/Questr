﻿$(document).ready(function () {
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

    //UTILITY METHODS
    $('#newTabName').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#add-tab-mm').click();
            return false;
        }
    });

    //EO UTILITY METHODS


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

    $("#tod-val").blur(function () {
        //sanatize input first
        var tod = $("#tod-val").val().replace(/ /g, '');
        var toda = [];
        //check to see if it contains either "AM" or "PM"
        if (tod.toUpperCase().includes("AM")) {
            tod = tod.replace(/am/gi, '');
            todTimePeriod = "AM";
        }
        else {
            tod = tod.replace(/pm/gi, '');
            todTimePeriod = "PM";
        }
        //assign hour and minute variables
        if (tod.includes(":"))
            toda = tod.split(":");
        else
            toda[0] = parseInt(tod, 10) +'';
        //set necesarry variables
            todTimeHour = parseInt(toda[0].replace(/\D/g, ''), 10) +'';
        if (toda.length > 1)
            todTimeMin = parseInt(toda[1].replace(/\D/g, ''), 10) +'';

        var retVal;
        retVal = (todTimeHour < 10 && todTimeHour.length < 2) ? "0" + todTimeHour : todTimeHour;
        retVal += ":"
        retVal += (todTimeMin < 10 && todTimeMin.length < 2) ? "0" + todTimeMin : todTimeMin;
        retVal += " " + todTimePeriod;

        $("#tod-val").val(retVal);
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

    //EO MM

    //EE SECTION
    $("#btn-ee-go").click(function () {
        var expression = $("#ee-input").val();
        var result;
        try{
            result = eval(expression);

            var finalResult = "[" + expression + "] = " + result;

            var wholeStr = $("#ee-log-results").val();
            var newStr = finalResult + "\n" + wholeStr;
            $("#ee-log-results").val(newStr);
        }
        catch (e) {
            alert("Expression not recognized");
        }
    });
    //EO EE
});