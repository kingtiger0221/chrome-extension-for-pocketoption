let saveOptions = function(){
    setTimeout(() => {
        timeouttest("3")
    }, 49000);
    let optString = $("#optionstring").val();
    var radio = $('input[type="radio"]:checked')
    let type, second_type,first_amount, second_amount
    var tradeDuration, isMartingale

    try{
        type = document.querySelector('input[name="radgroup"]:checked').value;
        second_type = document.querySelector('input[name="radgroup1"]:checked').value;
    }catch(e){
        alert("please select option")
    }
    
    first_amount = document.querySelector('.first_amount').value
    second_amount = document.querySelector('.second_amount').value
    if(first_amount == ""|| isNaN(parseInt(first_amount))){
        document.querySelector('.first_amount').focus()

    }

    var timeArray = Array(),lasttime,paymethod,money;

    if(optString == ""){
        alert("input received messages");
        return;
    }
    optArray = optString.split("\n");
    
            optArray.forEach(function(value){
                if(value.slice(0,1) == "M")
                {
                    if(value == "Maximum 1 Martingale")
                        isMartingale = true;
                    else if(!isNaN(parseInt(value.slice(1,2))) && value.length == 2){
                        tradeDuration = parseInt(value.slice(1,2))
                        console.log(tradeDuration)

                    }
                }
                if(!isNaN(parseInt(value.slice(0,2))))
                {
                    splitArray = value.split(", ")
                    var hasTime = true;
                    splitArray.forEach(function(each){
                        if(each.split(":").length == 2 ){
                            smallArray = each.split(", ");
                            smallArray.forEach(function(value){
                                if(isNaN(parseInt(value)))
                                hasTime = false;
                            })
                        }
                    })
                    if(hasTime)
                    {
                        var changedTime = convertTime(splitArray[0])
                        var oneTime = {
                            "time":changedTime,
                            "paymethod":splitArray[1],
                            "type":splitArray[2]
                        }
                        timeArray.push(oneTime)
                    }
                }
            })
         console.log(timeArray[0]["time"].split(":")[0])
    chrome.storage.sync.set({"optionValue": timeArray}, function() {
        console.log(timeArray)
    });
    chrome.storage.sync.set({"martingale": isMartingale}, function() {
    });
    chrome.storage.sync.set({"timeduration": tradeDuration}, function() {
    });
    chrome.storage.sync.set({"type": type}, function() {
    });
    chrome.storage.sync.set({"second_type": second_type}, function() {
    });
    chrome.storage.sync.set({"optionstring": optString}, function() {
    });
    chrome.storage.sync.set({"first_amount": first_amount}, function() {
    });
    chrome.storage.sync.set({"second_amount": second_amount}, function() {
    });
    
}
var timeouttest = function(percent){
    console.log("timeout test is",percent)
}
var convertTime = function(time){
    var splitedTime = time.split(":");
    var hour = splitedTime[0]
    var min = splitedTime[1]
    var changedMin = parseInt(min)-30;
    var changedHour = parseInt(hour)-3;
    console.log(changedHour)
    if(changedMin<0){
        changedMin+=60;
        changedHour-=1;
    }
    if(changedHour<0){
        changedHour += parseInt(24);
    }
    
    
    if(changedHour<10)
        changedHour = "0"+changedHour;
    if(changedMin<10)
        changedMin = "0"+changedMin
    return changedHour+":"+changedMin;
}
var initStateValue = function(){
    // if(isRunning)
    // return;
var optionstring, isMartingale, actType, second_type, first_amount, second_amount
    chrome.storage.sync.get(["optionstring"], function(value) {
        console.log(value.optionValue)
        optionstring = value.optionstring;
        $("#optionstring").val(optionstring)
    });
    chrome.storage.sync.get(["martingale"], function(value) {
        isMartingale = value.martingale;
    });
    chrome.storage.sync.get(["timeduration"], function(value) {
        timeDuration = value.timeduration;
    });
    chrome.storage.sync.get(["type"], function(value) {
        actType = value.type;
    document.querySelectorAll('input[name="radgroup"]')[parseInt(actType)-1].checked = true
    });
    chrome.storage.sync.get(["second_type"], function(value) {
        second_type = value.second_type;
    second_type = document.querySelectorAll('input[name="radgroup1"]')[parseInt(second_type)-1].checked = true;

    });
    chrome.storage.sync.get(["first_amount"], function(value) {
        first_amount = value.first_amount;
    document.querySelector('.first_amount').value = first_amount

    });
    chrome.storage.sync.get(["second_amount"], function(value) {
        second_amount = value.second_amount;
    document.querySelector('.second_amount').value = second_amount

    });
    console.log(actType)
  
    isReady = true;
}
initStateValue();
$("#saveoption").on("click",function(){
    saveOptions();
})