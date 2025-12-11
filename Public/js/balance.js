/*
 * These functions handle displaying balance information
 */

(function() {
    "use strict";
    
    const BASE_URL = "/";

    /**
     * Makes a fetch call to the API to get remaining balance
     */
    async function displayBalance() {
        try {
            let url = BASE_URL + "balance";
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();

            let balanceDiv = gen("div");
            let balanceID = gen("h2");
            balanceID.textContent = "$" + data[0][0].balance;
            
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
        let text = gen("h2");
        text.textContent = errMsg;
        id("container").appendChild(text);
    }

    displayBalance();

})();