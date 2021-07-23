let nowTime_js = document.getElementById('h-m-s');
let today_js = document.getElementById('today_js');
let startTime_js = document.getElementById('start-time');
let startTime_H_js = document.getElementById('start-time-h');
let startTime_M_js = document.getElementById('start-time-m');
let schedule_js = document.getElementById('schedule');
let scheduleTime_js = document.getElementById('schedule-time');
let progressNumText_js = document.getElementById('progress-num-text');
let timeNumText_js = document.getElementById('time-num-text');
let timeText_js = document.getElementById('time-text');
let scheduleList_js = document.getElementById('schedule-list');

function todayText() {
  let date = new Date();
  let todayNum = date.getDay();
  let todayArray = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ];

  today_js.innerHTML =
    todayArray[todayNum];

  switch (todayNum) {

    case 0:
      today_js.style.color = 'orange';
      break;
    case 1:
      today_js.style.color = 'indigo';
      break;
    case 2:
      today_js.style.color = 'red';
      break;
    case 3:
      today_js.style.color = 'blue';
      break;
    case 4:
      today_js.style.color = 'green';
      break;
    case 5:
      today_js.style.color = 'gold';
      break;
    case 6:
      today_js.style.color = 'purple';
      break;
  }
}

function nowTimeText() {

  let date = new Date();
  let hours = date.getHours();
  let minus = date.getMinutes();
  let secos = date.getSeconds();
  let nowTime = (hours * 60) + minus;
  let checkCou = localStorage.getItem('checkCou');
  let startTime = localStorage.getItem('startTime');
  startTime = Number(startTime);
  checkCou = Number(checkCou);
  let scheduleTime = JSON.parse(localStorage.getItem('scheduleTime'));

  if (hours <= 9) {
    hours = '0' + hours;
  }
  if (minus <= 9) {
    minus = '0' + minus;
  }
  if (secos <= 9) {
    secos = '0' + secos;
  }
  nowTime_js.innerHTML = hours + '時' + minus + '分' + secos + '秒';

  let Time_1 = 0;
  let Time_2 = 0;

  for (let a = 0; checkCou >= a; a++) {
    Time_1 += scheduleTime[a];
  }
  for (let a = 0; checkCou > a; a++) {
    Time_2 += scheduleTime[a];
  }
  Time_1 += startTime;
  Time_2 += startTime;

  if (startTime <= nowTime) {

    if (Time_1 < nowTime) {

      timeText_js.innerHTML = '分遅れている';
      timeNumText_js.innerHTML = nowTime - Time_1;
    } else if (Time_1 <= nowTime) {

      timeText_js.innerHTML = '遅れている';
      timeNumText_js.innerHTML = '';
    } else if (Time_2 > nowTime) {

      timeText_js.innerHTML = '分早まっている';
      timeNumText_js.innerHTML = Time_2 - nowTime;
    } else if (scheduleTime.length == 0) {

      timeText_js.innerHTML = '追加しよう';
      timeNumText_js.innerHTML = '予定を';
    } else if (nowTime >= Time_2 && Time_1 >= nowTime) {

      timeText_js.innerHTML = '進行中';
      timeNumText_js.innerHTML = '予定が';
    }
  } else {
    timeText_js.innerHTML = 'あと' + (startTime - nowTime) + '分';
    timeNumText_js.innerHTML = '予定が始まるまで';
  }
}

setInterval(nowTimeText, 1000);
todayText();

function checkStorage() {

  let schedule = JSON.parse(localStorage.getItem('schedule'));
  let scheduleTime = JSON.parse(localStorage.getItem('scheduleTime'));
  let startTime = localStorage.getItem('startTime');
  let checkCou = localStorage.getItem('checkCou');

  if (schedule === null || scheduleTime === null || startTime === null || checkCou === null) {

    let schedule = [];
    let scheduleTime = [];
    let startTime = 0;
    let checkCou = 0;

    localStorage.setItem('schedule', JSON.stringify(schedule));
    localStorage.setItem('scheduleTime', JSON.stringify(scheduleTime));
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('checkCou', checkCou);
  }
}

