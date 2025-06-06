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

    // Selection handling for both list and grid views
    const selectionPanel = document.querySelector('.row-selection-panel');
    const cancelSelectionBtn = selectionPanel?.querySelector('.action-btn.cancel');
    
    // Handle selection in list view
    const tableRows = document.querySelectorAll('.users-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.closest('.action-btn')) {
                return;
            }
            
            const checkbox = this.querySelector('.user-checkbox');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
            updateSelectionPanel();
        });
    });

    // Handle selection in grid view
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.closest('.action-btn')) {
                return;
            }
            
            const checkbox = this.querySelector('.user-checkbox');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
            updateSelectionPanel();
        });
    });

    // Handle checkbox clicks directly
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            e.stopPropagation();
            const parent = this.closest('tr') || this.closest('.user-card');
            parent.classList.toggle('selected', this.checked);
            updateSelectionPanel();
        });
    });

    // Update selection panel based on selected items
    function updateSelectionPanel() {
        const selectedListItems = document.querySelectorAll('.users-table tbody tr.selected');
        const selectedGridItems = document.querySelectorAll('.user-card.selected');
        const totalSelected = selectedListItems.length + selectedGridItems.length;
        
        if (totalSelected > 0) {
            selectionPanel.style.display = 'flex';
            selectionPanel.querySelector('.selected-count').textContent = totalSelected;
            
            // Enable/disable buttons based on selection count
            const isSingleSelection = totalSelected === 1;
            const viewBtn = selectionPanel.querySelector('.action-btn.view');
            const editBtn = selectionPanel.querySelector('.action-btn.edit');
            const messageBtn = selectionPanel.querySelector('.action-btn.message');
            
            if (viewBtn) viewBtn.disabled = !isSingleSelection;
            if (editBtn) editBtn.disabled = !isSingleSelection;
            
            // Show only specific buttons when multiple items are selected
            if (totalSelected > 1) {
                if (viewBtn) viewBtn.style.display = 'none';
                if (editBtn) editBtn.style.display = 'none';
                if (messageBtn) messageBtn.style.display = 'inline-block';
            } else {
                if (viewBtn) viewBtn.style.display = 'inline-block';
                if (editBtn) editBtn.style.display = 'inline-block';
                if (messageBtn) messageBtn.style.display = 'inline-block';
            }
        } else {
            selectionPanel.style.display = 'none';
        }
    }
    
    // Cancel selection
    if (cancelSelectionBtn) {
        cancelSelectionBtn.addEventListener('click', function() {
            document.querySelectorAll('.users-table tbody tr.selected, .user-card.selected').forEach(item => {
                item.classList.remove('selected');
                const checkbox = item.querySelector('.user-checkbox');
                if (checkbox) checkbox.checked = false;
            });
            selectionPanel.style.display = 'none';
        });
    }
    
    // Panel action buttons
    if (selectionPanel) {
        selectionPanel.querySelector('.action-btn.view')?.addEventListener('click', function() {
            if (!this.disabled) {
                document.querySelector('.quick-view-sidebar').classList.add('open');
            }
        });
        
        selectionPanel.querySelector('.action-btn.edit')?.addEventListener('click', function() {
            if (!this.disabled) {
                console.log('Edit user');
            }
        });
        
        selectionPanel.querySelector('.action-btn.deactivate')?.addEventListener('click', function() {
            const selectedIds = Array.from(document.querySelectorAll('.users-table tbody tr.selected, .user-card.selected'))
                .map(item => item.dataset.userId);
            console.log('Deactivate users:', selectedIds);
        });
    }

   

    // Toggle between grid and list view
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

    // Select all checkbox functionality
    const selectAllCheckbox = document.querySelector('.select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                const parent = checkbox.closest('tr') || checkbox.closest('.user-card');
                parent.classList.toggle('selected', this.checked);
            });
            updateSelectionPanel();
        });
    }
});