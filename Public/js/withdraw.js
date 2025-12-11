/*
 * These functions handle withdrawing from the account
 */

(function() {
    "use strict";
    
    const BASE_URL = "/";

    function init() {
        id("withdraw-button").addEventListener("click", makeWithdrawl);
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function makeWithdrawl() {
        try {
            let url = BASE_URL + "withdraw";
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            let balanceDiv = gen("div");
            let balanceID = gen("h2");
            balanceID.textContent = data;
            balanceDiv.appendChild(classesID);
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

    init();

})();