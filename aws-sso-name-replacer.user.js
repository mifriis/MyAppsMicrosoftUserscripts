// ==UserScript==
// @name     Account Name Replacer
// @version  1
// @grant    none
// @include https://myapps.microsoft.com/
// ==/UserScript==

function runWhenReady(readySelector, callback) {
    let numAttempts = 0;
    let tryNow = function() {
        let elem = document.querySelector(readySelector);
        if (elem) {
          setTimeout(() => {callback(elem);}, "500"); //sometimes it takes a while to load them all
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}

function getMatches(string, regex, index) {
  index || (index = 1); 
  let matches = [];
  let match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
}

function replaceAccountNames() {
  const regexp = /(AWS-SSO-\d{12}-)(.*)/g;
  let cells = document.getElementsByClassName("gridLabel-141");
  for (var i = 0; i < cells.length; i++) {
    let accountName = cells.item(i).innerHTML
    let prefix = getMatches(accountName, regexp, 1);
    if(prefix.length > 0) {
      let suffix = getMatches(accountName, regexp, 2);
      cells.item(i).innerHTML = suffix + " - " + prefix;
    }    
  }
}

document.addEventListener("DOMContentLoaded", () => {
  runWhenReady('.ms-List-cell', replaceAccountNames);
});
