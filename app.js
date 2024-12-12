

const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_XrzY9LBUMinN48rmZ4Tx1fFHZrbxjyYsmBIW3LdP";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

      
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }


    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;


    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        const response = await fetch(`${BASE_URL}&base_currency=${fromCurr.value}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const rate = data.data[toCurr.value]?.value;
        if (!rate) {
            msg.innerText = `Exchange rate for ${fromCurr.value} to ${toCurr.value} not available.`;
            return;
        }

        const finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error.message);
        msg.innerText = "Failed to fetch exchange rate. Please try again.";
    }
};


const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];

  
    if (!countryCode) return;

    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");

    if (img) img.src = newSrc;
};


btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});


window.addEventListener("load", () => {
    updateExchangeRate();
});