function addStartTime() {

  let startTime = localStorage.getItem('startTime');
  startTime = Number(startTime);
  let startTime_H = 0;
  let startTime_M = 0;
  let startTime_T = 0;
  startTime_M_js.disabled = true;

  startTime_H_js.addEventListener('keydown', function(e) {

    startTime_H = startTime_H_js.value.trim();

    if (startTime_H == '' || e.key !== 'Enter' || startTime_H > 23) {
      return;
    }
    startTime_H_js.disabled = true;
    startTime_M_js.disabled = false;
    startTime_M_js.focus();

    startTime_M_js.addEventListener('keydown', function(e) {

      startTime_M = startTime_M_js.value.trim();

      if (startTime_M == '' || e.key !== 'Enter' || startTime_M > 59) {
        return;
      }
      startTime_H = Number(startTime_H);
      startTime_M = Number(startTime_M);

      startTime_T = (startTime_H * 60) + startTime_M;
      localStorage.setItem('startTime', startTime_T);

      window.location.reload();
    });
  });
}

function addSchedule() {

  let schedule;
  let scheduleTime = 0;
  let scheduleTime_T = 0;
  scheduleTime_js.disabled = true;

  let scheduleArray = JSON.parse(localStorage.getItem('schedule'));
  let scheduleTimeArray = JSON.parse(localStorage.getItem('scheduleTime'));
  let startTime = localStorage.getItem('startTime');
  startTime = Number(startTime);
  let scheduleTimeArrayCopy = scheduleTimeArray;

  schedule_js.addEventListener('keydown', function(e) {

    schedule = schedule_js.value.trim();

    if (schedule == '' || e.key !== 'Enter') {
      return;
    }

    schedule_js.disabled = true;
    scheduleTime_js.disabled = false;
    scheduleTime_js.focus();

    scheduleTime_js.addEventListener('keydown', function(e) {

      scheduleTime = scheduleTime_js.value.trim();
      scheduleTime = Number(scheduleTime);

      for (let i = 0; i < scheduleTimeArrayCopy.length; i++) {
        scheduleTimeArrayCopy[i] = parseInt(scheduleTimeArrayCopy[i]);
        scheduleTime_T += scheduleTimeArrayCopy[i];
      }
      if (e.key == 'Enter') {
        scheduleTime_T += scheduleTime;
        scheduleTime_T += startTime;
      }

      if (scheduleTime == '' || e.key !== 'Enter' || scheduleTime_T > 1439) {
        scheduleTime_T = 0;
        return;
      }
      scheduleArray.push(schedule);
      scheduleTimeArray.push(scheduleTime);

      localStorage.setItem('schedule', JSON.stringify(scheduleArray));
      localStorage.setItem('scheduleTime', JSON.stringify(scheduleTimeArray));

      schedule;
      scheduleTime = 0;
      scheduleTime_T = 0;

      schedule_js.value = '';
      scheduleTime_js.value = '';

      schedule_js.disabled = false;
      schedule_js.focus();

      showSchedule();
    });
  });
}

function checkStartTime() {

  let startTime = localStorage.getItem('startTime');
  startTime = Number(startTime);
  let startTimeText;
  let startTime_H = Math.floor(startTime / 60);
  let startTime_M = startTime % 60;

  if (startTime >= 1) {

    if (startTime_H <= 9) {
      startTime_H = '0' + startTime_H;
    }
    if (startTime_M <= 9) {
      startTime_M = '0' + startTime_M;
    }

    startTime_js.innerHTML = startTime_H + '時' + startTime_M + '分～';

    startTime_H_js.disabled = true;
    startTime_M_js.disabled = true;

    addSchedule();
    showSchedule();
  } else {

    scheduleTime_js.disabled = true;
    schedule_js.disabled = true;

    addStartTime();
  }
}


function main() {

  checkStorage();
  checkStartTime();

}
main();

