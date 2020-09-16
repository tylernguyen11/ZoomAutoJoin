
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
  chrome.alarms.create(name + schedDay, {when: d.getTime(), periodInMinutes: 10080});
  addToList(name, time.value, wordDay);
}

function addToList(name, time, day) {
  

  var list = document.getElementById("list");
  var li = document.createElement("li");
  var t = document.createTextNode(name + " - " + day + " at " + time);
  li.appendChild(t);
  list.appendChild(li);
  li.onclick = removeFromList;  // run removeItem when the li is clicked
}

function removeFromList(e) {
  e.target.remove();
}

function documentEvents() {    
  document.getElementById('submit').addEventListener('click', function() { 
    if(document.getElementById('room').value === '') {
      alert("You must enter an ID")
    }
    else if(document.getElementById('name').value === '') {
      alert("You must enter a name");
    }
    else {
      var e = document.getElementById("days");
      var schedDay = e.options[e.selectedIndex].value;
      
      submit(document.getElementById('time'), document.getElementById('name').value, schedDay, e.options[e.selectedIndex].text);
      chrome.runtime.sendMessage({type: 'submit', roomID: document.getElementById('room').value, name: document.getElementById('name').value + schedDay});
    }
  });

  document.getElementById('clear').addEventListener('click', function() {
    document.getElementById("list").innerHTML = "";
    chrome.runtime.sendMessage({type: 'clear'});
  });

  //other buttons possibly (here)
  //zoom blue: 2D8CFF. 45, 140, 255
}