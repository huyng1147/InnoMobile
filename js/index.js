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
var currentIndex;
var currentAnswer;

function loadJsonFile() {
    $.getJSON("resource/sample.json", function(data) {
        itemList = data.ruleset.items;
        if (itemList.length > 0) {
            for (var i = 0; i < itemList.length; i++) {
                createMenuList(i);
            }
            createMenuList_MainPage();
            $("#menupage_listview").listview().listview("refresh");
            $("#menupage_listview").children("li").bind("click", function(e) {
                currentIndex = $(this).index();
            });
        }
    });
}

function createMenuList(index) {
    var liNode = document.createElement("li");
    var aNode = document.createElement("a");
    var page = "#" + itemList[index].type + "page";
    aNode.setAttribute("href", page);
    aNode.setAttribute("data-transition", "slidefade");
    var text = document.createTextNode(itemList[index].type);
    aNode.appendChild(text);
    liNode.appendChild(aNode);
    document.getElementById("menupage_listview").appendChild(liNode);
}

function createMenuList_MainPage() {
    var liNode = document.createElement("li");
    var aNode = document.createElement("a");
    aNode.setAttribute("href", "#mainpage");
    aNode.setAttribute("data-transition", "slidefade");
    var text = document.createTextNode("MainPage");
    aNode.appendChild(text);
    liNode.appendChild(aNode);
    document.getElementById("menupage_listview").appendChild(liNode);
}

function createChoiceList(item) {
    $("#choicepage").find("div.content").empty();

    clearAnswer();

    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    var questionText = document.createTextNode(item.title);
    pNode.appendChild(questionText);
    qDiv.appendChild(pNode);
    $("#choicepage").find("div.content").append(qDiv);

    // Create the choice text
    var cDiv = document.createElement("div");
    var fieldNode = document.createElement("fieldset");
    for (var i = 0; i < item.choices.length; i++) {
        fieldNode.setAttribute("data-role", "controlgroup");
        fieldNode.setAttribute("class", "fieldset");
        var inputNode = document.createElement("input");
        inputNode.setAttribute("type", "radio");
        inputNode.setAttribute("name", "radio-choice");      
        inputNode.setAttribute("value", item.choices[i].display);
        inputNode.setAttribute("id", "radio" + i);
        var labelNode = document.createElement("label");
        labelNode.setAttribute("for", "radio" + i);
        var textNode = document.createTextNode(item.choices[i].display);
        labelNode.appendChild(textNode);
        fieldNode.appendChild(inputNode);
        fieldNode.appendChild(labelNode);   
    }
    cDiv.appendChild(fieldNode);
    $("#choicepage").find("div.content").append(cDiv);

    $("#choicepage").find("div.content").find("fieldset").trigger('create'); 

    // Handle events
    $("input[name='radio-choice']").change(function() {  
        currentAnswer = $(this).val();                                        
    });

}

function createRangeSlider(item) {
    $("#rangepage").find("div.content").empty();

    clearAnswer();

    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    var questionText = document.createTextNode(item.title);
    pNode.appendChild(questionText);
    qDiv.appendChild(pNode);
    $("#rangepage").find("div.content").append(qDiv);

    // Create the choice slider
    var cDiv = document.createElement("div");
    cDiv.setAttribute("class", "slider");
    var sliderNode = document.createElement("input");
    sliderNode.setAttribute("type", "range");
    sliderNode.setAttribute("name", "slider");
    sliderNode.setAttribute("value", item.lo);
    sliderNode.setAttribute("min", item.lo);
    sliderNode.setAttribute("max", item.hi);
    sliderNode.setAttribute("step", "0.1");
    cDiv.appendChild(sliderNode);
    $("#rangepage").find("div.content").append(cDiv);

    $("#rangepage").find("div.content").trigger('create'); 

    // Set up the slider
    $("input[name='slider']").slider().slider("option", "highlight", true);
    $("input[name='slider']").closest(".ui-slider").find(".ui-slider-handle").text($("input[name='slider']").val());
    currentAnswer = $("input[name='slider']").val();

    $("input[name='slider']").change(function(){
        $(this).closest(".ui-slider").find(".ui-slider-handle").text($(this).val());
        currentAnswer = $(this).val();
    }); 

    $("input[name='slider']").slider().slider("refresh");
}

function createCheckbox(item) {
    $("#checkpage").find("div.content").empty();

    clearAnswer();

    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    var questionText = document.createTextNode(item.title);
    pNode.appendChild(questionText);
    qDiv.appendChild(pNode);
    $("#checkpage").find("div.content").append(qDiv);

    // Create the choice text
    var cDiv = document.createElement("div");
    var fieldNode = document.createElement("fieldset");
    for (var i = 0; i < item.choices.length; i++) {
        fieldNode.setAttribute("data-role", "controlgroup");
        fieldNode.setAttribute("class", "fieldset");
        var inputNode = document.createElement("input");
        inputNode.setAttribute("type", "checkbox");
        inputNode.setAttribute("name", "checkbox");  
        inputNode.setAttribute("class", "checkbox");     
        inputNode.setAttribute("value", item.choices[i].display);
        inputNode.setAttribute("id", "checkbox" + i);
        var labelNode = document.createElement("label");
        labelNode.setAttribute("for", "checkbox" + i);
        var textNode = document.createTextNode(item.choices[i].display);
        labelNode.appendChild(textNode);
        fieldNode.appendChild(inputNode);
        fieldNode.appendChild(labelNode);   
    }
    cDiv.appendChild(fieldNode);
    $("#checkpage").find("div.content").append(cDiv);

    $("#checkpage").find("div.content").find("fieldset").trigger('create'); 

    $("input[name='checkbox']").change(function() {  
        var status = $("input[name='checkbox']").filter(".checkbox").map(function(){
            var value = $(this).attr('value'); 
                if($(this).is(':checked'))
                    return { 'value':value }; 
            });  
        
        currentAnswer = [];

        for (var i = 0; i < status.length; i++) {
            currentAnswer.push(status[i].value);
        }

    });
}

function createReport(item) {
    clearAnswer();
}

function createMainpageItem(list) {
    
}

function submitBtnOnClick() {
    if (!currentAnswer || currentAnswer.length == 0) {
        showPopupWithString("Please select an answer first!");
    }
    else {
        // send result as JSON to server
        console.log(currentAnswer);
        var jsonObject = new Object();
        jsonObject.id = itemList[currentIndex].id;
        jsonObject.ans = currentAnswer;
        showPopupWithString(JSON.stringify(jsonObject));
    }
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

$(document).on("pagebeforeshow","#menupage", function() {

});

$(document).on("pagebeforeshow","#mainpage", function() {
    createMainpageItem(itemList);
});

$(document).on("pagebeforeshow","#choicepage", function(event, data) {
    createChoiceList(itemList[currentIndex]);
});

$(document).on("pagebeforeshow","#rangepage", function() {
    createRangeSlider(itemList[currentIndex]);
});

$(document).on("pagebeforeshow","#checkpage", function() {
    createCheckbox(itemList[currentIndex]);
});

$(document).on("pagebeforeshow","#reportpage", function() {
    createReport(itemList[currentIndex]);
});

function init() {
    loadJsonFile();
    
    $("#myPopup").enhanceWithin().popup({autoOpen:false});

    $(".submitBtn").on("click", function () {
        if (itemList[currentIndex].type != "itemgroup") {
            submitBtnOnClick();
        }
        else {
            submitBtnOnClickGroup();
        }
        
    });
}