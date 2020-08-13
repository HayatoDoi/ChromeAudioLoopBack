"use strict";

const START_YEAR = 2020;
const AUTHOR = "Hayato Doi";

function PrintCopyright() {
    let year = String(START_YEAR) + "";
    let now_year = (new Date()).getFullYear();
    if (START_YEAR !== now_year) {
        year += "-" + String(now_year);
    }
    document.write(`&copy; ${year} ${AUTHOR}.`);
}
