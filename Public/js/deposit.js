/*
 * These functions handle depositing into account
 */

(function() {
    "use strict";
    
    const BASE_URL = "/";

    function init() {
        id("deposit-button").addEventListener("click", makeDeposit);
    }

    /**
     * Makes a fetch call to the API to handle deposit
     */
    async function makeDeposit() {
        try {
            let url = BASE_URL + "deposit";
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