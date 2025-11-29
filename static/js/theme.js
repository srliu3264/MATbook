document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("theme-toggle");
    const icon = toggleBtn.querySelector("i");
    const html = document.documentElement;

    // 1. Check LocalStorage or System Preference
    const currentTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (currentTheme === "dark" || (!currentTheme && systemPrefersDark)) {
        html.setAttribute("data-theme", "dark");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }

    // 2. Click Handler
    toggleBtn.addEventListener("click", function () {
        const isDark = html.getAttribute("data-theme") === "dark";

        if (isDark) {
            // Switch to Light
            html.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        } else {
            // Switch to Dark
            html.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    });
});
