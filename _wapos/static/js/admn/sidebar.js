document.addEventListener('DOMContentLoaded', function() {
  // Toggle sidebar
  const sidebarToggle = document.getElementById('sidebarToggle');
  const layoutContainer = document.querySelector('.layout-container');
  const sidebar = document.getElementById('sidebar');
  const topBar = document.querySelector('.top-bar');
  const mainContent = document.getElementById('main');
  
  if (sidebarToggle && layoutContainer && sidebar && topBar && mainContent) {
    sidebarToggle.addEventListener('click', function() {
      layoutContainer.classList.toggle('sidebar-collapsed');
      sidebar.classList.toggle('collapsed');
      topBar.classList.toggle('collapsed');
      mainContent.classList.toggle('collapsed');
    });
  }

  // Dropdown functionality
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');
  
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const dropdown = this.closest('.menu-dropdown');
      dropdown.classList.toggle('open');
      
      // Close other open dropdowns
      document.querySelectorAll('.menu-dropdown').forEach(item => {
        if (item !== dropdown) {
          item.classList.remove('open');
        }
      });
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      
      // Update icon
      const icon = this.querySelector('i');
      if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-dropdown')) {
      document.querySelectorAll('.user-dropdown .dropdown-content').forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }
    
    if (!e.target.closest('.menu-dropdown')) {
      document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });
});