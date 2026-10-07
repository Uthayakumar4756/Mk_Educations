async function initDashboard() {

    const isLoggedIn =
        localStorage.getItem("mkLogin");

    console.log("Dashboard Login:", isLoggedIn);

    if (isLoggedIn !== "true") {

        window.location.replace("../../index.html");

        return;
    }

    const username =
        localStorage.getItem("mkUsername") || "Admin";

    const role =
        localStorage.getItem("mkRole") || "Administrator";

    setText(
        "topUsername",
        username
    );

    setText(
        "sidebarUsername",
        username
    );

    setText(
        "sidebarRole",
        role
    );

    const avatar =
        document.getElementById("sidebarAvatar");

    if (avatar) {

        avatar.textContent =
            username.charAt(0).toUpperCase();

    }

    bindDashboardEvents();

    await loadDashboardSummary();

}


function bindDashboardEvents() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.onclick = function () {

            localStorage.removeItem("mkLogin");
            localStorage.removeItem("mkUserId");
            localStorage.removeItem("mkUsername");
            localStorage.removeItem("mkRole");
            localStorage.removeItem("mkToken");

            sessionStorage.clear();

            window.location.replace("../../index.html");

        };

    }


    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const sidebar =
        document.getElementById("sidebar");

    const mobileOverlay =
        document.getElementById("mobileOverlay");


    if (mobileMenuButton && sidebar) {

        mobileMenuButton.onclick = function () {

            sidebar.classList.toggle("open");

            if (mobileOverlay) {

                mobileOverlay.classList.toggle("show");

            }

        };

    }


    if (mobileOverlay && sidebar) {

        mobileOverlay.onclick = function () {

            sidebar.classList.remove("open");

            mobileOverlay.classList.remove("show");

        };

    }

}


async function loadDashboardSummary() {

    try {

        console.log(
            "API URL:",
            API_BASE_URL + "/mkcarrer/dashboard/summary"
        );

        const response =
            await fetch(
                API_BASE_URL +
                "/mkcarrer/dashboard/summary"
            );

        console.log(
            "Dashboard API Status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Dashboard API failed: " +
                response.status
            );

        }

        const data =
            await response.json();

        console.log(
            "Dashboard API Response:",
            data
        );


        setText(
            "totalStudents",
            data.students
        );

        setText(
            "totalQuestions",
            data.mockQuestions
        );

        setText(
            "totalTests",
            data.mockTests
        );

        setText(
            "totalVisits",
            data.totalVisits
        );

        setText(
            "uniqueVisitors",
            data.uniqueVisitors
        );


        setText(
            "overviewStudents",
            data.students
        );

        setText(
            "overviewTests",
            data.mockTests
        );

        setText(
            "overviewVisits",
            data.totalVisits
        );

        setText(
            "overviewUnique",
            data.uniqueVisitors
        );


    } catch (error) {

        console.error(
            "Dashboard summary error:",
            error
        );

    }

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? 0;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        initDashboard();

    }
);


window.initDashboard =
    initDashboard;