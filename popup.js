document.addEventListener('DOMContentLoaded', documentEvents, false);

function submit(time, name, schedDay, wordDay) { 
  var d = new Date();
  var currDay = d.getDay();
  var dayHours = 0;
  var t = time.value.split(":");
  //the targeted hour and minute
  var hour = parseInt(t[0]);
  var minute = parseInt(t[1]);
  if(hour <= d.getHours() && minute <= d.getMinutes()) {
    //7 * 24
    dayHours = 168;
  }
  else if(schedDay > currDay) {
    dayHours = (schedDay - currDay) * 24;
  }
  else if(schedDay < currDay) {
    dayHours = (7 - (currDay - schedDay)) * 24;
  }
  var t = time.value.split(":");
  d.setHours(hour + dayHours);
  d.setMinutes(minute);
  //1 week = 10080 minutes
  chrome.alarms.create(name + schedDay, {when: d.getTime(), periodInMinutes: 10080});
  addToList(name, time.value, wordDay);
}

function addToList(name, time, day) {
  var list = document.getElementById("list");
  var text = name + " - " + day + " at " + time;
  createListElement(text, list);
  chrome.storage.local.get(['LIST'], function(result) {
    result.LIST.push(text);
    chrome.storage.local.set({LIST: result.LIST});
  });
}

function removeFromList(e) {
  //remove from LIST array
  var text = e.target.textContent;
  chrome.storage.local.get(['LIST'], function(result) {
    var index = result.LIST.indexOf(text);
    result.LIST.splice(index, 1);
    chrome.storage.local.set({LIST: result.LIST});
  });

  //parse the alarm name then clear it
  var s1 = text.split(" - ");
  var name = s1[0];
  var s2 = s1[1].split(" ");
  var day = s2[0];
  switch (day) {
    case "Sunday":
      day = 0;
      break;
    case "Monday":
      day = 1;
      break;
    case "Tuesday":
       day = 2;
      break;
    case "Wednesday":
      day = 3;
      break;
    case "Thursday":
      day = 4;
      break;
    case "Friday":
      day = 5;
      break;
    case "Saturday":
      day = 6;
  }
  chrome.alarms.clear(name + day);

  //finally remove from the popup
  e.target.remove();
  
}

function createListElement(text, list) {
  var li = document.createElement("li");
  var t = document.createTextNode(text);
  li.appendChild(t);
  li.onclick = removeFromList;
  list.appendChild(li);
}

function documentEvents() {    
  //reload the list
  var list = document.getElementById("list");
  chrome.storage.local.get(['LIST'], function(result) {
    for(let i = 0; i < result.LIST.length; i++) {
      createListElement(result.LIST[i], list);
    }
  });

  //submit button
  document.getElementById('submit').addEventListener('click', function() { 
    if(document.getElementById('room').value === '') {
      alert("You must enter an ID")
    }
    else if(document.getElementById('name').value === '') {
      alert("You must enter a name");
    }
    else if(document.getElementById('name').value.indexOf(" - ") != -1) {
      alert("Invalid name");
    }
    else {
      var e = document.getElementById("days");
      var schedDay = e.options[e.selectedIndex].value;
      submit(document.getElementById('time'), document.getElementById('name').value, schedDay, e.options[e.selectedIndex].text);
      chrome.runtime.sendMessage({type: 'submit', roomID: document.getElementById('room').value, name: document.getElementById('name').value + schedDay});
    }
  });

  //clear button
  document.getElementById('clear').addEventListener('click', function() {
    document.getElementById("list").innerHTML = "";
    chrome.runtime.sendMessage({type: 'clear'});
  });
}