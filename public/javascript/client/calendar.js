// * calendar.js
// This file contains all the scripts needed to make the Calendar functionalities work on the homepage

// const {result} = require("lodash");

// * Global Variables
// I just like having a global object with properties used all throughout the file 
let calendarJS = {
    currentDate: undefined, // Should contain the current date and time
    activeDate: undefined, // Should contain the data for the selected date by the user
    allCalendarPages: [], // Should be a massive array containing all the "Calendar Pages", each of which contain 42 "Calendar Dates"
    minYear: 1950, // Should indicate the minimum year the calendar can get to 
    maxYear: 2050, // Should indicate the maximum 
    activeCalendarPage: [], // Should contain the selected Calendar Page extracted from allCalendarPages
    activeCalendarPageIndex: undefined, // Should indicate the index used to fetch the selected Calendar Page from allCalendarPages, which is then passed to activeCalendarPage
}

// * Converter Functions
// Functions that accept input data then return the appropriate output data
calendarJS.daysInMonth = (month, year) => { // * OKAY
    // This returns the number of days in a month

    // Month in JavaScript is 0-indexed (January is 0, February is 1, etc), but
    // by using 0 as the day it will give us the last day of the prior month. So
    // passing in 1 as the month number will return the last day of January, not
    // February
    return new Date(year, month, 0).getDate();
}

calendarJS.getMonthString = (month) => { // * OKAY
    // This returns the string equivalent of a month
    return (month === 0) ? `January` :
        (month === 1) ? `February` :
        (month === 2) ? `March` :
        (month === 3) ? `April` :
        (month === 4) ? `May` :
        (month === 5) ? `June` :
        (month === 6) ? `July` :
        (month === 7) ? `August` :
        (month === 8) ? `September` :
        (month === 9) ? `October` :
        (month === 10) ? `November` :
        `December`;
}

// * State-change Functions
// Functions that change the values on the global object, values that the app are dependent on when indicating states
calendarJS.getCurrentDate = () => { // * OKAY
    // This sets the currentDate object the proper values
    let result;
    const date = new Date();

    result = {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        day: date.getDay()
    }

    // Here we fetch the string version of the month
    result.monthString = calendarJS.getMonthString(result.month);

    return result;
}

calendarJS.getActiveDate = () => { // ? NOT SURE LOL

}

// * Calendar-Data Functions
// Functions that build the massive amounts of data that is used as content for the app
// These build the Calendar Pages, each of which house the dates, with each supposedly having blog entries, to-do lists and more
// I could certainly just have such data placed on a database but for now, having them here is good enough
// Find a way to have the data generated here available on the backend
calendarJS.getCalendarPage = (year, month) => { // TODO We can do better
    // This returns an array filled with dates to fill a calendar page
    let result = []; // Should house all the 42 dates

    const active = {
        count: calendarJS.daysInMonth(month + 1, year),
        monthString: calendarJS.getMonthString(month),
        startDay: new Date(year, month, 1).getDay(),
    }

    const prevMonth = {
        month: (month != 0) ? month - 1 : 11,
        year: (month != 0) ? year : year - 1,
    }
    const nextMonth = {
        month: (month != 11) ? month + 1 : 0,
        year: (month != 11) ? year : year + 1,
    }

    prevMonth.count = calendarJS.daysInMonth(prevMonth.month + 1, prevMonth.year);
    prevMonth.monthString = calendarJS.getMonthString(prevMonth.month);
    nextMonth.count = calendarJS.daysInMonth(nextMonth.month + 1, nextMonth.year);
    nextMonth.monthString = calendarJS.getMonthString(nextMonth.month);
    nextMonth.startDay = new Date(nextMonth.year, nextMonth.month, 1).getDay();

    const startDate = (active.startDay === 0) ? {
        month: month,
        date: 1,
        year: year,
        day: 0
    } : {
        month: prevMonth.month,
        date: prevMonth.count - active.startDay + 1,
        year: prevMonth.year,
        day: 0
    };
    const endDate = {
        month: nextMonth.month,
        date: 42 - active.count - active.startDay,
        year: nextMonth.year,
        day: 6
    };

    // -* We get the trailing days from the previous month
    if (active.startDay != 0) {
        for (let i = startDate.date, j = 0; i <= prevMonth.count; i++, j++) {
            result.push({
                month: prevMonth.month,
                monthString: prevMonth.monthString,
                date: i,
                year: prevMonth.year,
                day: j,
            });
        }
    }

    // -* Now we add the active month
    for (let i = 1, j = active.startDay; i <= active.count; i++, j++) {
        j = (j <= 6) ? j : 0;
        result.push({
            month: month,
            monthString: active.monthString,
            date: i,
            year: year,
            day: j
        });
    }

    // -* Finally, we add the starting dates of the next month
    for (let i = 1, j = nextMonth.startDay; i <= endDate.date; i++, j++) {
        j = (j <= 6) ? j : 0;
        result.push({
            month: nextMonth.month,
            monthString: nextMonth.monthString,
            date: i,
            year: nextMonth.year,
            day: j
        });
    }

    return result;
}

