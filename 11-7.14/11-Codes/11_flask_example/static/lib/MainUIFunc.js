function initMainUI(){

    $( function() {
        $( "#option_segnum" ).selectmenu({
            width: 141
        });
        $( "#option_density" ).selectmenu({
            width: 141
        });
    });
}

function buttonEventLoad(){
    CalSum();
}

function CalSum(){
    var methodname = "event-sum";
    var num1 = $('#option_segnum').val();
    var num2 = $('#option_density').val();
    var urlStr = 'getdata';

    $.ajax({
        url: urlStr,
        data:{
            // the data here will be sent to python
            event_name: methodname,
            num_1: num1,
            num_2: num2 
        },
        dataType: 'JSON',
        type: 'GET',
        success: function(input_data){
            console.log(input_data)
        }
    });
}
