function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function getSavedTheme() {
  return localStorage.getItem("theme") || "dark";
}

function setupThemeToggle() {
  setTheme(getSavedTheme());
  
  // Handle multiple theme toggle button IDs
  const themeToggleIds = ["theme-toggle", "theme-toggle-mobile", "theme-toggle-desktop"];
  
  themeToggleIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn && !btn.dataset.listener) {
      btn.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      });
      btn.dataset.listener = "true"; // Prevent double listeners
    }
  });
}

// Run on initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupThemeToggle);
} else {
  setupThemeToggle();
}

// Re-run after Astro client navigation
document.addEventListener("astro:after-swap", setupThemeToggle);
document.addEventListener("astro:page-load", setupThemeToggle);