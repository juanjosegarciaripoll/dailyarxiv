/* -*- mode: javascript; js-indent-level: 2 -*- */

function previousArxivDay(date) {
  var delta = [
      -3, // Sunday -> Thursday
      -3, // Monday -> Friday
      -1, // Tuesday -> Monday
      -1, // Wednesday -> Tuesday
      -1, // Thursday -> Wednesday
      -1, // Friday -> Thursday
      -2 // Saturday -> Thursday
  ];
  var new_date = new Date(date.getTime());
  new_date.setDate(date.getDate() + delta[date.getDay()]);
  return new_date;
}

function nextArxivDay(date) {
  var delta = [
      +1, // Sunday -> Monday
      +1, // Monday -> Tuesday
      +1, // Tuesday -> Wednesday
      +1, // Wednesday -> Thursday
      +1, // Thursday -> Friday
      +3, // Friday -> Monday
      +2 // Saturday -> Monday
  ];
  var new_date = new Date(date.getTime());
  new_date.setDate(date.getDate() + delta[date.getDay()]);
  return new_date;
}

function dateToArxivDate(date, from) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var text = '' + year;
  if (month < 10) text += '0';
  text += month;
  if (day < 10) text += '0';
  text += day;
  if (from)
    text += '2000';
  else
    text += '1959';
  return text;
}
