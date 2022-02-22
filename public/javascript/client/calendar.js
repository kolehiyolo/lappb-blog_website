// * Global Variables
let currentDate;
let activeDate = {};
let allCalendarPages = [];
let minYear = 1950;
let maxYear = 2050;
let activeCalendarPageIndex;

function getCurrentDate() {
    // This sets the currentDate object the proper values
    // console.log(`getCurrentDate()`);

    const date = new Date();

    currentDate = {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        day: date.getDay()
    }

    currentDate.monthString = getMonthString(currentDate.month);
    // currentDate.day = new Date(currentDate.year, currentDate.month, currentDate.date).getDay();

    // console.log(currentDate);
}

function daysInMonth(month, year) {
    // This returns the number of days in a month

    // Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
    // but by using 0 as the day it will give us the last day of the prior
    // month. So passing in 1 as the month number will return the last day
    // of January, not February
    return new Date(year, month, 0).getDate();
}

function getMonthString(month) {
    // This returns the string equivalent of a month
    // console.log(`getMonthString()`);

    switch (month) {
        case 0:
            return `January`;
        case 1:
            return `February`;
        case 2:
            return `March`;
        case 3:
            return `April`;
        case 4:
            return `May`;
        case 5:
            return `June`;
        case 6:
            return `July`;
        case 7:
            return `August`;
        case 8:
            return `September`;
        case 9:
            return `October`;
        case 10:
            return `November`;
        case 11:
            return `December`;
    }
}

function getActiveDate() {

}