calendarJS.getAllCalendarPages = (minYear, maxYear) => { // * OKAY
    // Returns an array of all Calendar Pages found from minYear to maxYear
    let result = [];
    for (let year = minYear; year <= maxYear; year++) {
        for (let month = 0; month <= 11; month++) {
            result.push(calendarJS.getCalendarPage(year, month));
        }
    }
    return result;
}

calendarJS.buildCalendarHTML = (currentPage, activeDate) => { // * OKAY
    $(`.header--navbar--title--current--date-picker p`).html(`${activeDate.monthString} ${activeDate.year}`);

    function calendarDiv() {
        let result = ``;
        for (let i = 0; i < 5; i++) {
            result += `<div class="carousel-item-${i+1} carousel-item">`;
            result += `<div class="calendar">`;
            result += daysOfTheWeekDiv(i);
            result += calendarBodyDiv(i);
            result += `</div>`;
            result += `</div>`;
        }
        // result += prevAndNextBtn(index);
        return result;
    }

    function prevAndNextBtn() {
        let prevBtn = `<button class="calendar--button calendar--prev" onclick="calendarJS.moveCalendarPage('previous')">`;
        prevBtn += `<i class="fa-solid fa-arrow-left"></i>`;
        prevBtn += `</button>`;

        let nextBtn = `<button class="calendar--button calendar--next" onclick="calendarJS.moveCalendarPage('next')">`;
        nextBtn += `<i class="fa-solid fa-arrow-right"></i>`;
        nextBtn += `</button>`;

        return prevBtn + nextBtn;
    }

    function daysOfTheWeekDiv() {
        const daysOfTheWeekArray = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`];
        let result = `<div class="calendar--head">`;
        for (let i = 0; i < 7; i++) {
            result += `<div class="calendar--day calendar--day-${daysOfTheWeekArray[i].toLowerCase()}">`;
            result += `<p>`;
            result += `${daysOfTheWeekArray[i]}`;
            result += `</p>`;
            result += `</div>`;
        }
        result += `</div>`;
        return result;
    }

    function calendarBodyDiv(index) {
        let result = `<div class="calendar--body">`;
        for (let i = 0, t = 0; i < 6; i++) {
            let weekDivHTML = `<div class="calendar--week calendar--week-${i}">`;
            for (let k = 0; k <= 6 && t < 42; k++, t++) {
                const entry = currentPage[index][t];

                const onclick = `onclick="calendarJS.changeActiveDate(${entry.year},${entry.month},${entry.date})"`;
                const dayClass = (entry.date === activeDate.date && entry.month === activeDate.month) ? `active` : (entry.month === activeDate.month) ? `current` : `noncurrent`;
                let classes = `class="`;
                classes += `calendar--day `;
                classes += `calendar--day--${dayClass} `;
                classes += `calendar--week-${i}--day `;
                classes += `calendar--week-${i}--day-${k} `;
                classes += `date--${entry.year}-${entry.month}-${entry.date}`;
                classes += `"`;

                let dayDivHTML = `<div ${classes} ${onclick}>`;
                dayDivHTML += `<p class="calendar--day--date">`;
                dayDivHTML += `${entry.monthString.slice(0,3)} ${entry.date}`;
                dayDivHTML += `</p>`;

                if (entry.hasOwnProperty(`post`)) {
                    dayDivHTML += `<p class="calendar--day--title">`;
                    dayDivHTML += `${entry.post.title}`;
                    dayDivHTML += `</p>`;
                }

                dayDivHTML += `</div>`;
                weekDivHTML += dayDivHTML;
            }
            weekDivHTML += `</div>`;
            result += weekDivHTML;
        }
        result += `</div>`;
        return result;
    }

    // $(`.main--calendar`).append(calendarDiv());

    $(`.carousel-inner`).html(calendarDiv());
    $(`.carousel-item-3`).addClass(`active`);
}

calendarJS.findCalendarPage = (year, month) => { // * OKAY
    let result = [];

    let months = [{
            year: (month < 2) ? year - 1 : year,
            month: (month < 2) ? 10 + month : month - 2,
        },
        {
            year: (month < 1) ? year - 1 : year,
            month: (month < 1) ? 11 : month - 1,
        },
        {
            year: year,
            month: month,
        },
        {
            year: (month > 10) ? year + 1 : year,
            month: (month > 10) ? 0 : month + 1,
        },
        {
            year: (month > 9) ? year + 1 : year,
            month: (month > 9) ? month - 10 : month + 2,
        },
    ];

    for (let i = 0; i < 5; i++) {
        let iYear = months[i].year;
        let iMonth = months[i].month;
        result.push(calendarJS.allCalendarPages[((iYear - calendarJS.minYear) * 12) + iMonth]);
    }

    return result;
    // return calendarJS.allCalendarPages[((year - calendarJS.minYear) * 12) + month];
}

