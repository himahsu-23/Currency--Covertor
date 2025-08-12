const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let option = document.createElement("option");
        option.value = currCode;
        option.innerText = currCode;
        if (select.name === "from" && currCode === "USD") {
            option.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            option.selected = true;
        }
        select.append(option);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

function updateFlag(element) {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    element.parentElement.querySelector("img").src = newSrc;
}

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        let response = await fetch(`${BASE_URL}/${fromCurr.value}`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        let data = await response.json();
        let rate = data.rates[toCurr.value];
        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error(error);
        msg.innerText = "Error fetching data.";
    }
});
