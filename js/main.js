// main.js - Main Application Controller

let activeSection = "about";
let navLinks = [];
let navigationInitialized = false;

// Navigation Initialization
async function initNavigation() {

  if (navigationInitialized) {
    return;
  }

  navigationInitialized = true;

  navLinks = await DataLoader.getNav();

  renderNavigation();

  // Bind hamburger
  const hamburger =
    document.getElementById("hamburgerBtn");

  const mobileMenu =
    document.getElementById("mobileMenu");

  hamburger?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
  });

  // Check hash
  const hash =
    location.hash.replace("#", "");

  if (
    hash &&
    (
      navLinks.some(n => n.id === hash) ||
      hash === "login"
    )
  ) {
    activeSection = hash;
  }

  // Load initial section
  await goToSection(activeSection);
}


// Render Navigation
function renderNavigation() {

  const desktop =
    document.getElementById("navDesktop");

  const mobile =
    document.getElementById("navMobile");

  if (!desktop || !mobile) {
    return;
  }

  desktop.innerHTML = "";
  mobile.innerHTML = "";

  navLinks.forEach(link => {

    const btn =
      document.createElement("button");

    btn.className =
      `nav-btn ${
        activeSection === link.id
          ? "active"
          : ""
      }`;

    btn.textContent =
      link.label;

    btn.onclick = () => {
      goToSection(link.id);
    };

    desktop.appendChild(btn);


    const btnM =
      document.createElement("button");

    btnM.className =
      `nav-btn ${
        activeSection === link.id
          ? "active"
          : ""
      }`;

    btnM.textContent =
      link.label;

    btnM.onclick = () => {

      goToSection(link.id);

      document
        .getElementById("mobileMenu")
        ?.classList.remove("open");

    };

    mobile.appendChild(btnM);

  });

}


// Section Navigation
async function goToSection(id) {

  activeSection = id;

  renderNavigation();


  // Hide all sections
  document
    .querySelectorAll(
      '[id$="SectionContainer"], #loginContainer'
    )
    .forEach(el => {
      el.classList.add("hidden");
    });


  // Section mapping
  const activeMap = {

    about:
      "aboutSectionContainer",

    tnea:
      "tneaSectionContainer",

    entrance:
      "entranceSectionContainer",

    scholarships:
      "scholarshipsSectionContainer",

    quiz:
      "quizSectionContainer",

    predictor:
      "predictorSectionContainer",

    counselling:
      "counsellingSectionContainer",

    login:
      "loginContainer"

  };


  const targetId =
    activeMap[id];

  const target =
    document.getElementById(targetId);


  if (target) {

    target.classList.remove("hidden");


    // Load section content
    if (
      id !== "login" &&
      target.innerHTML.trim() === ""
    ) {

      await loadSection(id);

    }

  }


  // Initialize Login
  if (id === "login") {

    if (window.initLogin) {

      window.initLogin();

    }

  }


  // Update URL hash
  history.replaceState(
    null,
    "",
    `#${id}`
  );


  // Scroll top
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// Load Section
async function loadSection(id) {

  switch (id) {

    case "about": {

      const aboutContainer =
        document.getElementById(
          "aboutSectionContainer"
        );

      if (aboutContainer) {

        const res =
          await fetch(
            "components/sections/about.html"
          );

        if (!res.ok) {
          throw new Error(
            "Failed to load about.html"
          );
        }

        aboutContainer.innerHTML =
          await res.text();


        // About buttons
        aboutContainer
          .querySelectorAll("[data-go]")
          .forEach(btn => {

            btn.addEventListener(
              "click",
              () => {

                goToSection(
                  btn.dataset.go
                );

              }
            );

          });

      }

      break;

    }


    case "tnea":

      if (window.initTNEA) {
        await window.initTNEA();
      }

      break;


    case "entrance":

      if (window.initEntrance) {
        await window.initEntrance();
      }

      break;


    case "scholarships":

      if (window.initScholarships) {
        await window.initScholarships();
      }

      break;


    case "quiz":

      if (window.initQuiz) {
        await window.initQuiz();
      }

      break;


    case "predictor":

      if (window.initPredictor) {
        await window.initPredictor();
      }

      break;


    case "counselling": {

      const counsContainer =
        document.getElementById(
          "counsellingSectionContainer"
        );

      if (
        counsContainer &&
        counsContainer.innerHTML.trim() === ""
      ) {

        const res =
          await fetch(
            "components/sections/counselling.html"
          );

        if (!res.ok) {
          throw new Error(
            "Failed to load counselling.html"
          );
        }

        counsContainer.innerHTML =
          await res.text();

      }

      break;

    }

  }

}


// Expose globally
window.initNavigation =
  initNavigation;

window.goToSection =
  goToSection;


// Footer / Dynamic Navigation
document.addEventListener(
  "click",
  (e) => {

    const navTarget =
      e.target.closest("[data-nav]");

    if (navTarget) {

      e.preventDefault();

      goToSection(
        navTarget.dataset.nav
      );

      return;

    }


    const goTarget =
      e.target.closest("[data-go]");

    if (goTarget) {

      e.preventDefault();

      goToSection(
        goTarget.dataset.go
      );

    }

  }
);