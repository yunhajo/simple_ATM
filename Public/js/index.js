/*
 * These functions handle card authentication
 */

(function() {
    "use strict";
    
    const BASE_URL = "/";

    /**
     * This function initializes the home page 
     */
    function init() {
        id("auth-button").addEventListener("click", authenticate);
    }

    /**
     * Makes a fetch call to the API to authenticate the user
     * trying to log into their account
     */
    async function authenticate() {
        console.log("inside login");
        let params = {cardnumber: qs("input[name='cardnumber']").value, 
        pin: qs("input[name='pin']").value,};

        try {
            let resp = await fetch(BASE_URL + "authenticate", { 
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify(params)
            });
            resp = checkStatus(resp);
            const msg = await resp.text();
            console.log("Success:", msg);
    
            sessionStorage.setItem("logged-in", "True");
            // redirect to options page
            window.location.href = "options.html";
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
        id("login-form").appendChild(text);
    }

    init();

})();