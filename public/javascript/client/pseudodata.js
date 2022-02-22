console.log(`RUNNING pseudodata.js`);

function addEntriesToCalendarPages() {
    entryDB.forEach((entry, index) => {
        console.log(entry.stamp.date.year); 
        console.log(entry.stamp.date.month); 
        let calendarPage = findCalendarPage(entry.stamp.date.year, entry.stamp.date.month);
        let selectedDate = calendarPage.findIndex((pageEntry) => {
            return pageEntry.month === entry.stamp.date.month && pageEntry.date === entry.stamp.date.date;
        });


        console.log(`entryDB`); 
        console.log(calendarPage);
        console.log(selectedDate);  

        allCalendarPages[activeCalendarPageIndex][selectedDate].post = entry;
        console.log(allCalendarPages[activeCalendarPageIndex][selectedDate]); 

    });
}

addEntriesToCalendarPages();