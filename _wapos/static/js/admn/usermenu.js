document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdown menus
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const menu = this.nextElementSibling;
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.remove('show');
            });
            menu.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Toggle advanced search panel
    const advancedPanel = document.querySelector('.advanced-search-panel');
    const advancedToggle = document.querySelector('.advanced-search-toggle');
    const cancelAdvanced = document.querySelector('.search-btn.cancel');
    
    if (advancedToggle && advancedPanel) {
        advancedToggle.addEventListener('click', function(e) {
            e.preventDefault();
            advancedPanel.classList.add('show');
        });
    }
    
    if (cancelAdvanced && advancedPanel) {
        cancelAdvanced.addEventListener('click', function(e) {
            e.preventDefault();
            advancedPanel.classList.remove('show');
        });
    }
    // Toggle quick view sidebar
    const viewButtons = document.querySelectorAll('.action-btn.view');
    const closeSidebar = document.querySelector('.close-sidebar');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.quick-view-sidebar').classList.add('open');
        });
    });
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            document.querySelector('.quick-view-sidebar').classList.remove('open');
        });
    }
      // Toggle action dropdowns
    document.querySelectorAll('.actions-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const menu = this.nextElementSibling;
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.remove('show');
            });
            menu.classList.toggle('show');
        });
    });
    


    // Toggle between grid and list view
    // Toggle grid/list view
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const gridViewContainer = document.querySelector('.grid-view-container');
    const listViewContainer = document.querySelector('.list-view-container');

    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            gridViewContainer.style.display = 'block';
            listViewContainer.style.display = 'none';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function() {
            gridViewContainer.style.display = 'none';
            listViewContainer.style.display = 'block';
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        });
    }
});