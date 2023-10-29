const total = document.getElementById("total");

let runningTotal = 0;

let pht = document.getElementById("plusHistoryTable");
let mht = document.getElementById("minusHistoryTable");

let percValue = [];

let plusHistoryNumbers = [];
let minusHistoryNumbers = [];

const percentagesButton = document.getElementById("percentagesButton");

const amount = document.getElementById("amount");
const keys = document.querySelectorAll(".key");
const deleteKey = document.getElementById("buttonDelete");

const plusButton = document.getElementById("plus");
const minusButton = document.getElementById("minus");

// Keypad buttons
document.addEventListener("DOMContentLoaded", () => {
  restoreState();

  amount.value = "$";

  // Update input field value
  keys.forEach((key) => {
    key.addEventListener("click", () => {
      if (!key.classList.contains("percentageTime")) {
        const value = key.getAttribute("data-value");
        amount.value += value;

        percentagesButton.classList.add("active");
      } else if (percValue.length <= 1) {
        //////percentage calculator
        const value = key.getAttribute("data-value");
        percValue.push(value);
        amount.value += value;
      }
    });
  });

  // Delete button
  deleteKey.addEventListener("click", () => {
    if (!deleteKey.classList.contains("inactive")) {
      if (amount.value.length > 1) {
        amount.value = amount.value.slice(0, -1);
      }
      if (amount.value.length === 1) {
        percentagesButton.classList.remove("active");
        percentagesButton.classList.remove("selected");
        togglePercTime("off");
      }
    } else if (percValue.length > 0) {
      percValue.pop();
      amount.value = amount.value.slice(0, -1);
      console.log(parseFloat(percValue));
    }
  });
});

// main function when button is pressed
//#1
function addToHistory(
  plusOrMinusNumbers,
  plusOrMinusTable,
  plusOrMinus,
  restore
) {
  let result;

  if (amount.value.indexOf("%") === amount.value.length - 1) {
    return;
  }

  if (amount.value.includes("%") && plusOrMinus !== "minus") {
    let percentIndex = amount.value.indexOf("%");
    let amountNumber = Number(amount.value.substring(1, percentIndex));
    let percValueNumber = Number(percValue.join("")) / 100;
    result = amountNumber * percValueNumber;

    plusOrMinusNumbers.unshift(result);
  } else if ((amount.value !== "$" || restore) && percValue.length === 0) {
    plusOrMinusNumbers.unshift(amount.value.substring(1));
  } else if (minusButton.classList.contains("inactive")) {
    return;
  }

  if (!restore) {
    submitButton(plusOrMinus, result);
  }

  updateHistoryTable(
    plusOrMinusNumbers,
    plusOrMinusTable,
    plusOrMinus,
    restore
  );

  if (!restore) {
    saveState();
  }
}

// Submit button
//#2
function submitButton(plusOrMinus, result) {
  // put into total
  let inputValue = parseFloat(amount.value.substring(1));

  // plus to total
  if (plusOrMinus == "plus" && percValue.length < 1) {
    runningTotal += inputValue;
    total.innerHTML = "$" + runningTotal.toFixed(2);
    //console.log("you pressed plus");
  }

  // minus from total
  else if (plusOrMinus == "minus" && percValue.length < 1) {
    runningTotal -= inputValue;
    total.innerHTML = "$" + runningTotal.toFixed(2);
    //console.log("you pressed minus");
  } else if (plusOrMinus == "plus" && percValue.length > 0) {
    runningTotal += result;
    total.innerHTML = "$" + runningTotal.toFixed(2);
  }

  //console.log("running total: " + runningTotal);
  //console.log(result);
  //console.log("plushistorynumbers: " + plusHistoryNumbers);

  amount.value = "$";
  percValue = [];

  //percentage functions
  percentagesButton.classList.remove("selected");
  percentagesButton.classList.remove("active");
  togglePercTime("off");
}

