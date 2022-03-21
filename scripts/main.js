let tipPercentage;
let billAmount;
let people;

let selectedTip;

const tipButtons = document.querySelectorAll('.section-tips .wrapper-tips button');

const bill = document.getElementById('bill');
const peopleElement = document.getElementById('people');
const customTip = document.getElementById('customTip');

const billError = document.querySelector('.section-tips span.bill-error');
const peopleError = document.querySelector('.section-tips span.people-error');

const resetButton = document.querySelector('.reset button');

// Adding a click event for each tips button for selecting 
for (const tipButton of tipButtons) {
    tipButton.addEventListener('click', () => {

        // Checking weather the same tips button clicking to ignore the process
        if (selectedTip !== tipButton) {
            tipButton.classList.add('active');

            // If the user change selected tip button then reverting previous selection 
            if (selectedTip) {
                selectedTip.classList.remove('active');
            }
            selectedTip = tipButton;
            tipPercentage = tipButton.textContent.slice(0, tipButton.textContent.length - 1);

            // Checking other fields are already entered
            if (billAmount && people) {
                calcAmount();
            }

            // Clearing custom tips field if any
            clearCustomTipField();
        }
    });
}

function clearCustomTipField() {
    if (customTip.validity.valid) {
        customTip.value = '';
    } else if (customTip.classList.contains('invalid')) {
        customTip.classList.remove('invalid');
    }
}

bill.addEventListener('input', () => {
    if (bill.validity.valid) {
        billAmount = bill.value;

        // Checking other fields are already entered
        if (tipPercentage && people) {
            calcAmount();
        }

        // Removing validation error if any
        if (bill.classList.contains('invalid')) {
            bill.classList.remove('invalid');
            billError.textContent = '';
            billError.classList.remove('error');
        }
    } else {

        // Reset amount and totals
        billAmount = null;
        clearTotalAmountFields();

        // Displaying validation error
        bill.classList.add('invalid');
        if (bill.validity.valueMissing) {
            billError.textContent = 'Bill required';
            billError.classList.add('error');
        } else if (bill.validity.rangeOverflow) {
            billError.textContent = 'Bill exceeds $100000';
            billError.classList.add('error');
        } else if (bill.validity.rangeUnderflow) {
            billError.textContent = 'Bill required';
            billError.classList.add('error');
        }
    }
});

function clearTotalAmountFields() {
    document.querySelector('.tip-amount .amount span').textContent = '$0.00';
    document.querySelector('.total-amount .amount span').textContent = '$0.00';
    resetButton.setAttribute('disabled', '');
}

peopleElement.addEventListener('input', () => {
    if (peopleElement.validity.valid) {
        people = peopleElement.value;

        // Checking other fields are already entered
        if (tipPercentage && billAmount) {
            calcAmount();
        }

        // Removing validation error
        if (peopleElement.classList.contains('invalid')) {
            peopleElement.classList.remove('invalid');
            peopleError.textContent = '';
            peopleError.classList.remove('error');
        }
    } else {
        people = null;
        clearTotalAmountFields();

        // Displaying validation error
        peopleElement.classList.add('invalid');
        if (peopleElement.validity.valueMissing) {
            peopleError.textContent = 'Required'
            peopleError.classList.add('error');
        } else if (peopleElement.validity.rangeUnderflow) {
            peopleError.textContent = 'Can\'t be zero';
            peopleError.classList.add('error');
        } else if (peopleElement.validity.stepMismatch) {
            peopleError.textContent = 'Invalid number';
            peopleError.classList.add('error');
        }
    }
});

customTip.addEventListener('input', () => {
    // Checking wheather user already selected tips button if so deselect
    if (selectedTip) {
        clearTipSelection();
    }

    if (customTip.validity.valid && customTip.value && customTip.value > 0) {
        tipPercentage = customTip.value;

        // Checking other fields are already entered
        if (billAmount && people) {
            calcAmount();
        }
        customTip.classList.remove('invalid');
    } else {
        tipPercentage = null;
        clearTotalAmountFields();
        // Displaying validation error
        customTip.classList.add('invalid');
    }
});

function clearTipSelection() {
    selectedTip.classList.remove('active');
    selectedTip = null;
    tipPercentage = 0;
}

function calcAmount() {
    const tipPerPerson = document.querySelector('.tip-amount .amount span')
    const totalPerPerson = document.querySelector('.total-amount .amount span')

    const totalTip = billAmount * tipPercentage / 100;
    const totalBill = Number(billAmount) + totalTip;

    tipPerPerson.textContent = `$${(totalTip / people).toFixed(2)}`;
    totalPerPerson.textContent = `$${(totalBill / people).toFixed(2)}`;

    resetButton.removeAttribute('disabled');
}

// Reset
resetButton.addEventListener('click', () => {
    // Checking wheather user already selected tips button if so deselect
    if (selectedTip) {
        clearTipSelection();
    }

    tipPercentage = null;
    billAmount = null;
    people = null;

    bill.value = '';
    peopleElement.value = '';

    clearTotalAmountFields();
    clearCustomTipField();
});