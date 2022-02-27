const month = 11;
const year = 2000;

const prevMonth = {
    month: (month != 0) ? month - 1 : 11,
    year: (month != 0) ? year : year - 1,
    monthString: this.month * 2
}

let fivePages = [{
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
        month: (month > 9) ? month-10 : month + 2,
    },
];


console.log(fivePages);
// console.log(prevMonth); 