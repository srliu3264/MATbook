console.log("Hotkeys script loaded");

window.goElems = [];

// 1. INITIALIZE SETTINGS ON LOAD
// Restore 'c' toggle preference immediately
(function initSettings() {
    let savedCollapse = localStorage.getItem("collapse-sidebar");
    if (savedCollapse === 'true') {
        document.body.classList.add('collapse-mode');
    }
})();
// 2. EXPAND ACTIVE MENU PATH
// This ensures that if you are in a subsection, the parent chapter stays open in 'c' mode
(function expandActivePath() {
    // Find the currently active link/list item
    let activeItem = document.querySelector('.menu li.active');
    
    if (activeItem) {
        // Climb up the tree and mark all parent LIs as "active-parent"
        let parent = activeItem.parentElement; // This is the UL
        while (parent) {
            // If we hit a List Item (Chapter), mark it
            if (parent.tagName === 'LI') {
                parent.classList.add('active-parent');
            }
            // Stop if we reach the root menu
            if (parent.classList.contains('menu')) break;
            
            parent = parent.parentElement;
        }
    }
})();
document.addEventListener("keydown", function(e) {
  // ALLOW ESCAPE EVERYWHERE
  if (e.key === "Escape") {
      closeAllModals();
      return;
  }

  // IGNORE INPUTS
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  // HANDLE "GO MODE"
  if (window.goElems.length > 0) {
    if (e.key === "Escape" || e.key === "f") {
        clearGoElems();
    } else {
        followGoElems(e.key);
    }
    return; 
  }

  // KEYMAPS
  switch (e.key) {
    // --- UTILITIES ---
    case '?': toggleHelp(); break;
    case '/': e.preventDefault(); focusSearch(); break;
    case 'f': addGoElems(); break;
    
    // --- TOGGLES ---
    case 't': // Toggle Theme
      let themeBtn = document.getElementById("theme-toggle");
      if (themeBtn) themeBtn.click();
      break;
    case 'c': // Toggle Sidebar Collapse (MISSING IN YOUR CODE)
      toggleSidebarCollapse();
      break;
    case '[': // Toggle Left Sidebar
      let menuIcon = document.querySelector(".menu-icon");
      if (menuIcon) menuIcon.click();
      break;
    case ']': // Toggle Right Sidebar
      let tocIcon = document.querySelector(".toc-icon");
      if (tocIcon) tocIcon.click();
      break;
    case '\\': // Toggle Head Bar
      toggleHeader();
      break;

    // --- NAVIGATION ---
    case 'r': window.location.reload(); break;
    case 'H': history.back(); break;
    case 'L': history.forward(); break;
    
    case 'h': navigateMap(-1); break;
    case 'l': navigateMap(1); break;
    case 'u': navigateParent(); break;
    case 'd': navigateNextChapter(); break;

    // --- SCROLLING ---
    case 'j': scrollPage(100); break;
    case 'k': scrollPage(-100); break;
    case 'g': scrollToPosition(0); break;
    case 'G': scrollToPosition(999999); break;
  }
});

/* ============================
   FUNCTIONS
   ============================ */

function toggleSidebarCollapse() {
    let body = document.body;
    if (body.classList.contains('collapse-mode')) {
        body.classList.remove('collapse-mode');
        localStorage.setItem("collapse-sidebar", "false");
    } else {
        body.classList.add('collapse-mode');
        localStorage.setItem("collapse-sidebar", "true");
    }
}

function toggleHeader() {
  let header = document.querySelector(".page__header");
  let body = document.body;
  
  if (header) {
    if (header.style.display === 'none') {
      header.style.removeProperty('display');
      body.classList.remove('header-hidden');
    } else {
      header.style.setProperty('display', 'none', 'important');
      body.classList.add('header-hidden');
    }
  }
}

function toggleHelp() {
  let help = document.getElementById("help-window");
  if (help) {
    help.style.display = (help.style.display === 'none') ? 'flex' : 'none';
  }
}

function closeAllModals() {
  let help = document.getElementById("help-window");
  if (help) help.style.display = 'none';

  clearGoElems();

  if (document.activeElement) document.activeElement.blur();

  let searchContainer = document.querySelector(".search-container");
  if (searchContainer && searchContainer.classList.contains("search-container--is-visible")) {
      let searchIcon = document.querySelector(".search-icon");
      if (searchIcon) searchIcon.click();
  }
}

