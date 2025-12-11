/*
 * These functions handle depositing into account
 */

(function() {
    "use strict";
    
    const BASE_URL = "/";

    function init() {
        id("enter").addEventListener("click", (e) => {
            e.preventDefault();
            makeDeposit();
        });
    }

    /**
     * Makes a fetch call to the API to handle deposit
     */
    async function makeDeposit() {
        let amount = qs("input[name='amount']").value;
        if (!amount) {
            handleError("Please enter a number");
            return;
        }
        let params = {amount: amount};
        try {
            let url = BASE_URL + "deposit";
            let resp = await fetch(url, { 
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify(params)
            });
            resp = checkStatus(resp);
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