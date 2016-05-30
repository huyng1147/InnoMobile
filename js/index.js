/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

var itemList = [];
var currentAnswer;
var currentAnsArray = [];
var currentItem;
var groupIndex = 0;

function loadJsonFile(filename) {
    $.getJSON("resource/" + filename + ".json", function(data) {
        itemList = data.ruleset.items;
        if (itemList.length > 0) {
            currentItem = itemList[0];
            createQuestion(currentItem);
        }
    });
}

function generateQuestionBox(item, index) {
    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    pNode.innerText = index + ") " + item.title;
    qDiv.appendChild(pNode);
    $("#mainpage").find("div.content").append(qDiv);
}

function generateChoiceAnswer(item, index) {
    // Create the choice text
    var fragment = document.createDocumentFragment();
    var cDiv = document.createElement("div");
    var fieldNode = document.createElement("fieldset");
    for (var i = 0; i < item.choices.length; i++) {
        fieldNode.setAttribute("data-role", "controlgroup");
        fieldNode.setAttribute("class", "fieldset");
        var inputNode = document.createElement("input");
        inputNode.setAttribute("type", "radio");
        inputNode.setAttribute("name", "radio-choice-" + index);      
        inputNode.setAttribute("value", item.choices[i].display);
        inputNode.setAttribute("id", "radio" + i);
        var labelNode = document.createElement("label");
        labelNode.setAttribute("for", "radio" + i);
        labelNode.innerText = item.choices[i].display;
        fieldNode.appendChild(inputNode);
        fieldNode.appendChild(labelNode);
        fragment.appendChild(fieldNode);   
    }
    cDiv.appendChild(fragment);
    $("#mainpage").find("div.content").append(cDiv);
    $("#mainpage").find("div.content").find("fieldset").trigger('create');

    // Handle events
    $("input[name='radio-choice-" + index +"']").change(function() {  
        currentAnswer = $(this).val();
        if (currentItem.type == "itemgroup") {
            getCurrentAnsArray(item.id, currentAnswer);
        }                                        
    });
}

function generateRangeAnswer(item, index) {
    // Create the choice slider
    var cDiv = document.createElement("div");
    cDiv.setAttribute("class", "slider");
    var sliderNode = document.createElement("input");
    sliderNode.setAttribute("type", "range");
    sliderNode.setAttribute("name", "slider");
    sliderNode.setAttribute("id", "slider-" + index);
    sliderNode.setAttribute("value", (item.lo + item.hi)/2.0);
    sliderNode.setAttribute("min", item.lo);
    sliderNode.setAttribute("max", item.hi);
    sliderNode.setAttribute("step", "0.1");
    cDiv.appendChild(sliderNode);
    $("#mainpage").find("div.content").append(cDiv);

    $("#mainpage").find("div.content").trigger('create'); 

    // Set up the slider
    $("input[id='slider-" + index + "']").slider().slider("option", "highlight", true);
    $("input[id='slider-" + index + "']").slider().each(function() {
        //Add the min and max label
    });
   
    $("input[id='slider-" + index + "']").closest(".ui-slider").find(".ui-slider-handle").text($("input[id='slider-" + index + "']").val());
    currentAnswer = $("input[id='slider-" + index + "']").val();

    // Handle events
    $("input[id='slider-" + index + "']").change(function(){
        $(this).closest(".ui-slider").find(".ui-slider-handle").text($(this).val());
        currentAnswer = $(this).val();
        if (currentItem.type == "itemgroup") {
            getCurrentAnsArray(item.id, currentAnswer);
        }
    }); 

    $("input[name='slider']").slider().slider("refresh");
}

