const calculatorInput = document.getElementById("calculation-text");
const oneButton = document.getElementById("one-button");
const twoButton = document.getElementById("two-button");
const threeButton = document.getElementById("three-button");
const fourButton = document.getElementById("four-button");
const fiveButton = document.getElementById("five-button");
const sixButton = document.getElementById("six-button");
const sevenButton = document.getElementById("seven-button");
const eightButton = document.getElementById("eight-button");
const nineButton = document.getElementById("nine-button");
const zeroButton = document.getElementById("zero-button");
const plusButton = document.getElementById("plus-button");
const minusButton = document.getElementById("minus-button");
const divideButton = document.getElementById("divide-button");
const multiButton = document.getElementById("multi-button");
const evenButton = document.getElementById("even-button");
const negativeButton = document.getElementById("negative-button");
const cButton = document.getElementById("c-button");
const procentButton = document.getElementById("prosent-button");
const commaDiv = document.getElementById('comma');
let sum = 0;
let isLimitLengthOfNumber = false;
let value = "";
let operation = "";
let inOperation = false;
let noEven = false;
let Clicked = false;
let evenClicked = false;

function createHistoryElement(value) {
    const historyContainer = document.getElementById("history-container");

    const historyElement = document.createElement('div');

    historyElement.classList.add("history-element");

    const arrowImg = document.createElement('img');

    arrowImg.classList.add("img-arrow-history");
    arrowImg.src = "../asset/image/arrow-circle.svg";
    arrowImg.alt = "arrow";

    arrowImg.addEventListener('click', () => {
        sum = value.split("=")[1];
        inOperation = false;
        noEven = false;
        calculatorInput.innerHTML = sum;
    })

    const calculationString = document.createElement("div");
    calculationString.classList.add("calculation");
    calculationString.innerHTML = value;

    historyElement.appendChild(arrowImg);
    historyElement.appendChild(calculationString);

    historyContainer.insertAdjacentElement('afterbegin', historyElement);
}

function putHistoryElementToUi() {
    chrome.storage.local.get("history", (result) => {
        if (result.history) {
            result.history.forEach(value => {
                createHistoryElement(value);
            })
        }
    })
}

function putHistoryElementToStorage(element) {
    chrome.storage.local.get("history", (result) => {
        if (result.history) {
            const newHistory = [...result.history, element];
            chrome.storage.local.set({"history" : newHistory}).then();
        }
    })
}

function setCommaListener() {
    commaDiv.addEventListener("mouseover", () => {
        document.getElementById("comma-img").setAttribute("src", "../asset/image/comma-hover.svg");
    })

    commaDiv.addEventListener("mouseout", () => {
        document.getElementById("comma-img").setAttribute("src", "../asset/image/comma.svg");
    })

    commaDiv.addEventListener("click", () => {
        if (sum.toString().indexOf('.') === -1) {
            sum += ".";
            calculatorInput.innerHTML = sum;
        }
    })
}

function setFontSize() {
    if (calculatorInput.innerHTML.length >= 8 && calculatorInput.innerHTML.length < 13) {
        calculatorInput.style.fontSize = "40px";
        calculatorInput.style.lineHeight = "48px";
    }
    if (calculatorInput.innerHTML.length >= 13) {
        calculatorInput.style.fontSize = "20px";
        calculatorInput.style.lineHeight = "28px";
    }
    if (calculatorInput.innerHTML.length <= 7) {
        calculatorInput.style.fontSize = "70px";
        calculatorInput.style.lineHeight = "85px";
    }
}

observer = new MutationObserver(function() {
    setFontSize()
    isLimitLengthOfNumber = calculatorInput.innerHTML.length >= 27;
});

observer.observe(calculatorInput, {characterData: false, childList: true, attributes: false})

function createOperation(val1, val2) {
    if (operation === "+") {
        return val1 + val2;
    }
    if (operation === "-") {
        return val1 - val2;
    }
    if (operation === "*") {
        return val1 * val2;
    }
    if (operation === "/") {
        return val1 / val2;
    }
}

function calculate(operationVal) {
    if (!Clicked) {
        isLimitLengthOfNumber = false;
        if (!inOperation && !noEven) {
            value = sum;
            operation = operationVal;
            inOperation = true;
            noEven = true;
            Clicked = true;
        } else {
            isLimitLengthOfNumber = false;
            const saveLastSum = sum;
            sum = createOperation(parseFloat(value), parseFloat(sum))
            inOperation = true;
            putHistoryElementToStorage(value + operation + saveLastSum + "=" + sum);
            createHistoryElement(value + operation + saveLastSum + "=" + sum)
            if (operationVal !== operation) {
                operation = operationVal;
            }
            value = sum;
            calculatorInput.innerHTML = sum;
            Clicked = true;
        }
    }
}