//update history table
//#3
function updateHistoryTable(
  plusOrMinusNumbers,
  plusOrMinusTable,
  plusOrMinus,
  restore
) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  plusOrMinusNumbers.forEach((number, index) => {
    const formattedNumber = parseFloat(number).toFixed(2);

    const tr = document.createElement("tr");
    const td = document.createElement("td");

    // create delete button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.id = "deleteHistoryButton";
    removeBtn.addEventListener("click", function () {
      removeHistoryFunction(index, number, plusOrMinus);
    });

    //text to add to td
    let textNode;
    if (plusOrMinus == "plus") {
      textNode = document.createTextNode("$" + formattedNumber);
    } else if (plusOrMinus == "minus" && percValue < 1) {
      textNode = document.createTextNode("-" + "$" + formattedNumber);
    }

    //update table
    td.appendChild(textNode);
    td.appendChild(removeBtn);
    tr.appendChild(td);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  plusOrMinusTable.innerHTML = "";
  plusOrMinusTable.appendChild(table);

  //console.log(plusHistoryTable);
  //console.log("plus numbers: " + plusHistoryNumbers);
  //console.log("minus numbers: " + minusHistoryNumbers);
}

//delete history button
function removeHistoryFunction(index, number, plusOrMinus) {
  if (plusOrMinus == "plus") {
    //remove number from plus table
    plusHistoryNumbers.splice(index, 1);
    updateHistoryTable(plusHistoryNumbers, plusHistoryTable, "plus");

    //remove number from total
    runningTotal -= parseFloat(number);
    total.innerHTML = "$" + runningTotal.toFixed(2);
  } else {
    minusHistoryNumbers.splice(index, 1);
    updateHistoryTable(minusHistoryNumbers, minusHistoryTable, "minus");

    runningTotal += parseFloat(number);
    total.innerHTML = "$" + runningTotal.toFixed(2);
  }
  //console.log(runningTotal);

  saveState();
  updateUI();
}

// percentages function
function percentagesFunction() {
  if (percentagesButton.classList.contains("active")) {
    percentagesButton.classList.toggle("selected");

    togglePercTime("toggle");
  }
}

// percentage time function
function togglePercTime(offOrOn) {
  if (offOrOn == "off") {
    document.querySelectorAll(".key").forEach((element) => {
      element.classList.remove("percentageTime");
    });
    deleteKey.classList.remove("inactive");
    //plusButton.classList.remove('inactive');
    minusButton.classList.remove("inactive");
  } else if (offOrOn == "toggle") {
    document.querySelectorAll(".key").forEach((element) => {
      element.classList.toggle("percentageTime");
    });

    if (!amount.value.includes("%")) {
      amount.value += "%";

      deleteKey.classList.add("inactive");

      //plusButton.classList.add('inactive');
      minusButton.classList.add("inactive");
    } else {
      amount.value = amount.value.replace("%", "");
      deleteKey.classList.remove("inactive");

      //plusButton.classList. remove('inactive');
      minusButton.classList.remove("inactive");

      if (percValue.length > 0) {
        amount.value = amount.value.slice(0, -percValue.length);
        percValue = [];

        console.log(percValue);
      }
    }
  }
}

// Reset state button
function resetState() {
  if (confirm("Are you sure you want to reset all?")) {
    localStorage.removeItem("plusHistoryNumbers");
    localStorage.removeItem("minusHistoryNumbers");
    localStorage.removeItem("runningTotal");

    plusHistoryNumbers = [];
    minusHistoryNumbers = [];
    runningTotal = 0;
    amount.value = "$";
    total.innerHTML = "$";

    updateUI();
  } else {
    return;
  }
}

// Save the state
function saveState() {
  localStorage.setItem(
    "plusHistoryNumbers",
    JSON.stringify(plusHistoryNumbers)
  );
  localStorage.setItem(
    "minusHistoryNumbers",
    JSON.stringify(minusHistoryNumbers)
  );
  localStorage.setItem("runningTotal", runningTotal);
}

// Load the state
function restoreState() {
  // JSON.parse to convert the stored JSON string back into an array
  plusHistoryNumbers =
    JSON.parse(localStorage.getItem("plusHistoryNumbers")) || [];
  minusHistoryNumbers =
    JSON.parse(localStorage.getItem("minusHistoryNumbers")) || [];

  // parseFloat to convert the stored string value of runningTotal back into a number
  runningTotal = parseFloat(localStorage.getItem("runningTotal")) || 0;

  updateUI();
}

// update the ui
function updateUI() {
  // Update the total display
  total.innerHTML = "$" + runningTotal.toFixed(2);

  // Update the plus history table
  updateHistoryTable(plusHistoryNumbers, plusHistoryTable, "plus");

  // Update the minus history table
  updateHistoryTable(minusHistoryNumbers, minusHistoryTable, "minus");
}

//TODO: in percentTime: when key is pressed, delete and plus amd minus buttons become active.

//TODO://BUG: percentage only adds to plus, not minus.

//bug: reopening page in codepen shows '$'

//CSS TODO: make plus minus buttons on the side of amount.value

//BUG: refresh breaks page
// only happens in spck
