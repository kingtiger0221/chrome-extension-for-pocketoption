!function(){
    "use strict"
    
    var optionType , optionstring
    var isRunning = false
    var isReady = false;
    var isLoaded = false;
    var currentTime,timeArray/***this value is the time array of message from telegram */,actType,timeDuration,isMartingale,RealTime,second_type,first_amount,second_amount
    var currentActArray = new Array();
    var isLose,prevBalance = new Array(),curBalance,startedFirstTrade = false,endedTrade,prevTradeAmount;
    var isDoubleAmount = false;
    var isFirstTrade = true;
    var firstBalance;
    var actAfterLoose = false;
    setInterval(function(){
       
        if(!isReady)
            initStateValue();
            prevAct();
            isStartTime();
            // analyseBalance();
    },1000);
    
    var analyseBalance = function(index){
        console.log(prevBalance)
        var balance_element = document.querySelector(".balance_current");
        curBalance = balance_element.lastElementChild.textContent;
        console.log("call analyse balance",index)
        if(parseInt(curBalance)>parseInt(firstBalance)){
            isLose = false;
            isRunning = false;
            console.log(isLose)
            endedTrade = true
            analyseSecondType(isLose);
        }else {
            isLose = true;
            isRunning = false;
            endedTrade = true;
            console.log(isLose)
            analyseSecondType(isLose);
            

        }
    }
    var analyseSecondType = function(isLose){
        var percent;
        switch(second_type){
            case "1":
                var endedTradeIndex = currentActArray.shift();
                if(isLose){
                    if(isMartingale){
                        if(isDoubleAmount)
                        percent = second_amount
                        else
                        percent = first_amount
                        isDoubleAmount = !isDoubleAmount;

                        startAction(endedTradeIndex,percent)
                    }
                    else
                    startAction(endedTradeIndex,first_amount)
                   
                }
            break;
            case "2":
                var endedTradeIndex = currentActArray.shift();
                if(!isLose){
                    startAction(endedTradeIndex)
                }
                break;
            case "3":
                var endedTradeIndex = currentActArray.shift();
                if(isLose&&!actAfterLoose){
                    startAction(endedTradeIndex)
                    actAfterLoose = true;
                }
                break;
        }
    }
    var prevAct = function(){
        
        if(isRunning||!isReady)
        return;
        try{
            currentTime = document.querySelector(".current-time").textContent;
        }catch(e){
        }
        // currentTime = "10:00:00 GMT+2"
    }
    var startAction = function(index,percent){
       
        trade(timeArray[index]["paymethod"],timeArray[index]["type"],percent,index)
        currentActArray.push(index);
    }
    var isStartTime = function(type,islast = false){
        var isStartTime = false;
        try{
            RealTime = document.querySelector(".current-time").textContent
        }catch(e){
            return;
        }
        var currentHour = "",currentMin = "",firstTimeHour = "",firstTimeMin = " ";
        for(var i = 0; i < timeArray.length;i++){
                currentHour = RealTime.split(" ")[0].split(":")[0];
                currentMin = RealTime.split(" ")[0].split(":")[1];
                firstTimeHour = timeArray[i]["time"].split(":")[0];
                firstTimeMin = timeArray[i]['time'].split(":")[1];
            if(parseInt(currentHour)>parseInt(firstTimeHour))
                {
                    // timeArray.shift();
                    continue
                }
            else if(parseInt(currentHour) == parseInt(firstTimeHour))
            {
                if(parseInt(currentMin)>parseInt(firstTimeMin))
                {
                    // timeArray.shift();
                    continue
                }
                else if(parseInt(currentMin) == parseInt(firstTimeMin)){
                    isStartTime = true;
                    isAvailableTimeVal(i)
                }
            }
        }
    }
    var isAvailableTimeVal = function(index){
        console.log(index)
        switch(actType){
            case "1":
                if(currentActArray.indexOf(index) == -1&&index == 0){
                    startAction(index,first_amount)
                }
                break;
            case "2":
                if(currentActArray.indexOf(index) == -1&&index == timeArray.length-1){
                    startAction(index,first_amount)
                }
                break;
            case "3":
                if(currentActArray.indexOf(index) == -1&&(index == 0||index == timeArray.length-1)){
                    startAction(index,first_amount)
                }
                break;
            case "4":
                if(currentActArray.indexOf(index) == -1&&(index == 0|| index == 1||index == timeArray.length-1||index == timeArray.length-2))
                    startAction(index,first_amount)
                break;
            case "5":
                if(currentActArray.indexOf(index) == -1)
                    startAction(index,first_amount)
                break;
        }
    }
    /****
     * Remove unavailable element from timearray(timearray: messages from telegram)
     */

    
    var initStateValue = function(){
        // if(isRunning)
        // return;
        chrome.storage.sync.get(["optionValue"], function(value) {
            console.log(value.optionValue)
            timeArray = value.optionValue;
        });
        chrome.storage.sync.get(["martingale"], function(value) {
            isMartingale = value.martingale;
        });
        chrome.storage.sync.get(["timeduration"], function(value) {
            timeDuration = value.timeduration;
        });
        chrome.storage.sync.get(["type"], function(value) {
            actType = value.type;
        });
        chrome.storage.sync.get(["second_type"], function(value) {
            second_type = value.second_type;
        });
        chrome.storage.sync.get(["first_amount"], function(value) {
            first_amount = value.first_amount;
        });
        chrome.storage.sync.get(["second_amount"], function(value) {
            second_amount = value.second_amount;
        });
        
        isReady = true;
    }
    
    var sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      
      
    async function trade(symbol, trade_method,percent,index){
        isRunning = true;
        endedTrade = false;
        if(isFirstTrade){
            isFirstTrade = false
            firstBalance = document.querySelector(".balance_current").lastElementChild.textContent
        }

        if(actType == 3){
            if(!startedFirstTrade)
                        startedFirstTrade = true;
        }
        setTimeVal();
        await sleep(2000)
        setTradeAmount(percent,true);
        await sleep(2000)
        removeDialogs();
        await sleep(2000)
        var s = symbol.toLowerCase();
        var a_symbolList = document.querySelectorAll("a.change_symbol");
        var lowerBtn = document.querySelector(".btn-put");
        var higherBtn = document.querySelector(".btn-call")
        

        if (a_symbolList.length == 0){
          document.querySelector("a.pair-number-wrap").click();
          await sleep(1000);
        }
        document.querySelector(".currency").firstElementChild.click()
        await sleep(2000);
        var a_symbolList = document.querySelectorAll("a.change_symbol");
        for (var i =0 ; i<a_symbolList.length; i++){
          var a_symbol =  a_symbolList[i];
          var a_symbol_txt = a_symbol.textContent.replace('/','');
          if (a_symbol_txt.toLowerCase().indexOf(s) != -1){
               a_symbol.click();
               await  sleep(1000);
               if ( trade_method.indexOf("CALL") != -1){
                    lowerBtn.click();
               }else{
                    higherBtn.click();
               }
               break;
          }
        }
        if(document.querySelector("div.drop-down-modal-wrap"))
        document.querySelector("div.drop-down-modal-wrap").style="display:none"; 
        await  sleep(1000);
        prevBalance[currentActArray.length] = document.querySelector(".balance_current").lastElementChild.textContent
       
        var timeoutVal = document.querySelectorAll(".deals-list__item")[0].children[1].lastElementChild.textContent
        var totaltimemilli = convertStr2Time(timeoutVal,index);
        setTimeout(() => {
            setTimeout(() => {
                analyseBalance(index)
            }, totaltimemilli+2000);
        }, 1000);
      }
      
      var convertStr2Time = function(textTime,index){
        var min = textTime.split(":")[0];
        var second = textTime.split(":")[1];

        var totalmilli = parseInt(second)*1000+parseInt(min)*1000*60;
        console.log(totalmilli)
       return totalmilli;
      }

     
      var removeDialogs = function(){
          if(document.querySelectorAll("#put-call-buttons-chart-1 > div > div.block.block--time-to-purchase > div:nth-child(2) > div.block__list-wrap.undefined.block__list-wrap--active").length != 0)
          document.querySelector(".value__time-frame").click()
          if(document.querySelectorAll("#put-call-buttons-chart-1 > div > div.block.block--bet-amount > div:nth-child(2) > div.block__list-wrap.undefined.block__list-wrap--active").length != 0)
            document.querySelectorAll("div.value__val")[1].click();


      }
      async function  setTimeVal(){
          document.querySelector(".value__time-frame").click()
          await sleep(1000)
          document.querySelectorAll(".list__k")[0].click()
      }
      async function setTradeAmount(percent, isPercent){
        var curUnit = document.querySelectorAll("a.buttons__fast-trading")[1].textContent;

        if(curUnit.indexOf("$") != -1&&isPercent)
        {
            document.querySelectorAll(".buttons__fast-trading")[1].click()
            await sleep(500)
        }
        
        document.querySelectorAll("div.value__val")[1].click();
        await sleep(1000)
        var keyboardArray = document.querySelectorAll(".virtual-keyboard__input");
        for(var i=0; i<percent.length; i++){
            keyboardArray.forEach(function(keyboard){
                if(keyboard.textContent == percent.charAt(i)){
                    keyboard.click()
                }
            })
        }
        

      }
}()