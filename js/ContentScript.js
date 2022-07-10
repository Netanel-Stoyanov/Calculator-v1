let selectionEndTimeout = null;

function createCalculateDiv() {
    const calculateContainer = document.createElement('div');
    const calculateImage = document.createElement('img');

    calculateContainer.id = "calculateDivNew";

    calculateContainer.style.position = "fixed";

    calculateContainer.style.cursor = "pointer";

    calculateContainer.style.display = "none";

    calculateContainer.style.zIndex = "9999999999999999999999";

    calculateImage.id = "calculateImg";

    calculateImage.src = chrome.runtime.getURL("../asset/image/calculate-img.svg");

    calculateContainer.addEventListener('mouseover', () => {
        document.getElementById("calculateImg").setAttribute("src", chrome.runtime.getURL("../asset/image/calculate-hover.svg"));
    })

    calculateContainer.addEventListener('mouseout', () => {
        document.getElementById("calculateImg").setAttribute("src", chrome.runtime.getURL("../asset/image/calculate-img.svg"));
    })

    calculateContainer.appendChild(calculateImage);

    document.body.insertAdjacentElement('afterbegin', calculateContainer);
}

function createOpenCalculatorPopUpDiv() {
    let styleElement = document.createElement('style');
    styleElement.innerHTML = `
            .container-special {
            position: fixed;
            z-index : 999999999999999999999;
            display : none;
            }

.second-container {
    height: 153px;
    width: 475px;
    border-radius: 10px;
    box-shadow: 0 0 34px 0 #00000059;
    background: white;
}

.ml-arrow {
    margin-left: 99px;
    margin-top: -18px;
    position: absolute;
}


.img-extension {
    margin-top: 8px;
    margin-right: 6px;
}
.image-holder {
    display: flex;
    justify-content: space-between;
}

.text {
    margin-top: 28px;
    margin-left: 19px;
    font-family: Inter, sans-serif;
    font-size: 24px;
    font-weight: 900;
    line-height: 29px;
    text-align: left;
    color: #333333;
    cursor: default;
}

.description {
    margin-left: 19px;
    font-family: Inter, sans-serif;
    font-size: 18px;
    font-weight: 900;
    line-height: 29px;
    text-align: left;
    color: #333333;
    cursor: default;
}

.footer {
    height: 71px;
    margin-top: 4px;
    background: #F5F5F5;
    border-radius: 0 0 10px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.selected-number {
    font-family: Inter, sans-serif;
    font-size: 30px;
    font-weight: 600;
    line-height: 36px;
    text-align: left;
    color: #434343;
}

.selector {
    position: absolute;
    z-index: 8;
    margin-left: 337px;
    margin-top: 48px;
}
            `;
    styleElement.setAttribute('type', "text/css");
    document.head.insertAdjacentElement('beforeend', styleElement);

    const div = document.createElement('div');

    div.id = "solutionButton";
    div.classList.add('container-special');

    div.innerHTML = `
    <img class="ml-arrow" src="${chrome.runtime.getURL("../asset/image/tri.svg")}" alt="tri"/>
    <div class="second-container">
        <div class="selector">
            <img src="${chrome.runtime.getURL("../asset/image/selector.svg")}" alt="selector"/>
        </div>
        <div class="image-holder">
            <div class="text">To get the solution</div>
            <img class="img-extension" src="${chrome.runtime.getURL("../asset/image/extension-image.svg")}" alt="extension"/>
        </div>
        <div class="description">
            open the extension in the toolbar
        </div>
        <div class="footer">
            <div id="text-for-selected-number" class="selected-number"></div>
        </div>
    </div>
    `

    document.body.insertAdjacentElement("afterbegin", div);
}

function bindFuncToCalculateBtn() {
    let selection = window.getSelection();
    let oRange = selection.getRangeAt(0);
    let oRect = oRange.getBoundingClientRect();

    let width = oRect.right - oRect.left;
    let height = oRect.bottom - oRect.top;

    const calculateButton = document.getElementById("calculateDivNew");

    const newButtonClick = document.getElementById("solutionButton");
    newButtonClick.style.top = (oRect.y + height + 20).toString() + "px";
    newButtonClick.style.left = ((oRect.x - 115) + (width / 2)).toString() + "px";
    document.getElementById("text-for-selected-number").innerHTML = window.getSelection().toString().trim();
    calculateButton.style.display = "none";
    newButtonClick.style.display = "block";
}

function checkIfSelectionGotANNumberOrMath() {
    let regExp = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d\s]*$/g;
    if (regExp.test(window.getSelection().toString().trim()) && window.getSelection().toString().trim() !== ""
        && window.getSelection().toString().trim() !== " ") {

        let selection = window.getSelection();
        let oRange = selection.getRangeAt(0);
        let oRect = oRange.getBoundingClientRect();

        let width = oRect.right - oRect.left;
        let height = oRect.bottom - oRect.top;

        const calculateButton = document.getElementById("calculateDivNew");

        if (calculateButton) {
            calculateButton.style.top = (oRect.y + height + 10).toString() + "px";
            calculateButton.style.left = ((oRect.x - 80) + (width / 2)).toString() + "px";
            calculateButton.style.display = "block";
            calculateButton.addEventListener('click', bindFuncToCalculateBtn)
        }
    }
}

function userSelectionChanged() {
    if (selectionEndTimeout !== null) {
        clearTimeout(selectionEndTimeout);
    }

    selectionEndTimeout = setTimeout(function () {
        checkIfSelectionGotANNumberOrMath();
    }, 500);
}

function funcToScrollAndResizeEvent() {
    const button = document.getElementById("calculateDivNew");
    const solution = document.getElementById("solutionButton");
    if (button.style.display === "block") {
        button.style.display = "none";
    }

    if (solution.style.display === "block") {
        solution.style.display = "none";
        solution.removeEventListener('click', bindFuncToCalculateBtn)
    }
}

function addEventListenerToWindow() {
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

        // const solutionDiv = document.getElementById("solutionButton");
        // const calculateSolution = event.target.closest("#solutionButton");
        //
        // if (solutionDiv) {
        //     if (!calculateSolution) {
        //         if (document.getElementById("solutionButton").style.display === "block") {
        //             document.getElementById("solutionButton").style.display = "none";
        //             solutionDiv.removeEventListener('click', bindFuncToCalculateBtn)
        //         }
        //     }
        // }

    })

    document.addEventListener('selectionchange', () => {
        userSelectionChanged();
    });

    window.addEventListener('scroll', () => {
        funcToScrollAndResizeEvent();
    })

    window.addEventListener('resize', () => {
        funcToScrollAndResizeEvent();
    })
}

function init() {
    createCalculateDiv();
    createOpenCalculatorPopUpDiv();
    addEventListenerToWindow()
}

init();