function generateCheckAnswer(item, index) {
    // Create the choice text
    var fragment = document.createDocumentFragment();
    var cDiv = document.createElement("div");
    var fieldNode = document.createElement("fieldset");
    for (var i = 0; i < item.choices.length; i++) {
        fieldNode.setAttribute("data-role", "controlgroup");
        fieldNode.setAttribute("class", "fieldset");
        var inputNode = document.createElement("input");
        inputNode.setAttribute("type", "checkbox");
        inputNode.setAttribute("name", "checkbox-" + index);  
        inputNode.setAttribute("class", "checkbox");     
        inputNode.setAttribute("value", item.choices[i].display);
        inputNode.setAttribute("id", "checkbox" + i);
        var labelNode = document.createElement("label");
        labelNode.setAttribute("for", "checkbox" + i);
        labelNode.innerText = item.choices[i].display;
        fieldNode.appendChild(inputNode);
        fieldNode.appendChild(labelNode);
        fragment.appendChild(fieldNode);   
    }
    cDiv.appendChild(fragment);
    $("#mainpage").find("div.content").append(cDiv);
    $("#mainpage").find("div.content").find("fieldset").trigger('create'); 

    // Handle events
    $("input[name='checkbox-" + index + "']").change(function() {  
        var status = $("input[name='checkbox-" + index + "']").filter(".checkbox").map(function(){
            var value = $(this).attr('value'); 
                if($(this).is(':checked'))
                    return { 'value':value }; 
        });  
        
        currentAnswer = [];

        for (var i = 0; i < status.length; i++) {
            currentAnswer.push(status[i].value);
        }

        if (currentItem.type == "itemgroup") {
            getCurrentAnsArray(item.id, currentAnswer);
        }

    });
}

function createChoiceQuestion(item, index) {
    generateQuestionBox(item, index);
    generateChoiceAnswer(item, index);
}

function createRangeQuestion(item, index) {
    generateQuestionBox(item, index);
    generateRangeAnswer(item, index);
}

function createCheckQuestion(item, index) {
    generateQuestionBox(item, index);
    generateCheckAnswer(item, index);
}

function createReportQuestion(item) {
    // Do Something
}

function createGroupQuestion(item) {
    // console.log(item.length);
    if (item.length > 0) {
        for (var i = 0; i < item.length; i++) {
            createSingleQuestion(item[i], i+1);
        }
    }
}

function createSingleQuestion(item, index) {
    switch (item.type) {
        case "choice":
            createChoiceQuestion(item, index);
            break;
        case "range":
            createRangeQuestion(item, index);
            break;
        case "check":
            createCheckQuestion(item, index);
            break;
        case "report":
            createReportQuestion(item, index);
            break;
        default:
            break;
    }
}

function createQuestion(item) {
    // console.log(item);
    $("#mainpage").find("div.content").empty();
    clearAnswer();
    if (item.type == "itemgroup") {
        createGroupQuestion(item.items);
    }
    else {
        createSingleQuestion(item, 1);
    }
}

function getCurrentAnsArray(id, ans) {   
    var choiceAnsObj = new Object();
    choiceAnsObj.id = id;
    choiceAnsObj.ans = ans;
    for (var i = 0; i < currentAnsArray.length; i++) {
        if (currentAnsArray[i].id == choiceAnsObj.id) {
            currentAnsArray[i] = choiceAnsObj;
            return;
        }
    }
    currentAnsArray.push(choiceAnsObj);
}

function submitBtnOnClick() {
    // send result as JSON to server
    var jsonObject = new Object();
    jsonObject.id = currentItem.id;
    console.log('Received ' + currentAnsArray.length);
    if (currentItem.type == "itemgroup") {
        if (!currentAnsArray || currentAnsArray.length != currentItem.items.length) {
            showPopupWithString("Please select all answers!");
            return;
        }
        else {
            jsonObject.ans = currentAnsArray;            
        }      
    }
    else {
        if (!currentAnswer || currentAnswer.length == 0) {
            showPopupWithString("Please select the answer first!");
            return;
        }
        else {
            jsonObject.ans = currentAnswer;
        }        
    }
    showPopupWithString(JSON.stringify(jsonObject));
}

function showPopupWithString(str) {
    $("#myPopup").find("p").text(str);
    $("#myPopup").enhanceWithin().popup("open");
}

function clearAnswer() {
    currentAnswer = null;
}

app.initialize();

$(document).ready(function() {
    init();
});

$(document).on("pageinit","#mainpage", function() {
    loadJsonFile("sample_choice");
});

function init() {
    
    $("#myPopup").enhanceWithin().popup({autoOpen:false});

    $(".submitBtn").on("click", function () {
            submitBtnOnClick();
    });
}