// * changeActiveDate(year, month, date, activeDate)
calendarJS.changeActiveDate = (year, month, date) => {
    year = parseInt(year);
    month = parseInt(month);
    date = parseInt(date);

    const prevDate = JSON.parse(JSON.stringify(calendarJS.activeDate));
    let activeDate = JSON.parse(JSON.stringify(calendarJS.activeDate));

    // const minYear = calendarJS.minYear;
    // const allCalendarPages = calendarJS.allCalendarPages;

    activeDate = {
        year: year,
        month: month,
        date: date
    };

    activeDate.count = calendarJS.daysInMonth(activeDate.month + 1, activeDate.year);
    activeDate.monthString = calendarJS.getMonthString(activeDate.month);
    activeDate.startDay = new Date(activeDate.year, activeDate.month, 1).getDay();

    calendarJS.activeDate = activeDate;

    $(`.header--navbar--title--current--date-picker--input`).val(`${year}-${(month<10)?'0'+(month+1):(month+1)}-${(date<10)?'0'+date:date}`);

    if (year === prevDate.year && month === prevDate.month) {
        if ($(`.date--${year}-${month}-${date}`).hasClass(`calendar--day--active`)) {
            month++;
            let trail = `${year}`;
            trail += `-${(month < 10) ? `0${month}` : month}`;
            trail += `-${(date < 10) ? `0${date}` : date}`;
            window.location.href = `/compose/${trail}`;
        } else {
            $(`.calendar--day--active`).addClass(`calendar--day--current`);
            $(`.calendar--day--active`).removeClass(`calendar--day--active`);

            $(`.date--${year}-${month}-${date}`).addClass(`calendar--day--active`);
            $(`.date--${year}-${month}-${date}`).removeClass(`calendar--day--current`);
        }
    } else {
        // * This is what happens if the active date isn't within the current month
        const newPage = calendarJS.findCalendarPage(year, month);
        calendarJS.buildCalendarHTML(newPage, activeDate);
    }
}

// * writeForToday()
calendarJS.writeForToday = () => {
    const today = JSON.parse(JSON.stringify(calendarJS.currentDate));

    let trail = `${today.year}`;
    trail += `-${(today.month < 10) ? `0${today.month + 1}` : today.month + 1}`;
    trail += `-${(today.date < 10) ? `0${today.date}` : today.date}`;
    window.location.href = `/compose/${trail}`;
}

// * moveCalendarPage(direction)
calendarJS.moveCalendarPage = (direction) => {
    if (movingState === false) {
    // if ($(`.calendar--button`).hasOwnProperty(`disabled`)) {
        movingState = true;
        const activeDate = JSON.parse(JSON.stringify(calendarJS.activeDate));

        $(`.calendar--button`).prop(`disabled`,true);

        console.log(direction);
        if (direction === "next") {
            activeDate.year = (activeDate.month != 11) ? activeDate.year : activeDate.year + 1;
            activeDate.month = (activeDate.month != 11) ? activeDate.month + 1 : 0;
            activeDate.date = 1;
        } else {
            activeDate.year = (activeDate.month != 0) ? activeDate.year : activeDate.year - 1;
            activeDate.month = (activeDate.month != 0) ? activeDate.month - 1 : 11;
            activeDate.date = 1;
        }

        activeDate.count = calendarJS.daysInMonth(activeDate.month + 1, activeDate.year);
        activeDate.monthString = calendarJS.getMonthString(activeDate.month);
        activeDate.startDay = new Date(activeDate.year, activeDate.month, 1).getDay();

        calendarJS.activeDate = activeDate;

        let activeCalendarPage = calendarJS.findCalendarPage(activeDate.year, activeDate.month);
        setTimeout(() => {
            calendarJS.buildCalendarHTML(activeCalendarPage, activeDate);
            $(`.calendar--button`).prop(`disabled`,false);
            movingState = false;
        }, 1000);
    }
}

let movingState = false;

// * addEventListeners()
calendarJS.addEventListeners = () => {
    $(`.header--navbar--title--current--date-picker--input`).change(() => {
        const newDate = $(`.header--navbar--title--current--date-picker--input`).val().split(`-`);

        const date = {
            year: newDate[0],
            month: newDate[1] - 1,
            date: newDate[2]
        };

        calendarJS.changeActiveDate(date.year, date.month, date.date);
    });
}