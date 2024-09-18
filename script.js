"use strict";

const billInput = document.getElementById("bill-input");
const tipsEl = document.querySelectorAll(".tip");
const customTip = document.querySelector(".custom");
const peopleInput = document.getElementById("people-input");
const tipAmount = document.querySelector(".tip-output");
const totalOutput = document.querySelector(".total-output");
const resetBtn = document.querySelector(".reset");
const errorText = document.querySelector(".error-text");
const errorStatement = document.querySelector(".error-statement");

let billAmount = 0;
let tipPercent = 0;
let customPercent = 0;
let peopleNmb = 0;

const clearErrors = () => {
  errorStatement.classList.remove("active");
  errorText.classList.remove("active");
};

const resetValues = () => {
  tipAmount.innerHTML = "$0.00";
  totalOutput.innerHTML = "$0.00";
  customPercent = 0;
  peopleNmb = 0;
  customTip.value = "";
  billInput.value = "";
  peopleInput.value = "";
  tipsEl.forEach((tip) => tip.classList.remove("active"));
};

const calculateValues = () => {
  const tipValue = Number(
    (billAmount * (customPercent || tipPercent)) / 100 / peopleNmb
  );
  const roundedTipValue = Math.ceil(tipValue * 100) / 100;

  const roundedTotalValue = Math.ceil((billAmount / peopleNmb) * 100) / 100;

  return {
    roundedTipValue,
    roundedTotalValue,
  };
};

const updateHTML = (roundedTipValue, roundedTotalValue) => {
  tipAmount.innerText = `$${roundedTipValue.toFixed(2)}`;
  totalOutput.innerHTML = `$${(
    roundedTotalValue + Number(roundedTipValue)
  ).toFixed(2)}`;
};

const calculateTips = () => {
  billInput.addEventListener("input", (e) => {
    billAmount = `${e.target.value}`;

    if (billAmount) resetBtn.classList.add("active");
    updateAmount();
  });

  customTip.addEventListener("input", (e) => {
    customPercent = Number(e.target.value);
    updateAmount();
  });

  peopleInput.addEventListener("input", (e) => {
    peopleNmb = Number(e.target.value);
    if (peopleNmb) resetBtn.classList.add("active");
    updateAmount();
  });

  billInput.addEventListener("blur", () => {
    let billValue = billInput.value;
    if (billValue && !billValue.includes(".")) {
      billValue = `${parseFloat(billValue).toFixed(2)}`;
      billInput.value = billValue;
    }
  });

  tipsEl.forEach((tip) => {
    tip.addEventListener("click", () => {
      // Remove active classes
      tipsEl.forEach((tip) => tip.classList.remove("active"));
      //   Add active to clicked Element
      tip.classList.add("active");
      //   Reset custom percentage
      if (tip.classList.contains("active")) {
        customPercent = 0;
      }
      tipPercent = Number(tip.textContent.replace("%", ""));
      updateAmount();
    });
  });

  const updateAmount = () => {
    if (!peopleNmb) {
      errorStatement.classList.add("active");
      errorText.classList.add("active");
    }
    // Clear custom percent in HTML
    if (tipPercent) {
      customTip.value = "";
    }
    if (
      billAmount > 0 &&
      peopleNmb > 0 &&
      (tipPercent > 0 || customPercent > 0)
    ) {
      const { roundedTipValue, roundedTotalValue } = calculateValues();
      clearErrors();
      updateHTML(roundedTipValue, roundedTotalValue);
      // console.log(roundedTotalValue, peopleNmb);
      // console.log(roundedTotalValue * peopleNmb);
    }
  };

  resetBtn.addEventListener("click", resetValues);
};

calculateTips();
