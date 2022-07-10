let selectionEndTimeout = null;

function createCalculateDiv() {
    const calculateContainer = document.createElement('div');
    const calculateImage = document.createElement('img');

    calculateContainer.id = "calculateDivNew";

    calculateContainer.style.position = "fixed";

    calculateContainer.style.cursor = "pointer";

    calculateContainer.style.display = "none";

    calculateContainer.style.zIndex = "9999999999999999999999";

    calculateImage.src = chrome.runtime.getURL("../asset/image/calculate-img.svg");

    calculateContainer.appendChild(calculateImage);

    document.body.insertAdjacentElement('afterbegin',calculateContainer);
}

function checkIfSelectionGotANNumberOrMath(str) {
    let regExp = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d\s]*$/g;
    if (regExp.test(window.getSelection().toString().trim()) && window.getSelection().toString().trim() !== ""
        && window.getSelection().toString().trim() !== " ") {

        console.log(window.getSelection())
        let selection = window.getSelection();
        let oRange = selection.getRangeAt(0);
        let oRect = oRange.getBoundingClientRect();

        let width = oRect.right - oRect.left;
        let height = oRect.bottom - oRect.top;

        const calculateButton = document.getElementById("calculateDivNew");

        if (calculateButton) {
            calculateButton.style.top = (oRect.y + height + 10).toString() + "px";
            calculateButton.style.left = ((oRect.x)).toString() + "px";
            calculateButton.style.display = "block";
        }
    }
}

function userSelectionChanged() {
    if (selectionEndTimeout !== null) {
        clearTimeout(selectionEndTimeout);
    }

    selectionEndTimeout = setTimeout(function () {
        checkIfSelectionGotANNumberOrMath(getSelection());
    }, 500);
}

window.addEventListener("click", (event) => {
    const button = document.getElementById("calculateDivNew");
    const calculateButton = event.target.closest("#calculateDivNew");
    if (button) {
        if (!calculateButton) {
            if (document.getElementById("calculateDivNew").style.display === "block") {
                document.getElementById("calculateDivNew").style.display = "none";
            }
        }
    }
})

document.addEventListener('selectionchange', (event) => {
    userSelectionChanged();
});

window.addEventListener('scroll', () => {
    const button = document.getElementById("calculateDivNew");
    if (button.style.display === "block") {
        button.style.display = "none";
    }
})

function init() {
    createCalculateDiv();
}

init();