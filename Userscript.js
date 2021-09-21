// ==UserScript==
// @name         SLA red
// @namespace    https://github.com/DamagedDingo/Jira-Table-Formatter
// @version      0.2
// @description  Highlight cells redder as they approach SLA
// @author       Gary Smith
// @match        https://xxxx.atlassian.net/*
// @include      https://xxxx.atlassian.net/*
// @icon         https://github.com/DamagedDingo/Jira-Table-Formatter/blob/main/table_rows_white_24dp.svg
// @grant        none
// ==/UserScript==

const ttr = false;
// time to wait before running in milliseconds
const INIT_WAIT = 2500;

setTimeout((function() {
	// function to return cell value in minutes, devided by the SLA (Value between 0-1 with 1 being full red)
	function getRedness(tr) {
		// gets all the cels in the table using wizardy
		const cells = tr.querySelectorAll("td");

        let timeLeft,
            warnAt;
        if (!ttr) {
            // gets the contents of the cell [9] and uses other fuction to convert time to minutes
            // const ttfrContent = tr.querySelector(".customfield_12620");
            const ttfrContent = tr.querySelector('.customfield_12620').textContent;
            timeLeft = readTime(ttfrContent);
            warnAt = 48 * 60;
        }
        else {
            // gets the contents of the cell [10] and uses other fuction to convert time to minutes
            // const ttrContent = tr.querySelector(".customfield_12619");
            const ttrContent = cells[10].textContent;
            timeLeft = readTime(ttrContent);
            warnAt = 240 * 60;
        }


		// devide the cell time by the sla time (warnings). Only use\keep the larger of the 2 numbers .max
		return timeLeft / warnAt;
	}

	// fuction converts time from h:m to minutes
	function readTime(s) {
		const [ hour, minute ] = s.trim().split(":");
		return (parseInt(hour) * 60) + parseInt(minute);
	}

	// scripty bit
	// use more wizardy to select the table and run foreach to get each row (tr)
	[...document.querySelectorAll(".issuerow")].forEach(tr => {

		if (tr.querySelector(".status").textContent.trim().startsWith("Pending")) {
			tr.style.backgroundColor = `rgb(230,230,230)`;
		} else {
            console.log(getRedness(tr))
			var redness = Math.round(getRedness(tr) * 255);
			// console.log('redness = ' + redness);

			// convert any negitive numbers to 0
			redness = Math.max(0, redness);
			// Lighten it up a bit
			redness = redness + 50

			// use the value to get the RGB value (super cool idea)
			tr.style.backgroundColor = `rgb(255, ${redness}, ${redness})`;
		}
	});
}), INIT_WAIT);
