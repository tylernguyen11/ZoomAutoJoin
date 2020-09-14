
document.addEventListener('DOMContentLoaded', documentEvents, false);

function submit(roomID, time, name) { 
    
    var t = time.value.split(":");
    
    var d = new Date();
    d.setHours(parseInt(t[0]));
    d.setMinutes(parseInt(t[1]));

    //make the alarm
    var newAlarm = chrome.alarms.create(name.value, {when: d.getTime(), periodInMinutes: 1440});
    
    

}

function documentEvents() {    
  document.getElementById('submit').addEventListener('click', function() { 
    submit(document.getElementById('room'), document.getElementById('time'), document.getElementById('name'));
    chrome.runtime.sendMessage({type: 'submit', roomID: document.getElementById('room').value, name: document.getElementById('name').value});
  });

  document.getElementById('clear').addEventListener('click', function() {
    chrome.runtime.sendMessage({type: 'clear'});
  });

  //other buttons possibly (here)
}