function getCalendarPage(year, month) {
    // This returns an array filled with dates to fill a calendar page
    // console.log(`getCalendarPage()`);
    let result = [];

    activeDate = {
        month: month,
        year: year,
    }

    activeDate.count = daysInMonth(activeDate.month + 1, activeDate.year);
    activeDate.monthString = getMonthString(activeDate.month);
    activeDate.startDay = new Date(activeDate.year, activeDate.month, 1).getDay();

    const prevMonth = {
        month: (activeDate.month != 0) ? activeDate.month - 1 : 11,
        year: (activeDate.month != 0) ? activeDate.year : activeDate.year - 1,
    }
    const nextMonth = {
        month: (activeDate.month != 11) ? activeDate.month + 1 : 0,
        year: (activeDate.month != 11) ? activeDate.year : activeDate.year + 1,
    }
    prevMonth.count = daysInMonth(prevMonth.month + 1, prevMonth.year);
    prevMonth.monthString = getMonthString(prevMonth.month);
    nextMonth.count = daysInMonth(nextMonth.month + 1, nextMonth.year);
    nextMonth.monthString = getMonthString(nextMonth.month);
    nextMonth.startDay = new Date(nextMonth.year, nextMonth.month, 1).getDay();

    const startDate = (activeDate.startDay === 0) ? {
        month: activeDate.month,
        date: 1,
        year: activeDate.year,
        day: 0
    } : {
        month: prevMonth.month,
        date: prevMonth.count - activeDate.startDay + 1,
        year: prevMonth.year,
        day: 0
    };
    const endDate = {
        month: nextMonth.month,
        date: 42 - activeDate.count - activeDate.startDay,
        year: nextMonth.year,
        day: 6
    };

    // -* We get the trailing days from the previous month
    if (activeDate.startDay != 0) {
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
    for (let i = 1, j = activeDate.startDay; i <= activeDate.count; i++, j++) {
        j = (j <= 6) ? j : 0;
        result.push({
            month: activeDate.month,
            monthString: activeDate.monthString,
            date: i,
            year: activeDate.year,
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

function getAllCalendarPages() {
    // console.log(`getAllCalendarPages()`);
    for (let year = minYear; year <= maxYear; year++) {
        for (let month = 0; month <= 11; month++) {
            allCalendarPages.push(getCalendarPage(year, month, 1));
        }
    }
}


// console.log(`What`); 
// console.log(findCalendarPage(2022,0)); 

function buildCalendarDiv(currentPage) {
    // console.log(`buildCalendarDiv()`);

    $(`.calendar`).remove();

    // console.log(activeDate.monthString);

    // let headerCalendarPicker = ``;
    // headerCalendarPicker += `<div class="header--navbar--title--current--date-picker">`;
    // headerCalendarPicker += `<p>${activeDate.monthString} ${activeDate.year}</p>`;
    // headerCalendarPicker += `<input class="header--navbar--title--current--date-picker--input" id="date" name="date" type="date" value="">`;
    // headerCalendarPicker += `</div>`;
    // $(`.header--navbar--title--current`).html(`${headerCalendarPicker}`);

    $(`.header--navbar--title--current--date-picker p`).html(`${activeDate.monthString} ${activeDate.year}`);

    let calendarDivHTML = `<div class="calendar">`;

    let previousPageHTML = `<button class="calendar--button calendar--prev" onclick="moveCalendarPage('previous')">`;
    previousPageHTML += `<i class="fa-solid fa-arrow-left"></i>`;
    previousPageHTML += `</button>`;

    let nextPageHTML = `<button class="calendar--button calendar--next" onclick="moveCalendarPage('next')">`;
    nextPageHTML += `<i class="fa-solid fa-arrow-right"></i>`;
    nextPageHTML += `</button>`;

    calendarDivHTML += previousPageHTML;
    calendarDivHTML += nextPageHTML;


    const daysOfTheWeekArray = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`];
    let daysOfTheWeekHTML = `<div class="calendar--head">`;
    for (let i = 0; i < 7; i++) {
        let dayOfTheWeekHTML = `<div class="calendar--day calendar--day-${daysOfTheWeekArray[i].toLowerCase()}">`;
        dayOfTheWeekHTML += `<p>`;
        dayOfTheWeekHTML += `${daysOfTheWeekArray[i]}`;
        dayOfTheWeekHTML += `</p>`;
        dayOfTheWeekHTML += `</div>`;

        daysOfTheWeekHTML += dayOfTheWeekHTML;
    }
    daysOfTheWeekHTML += `</div>`;

    calendarDivHTML += daysOfTheWeekHTML;

    let calendarDivBodyHTML = `<div class="calendar--body">`;
    for (let i = 0, t = 0; i < 6; i++) {
        let weekDivHTML = `<div class="calendar--week calendar--week-${i}">`;
        for (let k = 0; k <= 6 && t < 42; k++, t++) {
            // const dateFunction = (activeDate.month === currentPage[t].month) ? `onclick="changeActiveDate(${currentPage[t].year},${currentPage[t].month},${currentPage[t].date})"` :
            //     (activeDate.month > currentPage[t].month) ?
            //     `onclick="moveCalendarPage('previous')"` : `onclick="moveCalendarPage('next')"`;
            const dateFunction = `onclick="changeActiveDate(${currentPage[t].year},${currentPage[t].month},${currentPage[t].date})"`;
            // const dateFunction = `onclick="changeActiveDate(${currentPage[t].year},${currentPage[t].month},${currentPage[t].date})"`;

            const dayClass = (currentPage[t].date === activeDate.date && currentPage[t].month === activeDate.month) ? `active` : (currentPage[t].month === activeDate.month) ? `current` : `noncurrent`;
            let dayDivHTML = `<div class="calendar--day calendar--day--${dayClass} calendar--week-${i}--day calendar--week-${i}--day-${k} date--${currentPage[t].year}-${currentPage[t].month}-${currentPage[t].date}" ${dateFunction}>`;
            dayDivHTML += `<p class="calendar--day--date">`;
            dayDivHTML += `${currentPage[t].monthString.slice(0,3)} ${currentPage[t].date}`;
            dayDivHTML += `</p>`;
            
            if (currentPage[t].hasOwnProperty(`post`)) {
                // console.log(`WHATT`); 
                
                dayDivHTML += `<p class="calendar--day--title">`;
                dayDivHTML += `${currentPage[t].post.title}`;
                dayDivHTML += `</p>`;
            }

            dayDivHTML += `</div>`;
            weekDivHTML += dayDivHTML;
        }
        weekDivHTML += `</div>`;
        calendarDivBodyHTML += weekDivHTML;
    }
    calendarDivBodyHTML += `</div>`;

    calendarDivHTML += calendarDivBodyHTML;
    calendarDivHTML += `</div>`;

    $(`.main--calendar`).append(calendarDivHTML);
}

function changeActiveDate(year, month, date) {
    // console.log(`new = ${year}, ${month}`); 
    // console.log(`active = ${activeDate.year}, ${activeDate.month}`); 
    $(`.header--navbar--title--current--date-picker--input`).val(`${year}-${(month<10)?'0'+(month+1):(month+1)}-${(date<10)?'0'+date:date}`);

    year = parseInt(year);
    month = parseInt(month);
    date = parseInt(date);

    if (year === activeDate.year && month === activeDate.month) {
        activeDate.date = date;

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
        activeDate = {
            year: year,
            month: month,
            date: date
        };

        activeDate.count = daysInMonth(activeDate.month + 1, activeDate.year);
        activeDate.monthString = getMonthString(activeDate.month);
        activeDate.startDay = new Date(activeDate.year, activeDate.month, 1).getDay();

        const newPage = findCalendarPage(year, month);
        buildCalendarDiv(newPage);
    }
}

function writeForToday() {
    let trail = `${currentDate.year}`;
    trail += `-${(currentDate.month < 10) ? `0${currentDate.month + 1}` : currentDate.month + 1}`;
    trail += `-${(currentDate.date < 10) ? `0${currentDate.date}` : currentDate.date}`;
    window.location.href = `/compose/${trail}`;
}

function moveCalendarPage(direction) {
    // console.log(`moveCalendarPage(${direction})`);
    // const newPage = (direction === "next") ? {
    //     year: (currentDate.month != 11) ? currentDate.year : currentDate.year + 1,
    //     month: (currentDate.month != 11) ? currentDate.month + 1 : 0,
    //     date: 1
    // } : {
    //     year: (currentDate.month != 0) ? currentDate.year : currentDate.year - 1,
    //     month: (currentDate.month != 0) ? currentDate.month - 1 : 11,
    //     date: 1
    // };

    // currentDate.year = newPage.year;
    // currentDate.month = newPage.month;
    // currentDate.date = newPage.date;

    if (direction === "next") {
        activeDate.year = (activeDate.month != 11) ? activeDate.year : activeDate.year + 1;
        activeDate.month = (activeDate.month != 11) ? activeDate.month + 1 : 0;
        activeDate.date = 1;
    } else {
        activeDate.year = (activeDate.month != 0) ? activeDate.year : activeDate.year - 1;
        activeDate.month = (activeDate.month != 0) ? activeDate.month - 1 : 11;
        activeDate.date = 1;
    }

    activeDate.count = daysInMonth(activeDate.month + 1, activeDate.year);
    activeDate.monthString = getMonthString(activeDate.month);
    activeDate.startDay = new Date(activeDate.year, activeDate.month, 1).getDay();

    // console.log(`activeDate.year = ${activeDate.year}`);
    // console.log(`activeDate.month = ${activeDate.month}`);
    // console.log(`activeDate.date = ${activeDate.date}`);

    // console.log(`newPage.year = ${newPage.year}`);
    // console.log(`newPage.month = ${newPage.month}`);

    let activeCalendarPage = findCalendarPage(activeDate.year, activeDate.month);
    // console.log(activeCalendarPage);
    buildCalendarDiv(activeCalendarPage);
}

function findCalendarPage(year, month) {
    // console.log(`-------findCalendarPage(${year}, ${month})`); 
    activeCalendarPageIndex = (year - minYear) * 12;
    activeCalendarPageIndex += (month);

    // console.log(`index`); 
    // console.log(calendarPageIndex); 

    // console.log(`-------calendarPageIndex = ${calendarPageIndex}`);

    let result = allCalendarPages[activeCalendarPageIndex];

    // console.log(result); 
    // return allCalendarPages[calendarPageIndex];
    return result;
}

function addEventListeners() {
    // `header--navbar--title--current--date-picker--input`;
    $(`.header--navbar--title--current--date-picker--input`).change(() => {
        const newDate = $(`.header--navbar--title--current--date-picker--input`).val().split(`-`);

        console.log(`newDate = ${newDate}`);

        const date = {
            year: newDate[0],
            month: newDate[1] - 1,
            date: newDate[2]
        };

        changeActiveDate(date.year, date.month, date.date);

    });
}

// findCalendarPage(1)