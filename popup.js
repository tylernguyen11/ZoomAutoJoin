
document.addEventListener('DOMContentLoaded', documentEvents, false);

function myAction(roomID, time, name) { 
    
    var t = time.value.split(":");
    
    var d = new Date();
    d.setHours(parseInt(t[0]));
    d.setMinutes(parseInt(t[1]));

    //make the alarm
    chrome.alarms.create(name.value, {when: d.getTime(), periodInMinutes: 1440});

    

}

function documentEvents() {    
  document.getElementById('submit').addEventListener('click', function() { 
    myAction(document.getElementById('room'), document.getElementById('time'), document.getElementById('name'));
    chrome.runtime.sendMessage({roomID: document.getElementById('room').value, name: document.getElementById('name').value});
  });

  document.getElementById('clear').addEventListener('click', function() {
    chrome.runtime.sendMessage({type: 'clear'});
  });

  //other buttons possibly (here)
}