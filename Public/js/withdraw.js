/*
 * These functions handle withdrawing from the account
 */

(function() {
    "use strict";
    
    const BASE_URL = "/";

    function init() {
        id("enter").addEventListener("click", (e) => {
            e.preventDefault();
            makeWithdrawl();
        });
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function makeWithdrawl() {
        let amount = qs("input[name='amount']").value;
        if (!amount) {
            handleError("Please enter a number");
            return;
        }
        let params = {amount: amount};
        try {
            let url = BASE_URL + "withdraw";
            let resp = await fetch(url, { 
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify(params)
            });
            if (!resp.ok) {
                const msg = await resp.text(); 
                handleError(msg); 
                return;
            }

            const data = await resp.json();

            document.getElementById("form").innerHTML = "";
            
            let balanceDiv = gen("div");
            let balanceID = gen("h2");
            balanceID.textContent = "Your new balance is $" + data.balance;

            balanceDiv.appendChild(balanceID);
            id("container").appendChild(balanceDiv);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        id("form").innerHTML = "";
        let text = gen("h2");
        text.textContent = errMsg;
        id("container").appendChild(text);
    }

    init();

})();