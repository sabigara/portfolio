'use strict'

function isError(statusCode) {
    const thirdDigit = statusCode.toString().charAt(0);
    return thirdDigit !== '2';
}

function alertError(response) {
    response.text()
        .then((text) => {
            alert(text);
        })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}