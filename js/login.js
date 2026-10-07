function initLogin() {

    const loginForm =
        document.getElementById("loginForm");

    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");

    const loginError =
        document.getElementById("loginError");

    const loginButton =
        document.getElementById("loginButton");

    const loginText =
        document.getElementById("loginText");

    const loginLoader =
        document.getElementById("loginLoader");

    const togglePassword =
        document.getElementById("togglePassword");


    if (!loginForm) {
        console.error("Login form not found");
        return;
    }


    // Prevent duplicate event binding
    if (loginForm.dataset.initialized === "true") {
        return;
    }

    loginForm.dataset.initialized = "true";


    // Password Show / Hide
    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (password.type === "password") {

                    password.type = "text";

                    togglePassword.textContent =
                        "Hide";

                } else {

                    password.type = "password";

                    togglePassword.textContent =
                        "Show";

                }

            }
        );

    }


    // Login Submit
    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            loginError.style.display =
                "none";

            loginError.textContent =
                "";


            loginButton.disabled =
                true;

            loginText.style.display =
                "none";

            loginLoader.style.display =
                "block";


            try {

                console.log(
                    "Login API:",
                    API_BASE_URL +
                    "/mkcarrer/login"
                );


                const response =
                    await fetch(
                        API_BASE_URL +
                        "/mkcarrer/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    username:
                                        username.value.trim(),

                                    password:
                                        password.value
                                })
                        }
                    );


                console.log(
                    "Login API Status:",
                    response.status
                );


                const data =
                    await response.json();


                console.log(
                    "Login Response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Invalid username or password"
                    );

                }


                // Save login information
                localStorage.setItem(
                    "mkLogin",
                    "true"
                );

                localStorage.setItem(
                    "mkUserId",
                    data.userId
                );

                localStorage.setItem(
                    "mkUsername",
                    data.username
                );

                localStorage.setItem(
                    "mkRole",
                    data.role
                );


                console.log(
                    "Login successful"
                );

                console.log(
                    "Username:",
                    data.username
                );

                console.log(
                    "Role:",
                    data.role
                );


                // Redirect to Dashboard
                window.location.replace(
                    "components/sections/dashboard.html"
                );

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginError.textContent =
                    error.message ||
                    "Unable to login";

                loginError.style.display =
                    "block";

            } finally {

                loginButton.disabled =
                    false;

                loginText.style.display =
                    "inline";

                loginLoader.style.display =
                    "none";

            }

        }
    );

}


// Make function globally available
window.initLogin =
    initLogin;