function numberChoiceCases(number) {
    if (!isLimitLengthOfNumber) {
        if (inOperation) {
            sum = number;
            calculatorInput.innerHTML = sum;
            if (Clicked) {
                Clicked = false;
            }
            if (evenClicked) {
                evenClicked = false;
            }
            inOperation = false;
        } else if (sum === 0) {
            sum = number;
            calculatorInput.innerHTML = sum;
            if (Clicked) {
                Clicked = false;
            }
            inOperation = false;
        } else {
            sum += number;
            calculatorInput.innerHTML = sum;
            if (Clicked) {
                Clicked = false;
            }
            inOperation = false;
        }
    }

}

function handleZeroOperation() {
    if (!isLimitLengthOfNumber){
        if (inOperation) {
            sum = "0";
            calculatorInput.innerHTML = sum;
            if (Clicked) {
                Clicked = false;
            }
            if (evenClicked) {
                evenClicked = false;
            }
            inOperation = false;
        }
        if (sum !== 0) {
            sum += "0";
            calculatorInput.innerHTML = sum;
        }
    }

}

function handleNegativeOperation() {
    if (Math.sign(parseFloat(sum)) === 1) {
        sum = "" + -Math.abs(parseFloat(sum));
        calculatorInput.innerHTML = sum;
    } else if (Math.sign(parseFloat(sum)) === -1) {
        sum = "" + Math.abs(parseFloat(sum));
        calculatorInput.innerHTML = sum;
    }
}

function handleEvenOperation() {
    if (!evenClicked) {
        const saveLastSum = sum;
        sum = createOperation(parseFloat(value), parseFloat(sum))
        putHistoryElementToStorage(value + operation + saveLastSum + "=" + sum);
        createHistoryElement(value + operation + saveLastSum + "=" + sum)
        calculatorInput.innerHTML = sum;
        noEven  = false;
        inOperation = false;
        evenClicked = true;
    }
}

function resetOperation() {
    sum = 0;
    value = "";
    operation = "";
    inOperation = false;
    noEven = false;
    Clicked = false;
    calculatorInput.innerHTML = sum;
}

function handleProcentOperation() {
    const saveLastSum = sum;
    sum = sum / 100;
    putHistoryElementToStorage(saveLastSum + "/" + 100 + "=" + sum);
    createHistoryElement(saveLastSum + "/" + 100 + "=" + sum)
    inOperation = false;
    noEven = false;
    calculatorInput.innerHTML = sum;
}

function setOnClick() {
    plusButton.addEventListener("click", () => {
        calculate("+")
    })

    minusButton.addEventListener("click", () => {
        calculate("-")
    })

    divideButton.addEventListener("click", () => {
        calculate("/")
    })

    multiButton.addEventListener("click", () => {
        calculate("*")
    })

    procentButton.addEventListener("click", () => {
        handleProcentOperation();
    })

    negativeButton.addEventListener("click", () => {
        handleNegativeOperation();
    })

    evenButton.addEventListener("click", () => {
        handleEvenOperation();
    })

    cButton.addEventListener("click", () => {
        resetOperation();
    })

    oneButton.addEventListener('click', () => {
        numberChoiceCases("1");
    })

    twoButton.addEventListener('click', () => {
        numberChoiceCases("2");
    })

    threeButton.addEventListener('click', () => {
        numberChoiceCases("3");
    })

    fourButton.addEventListener('click', () => {
        numberChoiceCases("4");
    })

    fiveButton.addEventListener('click', () => {
        numberChoiceCases("5");
    })

    sixButton.addEventListener('click', () => {
        numberChoiceCases("6");
    })

    sevenButton.addEventListener('click', () => {
        numberChoiceCases("7");
    })

    eightButton.addEventListener('click', () => {
        numberChoiceCases("8");
    })

    nineButton.addEventListener('click', () => {
        numberChoiceCases("9");
    })

    zeroButton.addEventListener('click', () => {
        handleZeroOperation();
    })
}

function changeInputValue(event) {
    switch (event.key) {
        case "0" :
            handleZeroOperation();
            break;
        case "1" :
            numberChoiceCases("1");
            break;
        case "2" :
            numberChoiceCases("2");
            break;
        case "3" :
            numberChoiceCases("3");
            break;
        case "4" :
            numberChoiceCases("4");
            break;
        case "5" :
            numberChoiceCases("5");
            break;
        case "6" :
            numberChoiceCases("6");
            break;
        case "7" :
            numberChoiceCases("7");
            break;
        case "8" :
            numberChoiceCases("8");
            break;
        case "9" :
            numberChoiceCases("9");
            break;
        default:
            break;
    }
}

function setOnKeyPress() {
    window.addEventListener('keypress', (event) => {
        changeInputValue(event);
    })
}

function init() {
    putHistoryElementToUi();
    setOnClick();
    setOnKeyPress();
    setCommaListener();
    calculatorInput.innerHTML = sum;
}

init();

