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

var currentAnsArray = [];
var ansObj = new Object();

function createChoiceListGroup(item) {

    clearAnswer();

    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    var questionText = document.createTextNode(item.title);
    pNode.appendChild(questionText);
    qDiv.appendChild(pNode);
    $("#itemgrouppage").find("div.content").append(qDiv);

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
    $("#itemgrouppage").find("div.content").append(cDiv);

    $("#itemgrouppage").find("div.content").find("fieldset").trigger('create'); 

    // Handle events
    $("input[name='radio-choice']").change(function() {
        var choiceAnsObj = new Object();
        choiceAnsObj.id = item.id;
        choiceAnsObj.ans = $(this).val();
        for (var i = 0; i < currentAnsArray.length; i++) {
            if (currentAnsArray[i].id == choiceAnsObj.id) {
                currentAnsArray[i] = choiceAnsObj;
                return;
            }
        }
        currentAnsArray.push(choiceAnsObj);                                                  
    });

}

function createCheckboxGroup(item) {

    clearAnswer();

    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    var questionText = document.createTextNode(item.title);
    pNode.appendChild(questionText);
    qDiv.appendChild(pNode);
    $("#itemgrouppage").find("div.content").append(qDiv);

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
    $("#itemgrouppage").find("div.content").append(cDiv);

    $("#itemgrouppage").find("div.content").find("fieldset").trigger('create'); 

    $("input[name='checkbox']").change(function() {  
        var status = $("input[name='checkbox']").filter(".checkbox").map(function(){
            var value = $(this).attr('value'); 
                if($(this).is(':checked'))
                    return { 'value':value }; 
            });  
        
        var ansArray = [];
        for (var i = 0; i < status.length; i++) {
            ansArray.push(status[i].value);
        }

        var choiceAnsObj = new Object();
        choiceAnsObj.id = item.id;
        choiceAnsObj.ans = ansArray;

        for (var i = 0; i < currentAnsArray.length; i++) {
            if (currentAnsArray[i].id == choiceAnsObj.id) {
                currentAnsArray[i] = choiceAnsObj;
                return;
            }
        }
        currentAnsArray.push(choiceAnsObj);  

    });
}

function createRangeSliderGroup(item) {

    clearAnswer();

    // Create the question Div
    var qDiv = document.createElement("div");
    qDiv.setAttribute("class", "questionBox");
    var pNode = document.createElement("p");
    var questionText = document.createTextNode(item.title);
    pNode.appendChild(questionText);
    qDiv.appendChild(pNode);
    $("#itemgrouppage").find("div.content").append(qDiv);

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
    $("#itemgrouppage").find("div.content").append(cDiv);

    $("#itemgrouppage").find("div.content").trigger('create'); 

    // Set up the slider
    $("input[name='slider']").slider().slider("option", "highlight", true);
    $("input[name='slider']").closest(".ui-slider").find(".ui-slider-handle").text($("input[name='slider']").val());

    var ans = $("input[name='slider']").val();

    $("input[name='slider']").change(function(){
        $(this).closest(".ui-slider").find(".ui-slider-handle").text($(this).val());
        ans = $(this).val();

        var choiceAnsObj = new Object();
        choiceAnsObj.id = item.id;
        choiceAnsObj.ans = ans;

        for (var i = 0; i < currentAnsArray.length; i++) {
            if (currentAnsArray[i].id == choiceAnsObj.id) {
                currentAnsArray[i] = choiceAnsObj;
                return;
            }
        }
        currentAnsArray.push(choiceAnsObj);
    }); 

    $("input[name='slider']").slider().slider("refresh");
}

function createItemGroup(item) {
    $("#itemgrouppage").find("div.content").empty();

    clearAnswer();

    var list = item.items;
    for (var i = 0; i < list.length; i++) {
        if (list[i].type == "check") {
            createCheckboxGroup(list[i]);
            console.log("check" + list[i]);
        }
        else if(list[i].type == "range") {
            createRangeSliderGroup(list[i]);
            console.log("range" + list[i]);
        }
        else if(list[i].type == "choice") {
            createChoiceListGroup(list[i]);
            console.log("choice" + list[i]);
        }
    }

    ansObj.id = item.id;

}

function submitBtnOnClickGroup() {
    if (!currentAnsArray || currentAnsArray.length != itemList[currentIndex].items.length) {
        showPopupWithString("Please select an answer first!");
    }
    else {
        // send result as JSON to server
        console.log(currentAnswer);
        var jsonObject = new Object();
        jsonObject.id = itemList[currentIndex].id;
        jsonObject.ans = currentAnsArray;
        showPopupWithString(JSON.stringify(jsonObject));
    }
}

$(document).on("pagebeforeshow","#itemgrouppage", function() {
    createItemGroup(itemList[currentIndex]);
});

