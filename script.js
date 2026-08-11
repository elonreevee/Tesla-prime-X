/* =====================================================
   SIGN UP
   ===================================================== */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const message =
            document.getElementById("signupMessage");

        const fullName =
            document.getElementById("fullName").value;

        const email =
            document.getElementById("email").value;

        const phone =
            document.getElementById("phone").value;

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch("/api/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password
                })

            });


            const data = await response.json();


            if (!response.ok) {

                message.className =
                    "auth-message error";

                message.textContent =
                    data.message;

                return;
            }


            message.className =
                "auth-message success";

            message.textContent =
                "✓ Account created successfully. Redirecting...";


            setTimeout(() => {

                window.location.href =
                    "/dashboard";

            }, 1200);


        } catch (error) {

            console.error(error);

            message.className =
                "auth-message error";

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}


/* =====================================================
   LOGIN
   ===================================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const message =
            document.getElementById("loginMessage");


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });


            const data = await response.json();


            if (!response.ok) {

                message.className =
                    "auth-message error";

                message.textContent =
                    data.message;

                return;
            }


            message.className =
                "auth-message success";

            message.textContent =
                "✓ Login successful. Redirecting...";


            setTimeout(() => {

                window.location.href =
                    "/Tesla X.html";

            }, 800);


        } catch (error) {

            console.error(error);

            message.className =
                "auth-message error";

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}


/* =====================================================
   LOAD ACCOUNT
   ===================================================== */

async function loadAccount() {

    const dashboardName =
        document.getElementById("dashboardName");

    if (!dashboardName) {
        return;
    }


    try {

        const response =
            await fetch("/api/me");


        if (!response.ok) {

            window.location.href =
                "/login.html";return;
        }


        const data =
            await response.json();

        const user =
            data.user;


        document.getElementById(
            "dashboardName"
        ).textContent = user.fullName;


        document.getElementById(
            "userName"
        ).textContent = user.fullName;


        document.getElementById(
            "userEmail"
        ).textContent = user.email;


        document.getElementById(
            "userPhone"
        ).textContent = user.phone;


        document.getElementById(
            "userCreated"
        ).textContent =
            new Date(user.createdAt).toLocaleDateString();

    } catch (error) {

        console.error(error);

        window.location.href =
            "/login.html";
    }

}

loadAccount();


/* =====================================================
   LOGOUT
   ===================================================== */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            try {

                await fetch("/api/logout", {
                    method: "POST"
                });

                window.location.href =
                    "/login.html";

            } catch (error) {

                console.error(error);

            }

        }
    );

}