function focusSearch() {
  let searchInput = document.getElementById("search");
  let searchContainer = document.querySelector(".search-container");
  let searchIcon = document.querySelector(".search-icon"); 

  if (searchContainer && !searchContainer.classList.contains("search-container--is-visible")) {
      if (searchIcon) searchIcon.click();
  } else if (searchInput) {
      searchInput.focus();
      searchInput.select();
  }
}

function scrollPage(amount) {
    window.scrollBy({ top: amount, behavior: 'smooth' });
    let containers = ['.page', '.book-content', 'html', 'body'];
    for (let selector of containers) {
        let el = document.querySelector(selector);
        if (el && el.scrollHeight > el.clientHeight) {
            el.scrollBy({ top: amount, behavior: 'smooth' });
        }
    }
}

function scrollToPosition(y) {
    window.scrollTo({ top: y, behavior: 'smooth' });
    let containers = ['.page', '.book-content', 'html', 'body'];
    for (let selector of containers) {
        let el = document.querySelector(selector);
        if (el) el.scrollTo({ top: y, behavior: 'smooth' });
    }
}

/* ============================
   NAVIGATION LOGIC
   ============================ */

function getMenuLinks() {
    return Array.from(document.querySelectorAll('.menu nav ul li a'))
        .filter(a => !a.getAttribute('href').startsWith('#'));
}

function normalizeUrl(url) {
    return url.replace(/\/$/, "");
}

function navigateMap(direction) {
    let links = getMenuLinks();
    let currentUrl = normalizeUrl(window.location.href);
    let index = links.findIndex(a => normalizeUrl(a.href) === currentUrl);
    
    if (index !== -1) {
        let targetIndex = index + direction;
        let target = links[targetIndex];

        // --- FIX FOR 'h' (Previous) ---
        if (direction === -1 && target) {
            let currentLink = links[index];
            let parentUl = currentLink.closest('ul');
            if (parentUl && parentUl.parentElement.tagName === 'LI') {
                let parentLink = parentUl.parentElement.querySelector('a');
                if (target === parentLink) {
                    targetIndex--; 
                    target = links[targetIndex];
                }
            }
        }
        if (target) target.click();
    }
}

function navigateParent() {
    let activeLink = document.querySelector('.menu li.active > a');
    if (!activeLink) return;
    let parentUl = activeLink.closest('ul'); 
    if (parentUl && parentUl.parentElement.tagName === 'LI') {
        let parentLink = parentUl.parentElement.querySelector('a');
        if (parentLink) parentLink.click();
    }
}

function navigateNextChapter() {
    let activeItem = document.querySelector('.menu li.active');
    if (!activeItem) return;
    let topLevelLi = activeItem;
    while (topLevelLi && topLevelLi.parentElement.closest('ul') && topLevelLi.parentElement.closest('ul').parentElement.tagName === 'LI') {
         topLevelLi = topLevelLi.parentElement.closest('ul').parentElement;
    }
    if (topLevelLi && topLevelLi.nextElementSibling) {
        let nextChapterLink = topLevelLi.nextElementSibling.querySelector('a');
        if (nextChapterLink) nextChapterLink.click();
    }
}

/* ============================
   LINK HINT LOGIC
   ============================ */

function addGoElems() {
  const goElems = window.goElems;
  if (goElems.length > 0) return;

  const keyStr = "qwertyuiopasdghjklzxcvbnm";
  let links = document.querySelectorAll("a, button");
  let count = 0;

  links.forEach((elem) => {
    if (count >= keyStr.length) return;
    const rect = elem.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || rect.top < 0 || rect.top > window.innerHeight) return;

    const label = document.createElement("div");
    label.innerText = keyStr[count];
    label.className = "goelems"; 
    label.style.position = "fixed";
    label.style.top = rect.top + "px";
    label.style.left = rect.left + "px";
    label.style.zIndex = "10000";
    label.style.background = "gold";
    label.style.color = "black";
    label.style.border = "1px solid black";
    label.style.padding = "2px 5px";
    label.style.fontWeight = "bold";
    label.style.borderRadius = "3px";
    label.style.fontSize = "12px";
    label.style.lineHeight = "1";

    document.body.appendChild(label);
    goElems.push({ elem: elem, label: label, key: keyStr[count] });
    count++;
  });
}

function followGoElems(key) {
  const goElems = window.goElems;
  const match = goElems.find(item => item.key === key.toLowerCase());
  if (match) {
    match.elem.click();
    if (match.elem.tagName === 'A') window.location.href = match.elem.href;
    clearGoElems();
  } else {
    clearGoElems();
  }
}

function clearGoElems() {
  window.goElems.forEach(item => item.label.remove());
  window.goElems = [];
}
