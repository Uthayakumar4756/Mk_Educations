// components.js

async function loadComponent(url, targetId) {

    try {

        const res = await fetch(url);

        if (!res.ok) {

            throw new Error(
                `Failed to load ${url}: ${res.status}`
            );

        }

        const html =
            await res.text();

        const target =
            document.getElementById(targetId);

        if (target) {

            target.innerHTML = html;

        } else {

            console.error(
                `Target element #${targetId} not found`
            );

        }

    } catch (e) {

        console.error(
            `Failed to load ${url}`,
            e
        );

    }

}


async function loadAllComponents() {

    await Promise.all([

        loadComponent(
            'components/topbar.html',
            'topbarContainer'
        ),

        loadComponent(
            'components/header.html',
            'headerContainer'
        ),

        loadComponent(
            'components/footer.html',
            'footerContainer'
        ),

        loadComponent(
            'components/sections/login.html',
            'loginContainer'
        )

    ]);


    if (window.initNavigation) {

        window.initNavigation();

    }


    const loginBtn =
        document.getElementById('loginBtn');

    if (loginBtn) {

        loginBtn.addEventListener(
            'click',
            function () {

                console.log(
                    'Login button clicked'
                );

                if (window.goToSection) {

                    window.goToSection('login');

                } else {

                    console.error(
                        'goToSection function not found'
                    );

                }

            }
        );

    }


    const yearEl =
        document.getElementById('footerYear');

    if (yearEl) {

        yearEl.textContent =
            new Date().getFullYear();

    }

}


document.addEventListener(
    'DOMContentLoaded',
    loadAllComponents
);