function showSchedule() {

  let schedule = JSON.parse(localStorage.getItem('schedule'));
  let scheduleTime = JSON.parse(localStorage.getItem('scheduleTime'));
  let checkCou = localStorage.getItem('checkCou');
  let startTime = localStorage.getItem('startTime');
  startTime = Number(startTime);
  checkCou = Number(checkCou);
  let time_T = startTime;
  let time_T_2 = startTime;

  if (checkCou == schedule.length && checkCou !== 0) {

    let schedule = [];
    let scheduleTime = [];
    let startTime = 0;
    let checkCou = 0;

    localStorage.setItem('schedule', JSON.stringify(schedule));
    localStorage.setItem('scheduleTime', JSON.stringify(scheduleTime));
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('checkCou', checkCou);

    window.location.reload();
    return;
  }

  while (scheduleList_js.firstChild) {
    scheduleList_js.removeChild(scheduleList_js.firstChild);
  }

  progressNumText_js.innerHTML = checkCou + '/' + schedule.length;

  for (let i = 0; schedule.length > i; i++) {

    let creLi = document.createElement('li');
    let creSpn = document.createElement('span');
    let creBtn = document.createElement('button');

    creLi.innerHTML = schedule[i];
    creSpn.innerHTML = scheduleTimeCal(i);
    creSpn.classList.add('span-time');
    creBtn.disabled = true;
    creBtn.onclick = function() {
      deleList();
    };

    creLi.appendChild(creSpn);
    creLi.appendChild(creBtn);
    scheduleList_js.appendChild(creLi);
  }


  for (let i = 0; checkCou > i; i++) {
    scheduleList_js.removeChild(scheduleList_js.firstChild);
  }

  if (schedule.length !== 0) {
    let btnArray = scheduleList_js.getElementsByTagName('button');
    btnArray[0].innerHTML = '完了';
    btnArray[0].disabled = false;
  }

  for (let i = 0; i < checkCou; i++) {

    let creLi = document.createElement('li');
    let creSpnDone = document.createElement('span');
    let creSpnTime = document.createElement('span');

    creSpnDone.innerHTML = '完了';
    creSpnDone.classList.add('span-done');
    creSpnTime.innerHTML = scheduleTimeCal(i);
    creSpnTime.classList.add('span-time');
    creLi.innerHTML = schedule[i];
    creLi.appendChild(creSpnTime);
    creLi.appendChild(creSpnDone);

    switch (i) {
      case 0:
        scheduleList_js.prepend(creLi);
        break;
      default:
        let li = scheduleList_js.getElementsByTagName('li');
        let i_2 = i - 1;
        scheduleList_js.insertBefore(creLi, li[i_2].nextSibling);
    }
  }
}

function deleList() {

  scheduleList_js.removeChild(scheduleList_js.firstChild);

  let checkCou = localStorage.getItem('checkCou');
  checkCou = Number(checkCou);
  checkCou += 1;
  localStorage.setItem('checkCou', checkCou);

  showSchedule();

}

function scheduleTimeCal(index) {

  let scheduleTime = JSON.parse(localStorage.getItem('scheduleTime'));
  let startTime = localStorage.getItem('startTime');
  startTime = Number(startTime);

  let totalTime = startTime;
  let totalTimeText;

  for (let i = 0; i < scheduleTime.length; i++) {
    scheduleTime[i] = parseInt(scheduleTime[i]);
  }
  for (let i = 0; i <= index; i++) {

    totalTime += scheduleTime[i];
  }

  if (totalTime % 60 == 0) {
    totalTimeText = '～' + Math.floor(totalTime / 60) + '時' + (totalTime % 60) + '0' + '分';
  } else {
    totalTimeText = '～' + Math.floor(totalTime / 60) + '時' + (totalTime % 60) + '分';
  }

  return totalTimeText;
}

function nowTimeStart() {

  let date = new Date();
  let hours = date.getHours();
  let minus = date.getMinutes();
  let startTime = (hours * 60) + minus;
  localStorage.setItem('startTime', startTime);
  window.location.reload();
}

function dayReset() {

  let schedule = [];
  let scheduleTime = [];
  let startTime = 0;
  let checkCou = 0;

  localStorage.setItem('schedule', JSON.stringify(schedule));
  localStorage.setItem('scheduleTime', JSON.stringify(scheduleTime));
  localStorage.setItem('startTime', startTime);
  localStorage.setItem('checkCou', checkCou);
  window.location.reload();
}

function scheduleReset() {

  let schedule = [];
  let scheduleTime = [];
  let checkCou = 0;

  localStorage.setItem('schedule', JSON.stringify(schedule));
  localStorage.setItem('scheduleTime', JSON.stringify(scheduleTime));
  localStorage.setItem('checkCou', checkCou);
  window.location.reload();
}