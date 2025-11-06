document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-toc");
    const tocSidebar = document.getElementById("toc-sidebar");
  
    toggleButton.addEventListener("click", function () {
      tocSidebar.classList.toggle("visible");
    });
  });
  