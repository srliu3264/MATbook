console.log("Hotkeys script loaded");

window.goElems = [];

document.addEventListener("keydown", function(e) {
  // ALLOW ESCAPE EVERYWHERE
  if (e.key === "Escape") {
      closeAllModals();
      return;
  }

  // IGNORE INPUTS (unless Modifier key pressed)
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  // HANDLE "GO MODE"
  if (window.goElems.length > 0) {
    // If Esc OR 'f' is pressed again, cancel. 
    if (e.key === "Escape" || e.key === "f") {
        clearGoElems();
    } else {
        followGoElems(e.key);
    }
    return; 
  }
  // KEYMAPS
  switch (e.key) {
    case '?':
      toggleHelp();
      break;
    case '/':
      e.preventDefault(); 
      focusSearch();
      break;
    case 'f':
      addGoElems();
      break;
    case 't': // Toggle Theme
      let themeBtn = document.getElementById("theme-toggle");
      if (themeBtn) themeBtn.click();
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
    case 'j':
      scrollPage(100);
      break;
    case 'k':
      scrollPage(-100);
      break;
    case 'g':
      scrollToPosition(0);
      break;
    case 'G':
      scrollToPosition(999999);
      break;
  }
});

/* ============================
   FUNCTIONS
   ============================ */
function toggleHeader() {
  let header = document.querySelector(".page__header");
  let body = document.body;
  
  if (header) {
    // Check if currently hidden
    if (header.style.display === 'none') {
      // SHOW HEADER
      // Remove the inline style completely so CSS takes over
      header.style.removeProperty('display');
      body.classList.remove('header-hidden');
    } else {
      // HIDE HEADER
      // Use 'important' to override the CSS !important
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

  // Close search if open
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
