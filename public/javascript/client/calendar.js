// Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
// but by using 0 as the day it will give us the last day of the prior
// month. So passing in 1 as the month number will return the last day
// of January, not February
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

let currentDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
    day: new Date().getDay(),
};

let activeDate = {};

// 6 Rows needed w/ 7 Columns
function getCalendarPage(year, month, date) {
    let result = [];
    const actives = new Date(year, month, date);
    activeDate = {
        year: year,
        month: month,
        date: date
    };

    function getMonthString(month) {
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

    currentDate = {
        month: actives.getMonth(),
        date: actives.getDate(),
        year: actives.getFullYear(),
        day: actives.getDay(),
    };

    currentDate.monthString = getMonthString(currentDate.month),
        currentDate.day = new Date(currentDate.year, currentDate.month, currentDate.date).getDay();

    console.log(`currentDate:`);
    console.log(currentDate);

    const currentMonth = {
        month: currentDate.month,
        year: currentDate.year,
    }

    currentMonth.count = daysInMonth(currentDate.month + 1, currentDate.year);
    currentMonth.monthString = getMonthString(currentMonth.month);
    currentMonth.startDay = new Date(currentDate.year, currentDate.month, 1).getDay();

    console.log(`currentMonth:`);
    console.log(currentMonth);

    const prevMonth = {
        month: (currentDate.month != 0) ? currentDate.month - 1 : 11,
        year: (currentDate.month != 0) ? currentDate.year : currentDate.year - 1,
    }
    const nextMonth = {
        month: (currentDate.month != 11) ? currentDate.month + 1 : 0,
        year: (currentDate.month != 11) ? currentDate.year : currentDate.year + 1,
    }
    prevMonth.count = daysInMonth(prevMonth.month + 1, prevMonth.year);
    prevMonth.monthString = getMonthString(prevMonth.month);
    nextMonth.count = daysInMonth(nextMonth.month + 1, nextMonth.year);
    nextMonth.monthString = getMonthString(nextMonth.month);
    nextMonth.startDay = new Date(nextMonth.year, nextMonth.month, 1).getDay();

    console.log(`prevMonth:`);
    console.log(prevMonth);
    console.log(`nextMonth:`);
    console.log(nextMonth);

    const startDate = (currentMonth.startDay === 0) ? {
        month: currentMonth.month,
        date: 1,
        year: currentMonth.year,
        day: 0
    } : {
        month: prevMonth.month,
        date: prevMonth.count - currentMonth.startDay + 1,
        year: prevMonth.year,
        day: 0
    };
    const endDate = {
        month: nextMonth.month,
        date: 42 - currentMonth.count - currentMonth.startDay,
        year: nextMonth.year,
        day: 6
    };

    console.log(`startDate:`);
    console.log(startDate);
    console.log(`endDate:`);
    console.log(endDate);

    // -* We get the trailing days from the previous month
    if (currentMonth.startDay != 0) {
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

    // -* Now we add the current month
    for (let i = 1, j = currentMonth.startDay; i <= currentMonth.count; i++, j++) {
        j = (j <= 6) ? j : 0;
        result.push({
            month: currentMonth.month,
            monthString: currentMonth.monthString,
            date: i,
            year: currentMonth.year,
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

    buildCalendarDiv(result);
}

function buildCalendarDiv(currentPage) {
    console.log(`buildCalendarDiv()`);

    $(`.calendar`).remove();

    $(`.header--navbar--title--current`).html(`${currentDate.monthString} ${currentDate.year}`);

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
            const dateFunction = (currentDate.month === currentPage[t].month) ? `onclick="changeActiveDate(${currentPage[t].year},${currentPage[t].month},${currentPage[t].date})"` : `onclick="getCalendarPage(${currentPage[t].year},${currentPage[t].month},${currentPage[t].date})"`;

            const dayClass = (currentPage[t].date === currentDate.date && currentPage[t].month === currentDate.month) ? `active` : (currentPage[t].month === currentDate.month) ? `current` : `noncurrent`;
            let dayDivHTML = `<div class="calendar--day calendar--day--${dayClass} calendar--week-${i}--day calendar--week-${i}--day-${k} date--${currentPage[t].year}-${currentPage[t].month}-${currentPage[t].date}" ${dateFunction}>`;
            dayDivHTML += `<p class="calendar--day--date">`;
            dayDivHTML += `${currentPage[t].monthString.slice(0,3)} ${currentPage[t].date}`;
            dayDivHTML += `</p>`;
            // dayDivHTML += `<p>Day Title</p>`;
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
    if ($(`.date--${year}-${month}-${date}`).hasClass(`calendar--day--active`)) {
        month++;
        let trail = `${year}`;
        trail += `-${(month < 10) ? `0${month}` : month}`;
        trail += `-${(date < 10) ? `0${date}` : date}`;
        console.log(`trail = ${trail}`); 
        window.location.href = `/compose/${trail}`;
    } else {
        $(`.calendar--day--active`).addClass(`calendar--day--current`);
        $(`.calendar--day--active`).removeClass(`calendar--day--active`);

        activeDate = {
            year: year,
            month: month,
            date: date
        };

        $(`.date--${year}-${month}-${date}`).addClass(`calendar--day--active`);
        $(`.date--${year}-${month}-${date}`).removeClass(`calendar--day--current`);
    }
}

let activeChosenAlready = false;

function moveCalendarPage(direction) {
    const newPage = (direction === "next") ? {
        year: (currentDate.month != 11) ? currentDate.year : currentDate.year + 1,
        month: (currentDate.month != 11) ? currentDate.month + 1 : 0,
        date: 1
    } : {
        year: (currentDate.month != 0) ? currentDate.year : currentDate.year - 1,
        month: (currentDate.month != 0) ? currentDate.month - 1 : 11,
        date: 1
    };

    getCalendarPage(newPage.year, newPage.month, newPage.date);
}


// getCalendarPage(1998,11,21);
// getCalendarPage(2021, 7, 17);
getCalendarPage(currentDate.year, currentDate.month, currentDate.date);