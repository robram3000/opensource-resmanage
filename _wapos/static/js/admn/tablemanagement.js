document.addEventListener('DOMContentLoaded', function() {
    const floorPlan = document.getElementById('floorPlan');
    const floorPlanGrid = document.getElementById('floorPlanGrid');
    const propertiesPanel = document.getElementById('propertiesPanel');
    const tableOptions = document.querySelectorAll('.table-option');
    const elementOptions = document.querySelectorAll('.element-option');
    const toastContainer = document.getElementById('toastContainer');
    const saveModal = document.getElementById('saveModal');
    
    // State management
    let draggedItem = null;
    let selectedItem = null;
    let currentZoom = 100;
    let gridVisible = true;
    let panelVisible = true;
    let snapToGrid = true;
    let gridSize = 20;
    let rotationAngle = 0;
    
    // Undo/Redo stack
    let undoStack = [];
    let redoStack = [];
    let maxUndoSteps = 50;
    
    // Initialize the floor plan
    function initFloorPlan() {
        // Make table options draggable
        tableOptions.forEach(option => {
            option.addEventListener('dragstart', function(e) {
                draggedItem = {
                    type: 'table',
                    element: this.cloneNode(true),
                    size: this.dataset.size,
                    shape: this.dataset.shape
                };
                e.dataTransfer.setData('text/plain', 'table,' + this.dataset.size + ',' + this.dataset.shape);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        
        // Make element options draggable
        elementOptions.forEach(option => {
            option.addEventListener('dragstart', function(e) {
                draggedItem = {
                    type: 'element',
                    element: this.cloneNode(true),
                    elementType: this.dataset.type
                };
                e.dataTransfer.setData('text/plain', 'element,' + this.dataset.type);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        
        // Set up drop zone
        floorPlanGrid.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        floorPlanGrid.addEventListener('drop', function(e) {
            e.preventDefault();
            const rect = floorPlanGrid.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            
            // Snap to grid if enabled
            if (snapToGrid) {
                x = Math.round(x / gridSize) * gridSize;
                y = Math.round(y / gridSize) * gridSize;
            }
            
            if (draggedItem.type === 'table') {
                createTable(x, y, draggedItem.size, draggedItem.shape);
            } else if (draggedItem.type === 'element') {
                createElement(x, y, draggedItem.elementType);
            }
        });
        
        // Initialize existing tables and elements
        document.querySelectorAll('.floor-plan-table, .floor-element').forEach(item => {
            setupItemDrag(item);
            if (item.classList.contains('floor-plan-table')) {
                setupTableInteractions(item);
            } else {
                setupElementInteractions(item);
            }
        });
        
        // Setup event listeners for controls
        setupControls();
        
        // Add keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Initialize measurement tools
        initMeasurementTools();
    }
    
    // Create a new table with enhanced features
    function createTable(x, y, size, shape) {
        const newTable = document.createElement('div');
        newTable.className = 'floor-plan-table';
        newTable.dataset.size = size;
        newTable.dataset.shape = shape;
        newTable.style.top = y + 'px';
        newTable.style.left = x + 'px';
        newTable.dataset.rotation = '0';
        
        // Generate unique ID
        const tableId = 'table-' + Date.now();
        newTable.dataset.tableId = tableId;
        
        // Create table visual
        const tableVisual = document.createElement('div');
        tableVisual.className = 'table-visual ' + shape;
        tableVisual.dataset.size = size;
        
        // Create table label
        const tableLabel = document.createElement('span');
        tableLabel.className = 'table-label';
        tableLabel.textContent = 'Table ' + (document.querySelectorAll('.floor-plan-table').length + 1);
        
        // Create status indicator
        const tableStatus = document.createElement('div');
        tableStatus.className = 'table-status available';
        
        // Create resize handles
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.innerHTML = '<i class="fas fa-expand-alt"></i>';
        
        // Create rotate handle
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotate-handle';
        rotateHandle.innerHTML = '<i class="fas fa-redo"></i>';
        
        newTable.appendChild(tableVisual);
        newTable.appendChild(tableLabel);
        newTable.appendChild(tableStatus);
        newTable.appendChild(resizeHandle);
        newTable.appendChild(rotateHandle);
        floorPlanGrid.appendChild(newTable);
        
        // Make the new table interactive
        setupItemDrag(newTable);
        setupTableInteractions(newTable);
        
        // Select the new table
        selectItem(newTable);
        
        // Save state to undo stack
        saveState();
        
        showToast('Table added successfully', 'success');
    }
    
    // Enhanced element creation with resizing
    function createElement(x, y, type) {
        const newElement = document.createElement('div');
        newElement.className = 'floor-element ' + type;
        newElement.dataset.elementType = type;
        
        // Set default dimensions based on type
        let width, height;
        switch(type) {
            case 'bar':
                width = 300;
                height = 30;
                break;
            case 'wall':
                width = 200;
                height = 20;
                break;
            case 'kitchen':
                width = 150;
                height = 200;
                break;
            case 'restroom':
                width = 100;
                height = 100;
                break;
            case 'door':
                width = 40;
                height = 80;
                break;
            default:
                width = 100;
                height = 100;
        }
        
        newElement.style.width = width + 'px';
        newElement.style.height = height + 'px';
        newElement.style.top = y + 'px';
        newElement.style.left = x + 'px';
        
        // Create element label
        const elementLabel = document.createElement('div');
        elementLabel.className = 'element-label';
        elementLabel.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        
        // Add resize handle if element is resizable
        if (type !== 'door') {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.innerHTML = '<i class="fas fa-expand-alt"></i>';
            newElement.appendChild(resizeHandle);
        }
        
        newElement.appendChild(elementLabel);
        floorPlanGrid.appendChild(newElement);
        
        // Make the new element interactive
        setupItemDrag(newElement);
        setupElementInteractions(newElement);
        
        // Save state to undo stack
        saveState();
        
        showToast(type.charAt(0).toUpperCase() + type.slice(1) + ' added', 'success');
    }
    
    // Enhanced item drag with rotation and resizing
    function setupItemDrag(item) {
    item.setAttribute('draggable', 'true');
    
    item.addEventListener('dragstart', function(e) {
        draggedItem = {
            type: this.classList.contains('floor-plan-table') ? 'table' : 'element',
            element: this,
            originalX: parseInt(this.style.left),
            originalY: parseInt(this.style.top)
        };
        e.dataTransfer.setData('text/plain', 'move');
        e.dataTransfer.effectAllowed = 'move';
        this.classList.add('dragging');
    });
    
    item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        
        // If position changed, save state
        if (parseInt(this.style.left) !== draggedItem.originalX || 
            parseInt(this.style.top) !== draggedItem.originalY) {
            saveState();
        }
    });
    
    // Click to select item
    item.addEventListener('click', function(e) {
        if (e.target.classList.contains('resize-handle')) return;
        if (e.target.classList.contains('rotate-handle')) return;
        e.stopPropagation();
        selectItem(this);
    });
}
    // Enhanced table interactions with rotation
    function setupTableInteractions(table) {
        // Double click to edit
        table.addEventListener('dblclick', function() {
            selectItem(this);
            document.getElementById('tableName').focus();
        });
        
        // Right click for context menu
        table.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, this);
        });
        
        // Setup rotation handle
        const rotateHandle = table.querySelector('.rotate-handle');
        if (rotateHandle) {
            rotateHandle.addEventListener('mousedown', startRotate);
        }
        
        // Setup resize handle
        const resizeHandle = table.querySelector('.resize-handle');
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', startResize);
        }
    }
    
    // Enhanced element interactions with resizing
    function setupElementInteractions(element) {
        // Right click for context menu
        element.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, this);
        });
        
        // Setup resize handle if exists
        const resizeHandle = element.querySelector('.resize-handle');
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', startResize);
        }
    }
    
    // Rotation functionality
    function startRotate(e) {
        e.stopPropagation();
        const item = this.parentElement;
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        function rotateElement(e) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
            const rotation = Math.round(angle - rotationAngle);
            item.style.transform = `rotate(${rotation}deg)`;
            item.dataset.rotation = rotation;
        }
        
        function stopRotate() {
            document.removeEventListener('mousemove', rotateElement);
            document.removeEventListener('mouseup', stopRotate);
            saveState();
        }
        
        document.addEventListener('mousemove', rotateElement);
        document.addEventListener('mouseup', stopRotate);
        
        // Store initial angle
        rotationAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    }
    
    // Resize functionality
    function startResize(e) {
        e.stopPropagation();
        const item = this.parentElement;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(item.style.width);
        const startHeight = parseInt(item.style.height);
        
        function resizeElement(e) {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            
            // Minimum size constraints
            if (newWidth > 20) {
                item.style.width = newWidth + 'px';
            }
            if (newHeight > 20) {
                item.style.height = newHeight + 'px';
            }
        }
        
        function stopResize() {
            document.removeEventListener('mousemove', resizeElement);
            document.removeEventListener('mouseup', stopResize);
            saveState();
        }
        
        document.addEventListener('mousemove', resizeElement);
        document.addEventListener('mouseup', stopResize);
    }
    
    // Undo/Redo functionality
    function saveState() {
        // Clear redo stack when making new changes
        redoStack = [];
        
        // Save current state
        const state = {
            html: floorPlanGrid.innerHTML,
            selectedId: selectedItem ? selectedItem.dataset.tableId || selectedItem.dataset.elementId : null
        };
        
        undoStack.push(state);
        
        // Limit undo stack size
        if (undoStack.length > maxUndoSteps) {
            undoStack.shift();
        }
        
        updateUndoRedoButtons();
    }
    
    function undo() {
        if (undoStack.length > 0) {
            const currentState = {
                html: floorPlanGrid.innerHTML,
                selectedId: selectedItem ? selectedItem.dataset.tableId || selectedItem.dataset.elementId : null
            };
            
            redoStack.push(currentState);
            const prevState = undoStack.pop();
            
            floorPlanGrid.innerHTML = prevState.html;
            
            // Reinitialize interactions for all items
            document.querySelectorAll('.floor-plan-table, .floor-element').forEach(item => {
                setupItemDrag(item);
                if (item.classList.contains('floor-plan-table')) {
                    setupTableInteractions(item);
                } else {
                    setupElementInteractions(item);
                }
            });
            
            // Restore selection if possible
            if (prevState.selectedId) {
                const itemToSelect = document.querySelector(`[data-table-id="${prevState.selectedId}"]`) || 
                                    document.querySelector(`[data-element-id="${prevState.selectedId}"]`);
                if (itemToSelect) {
                    selectItem(itemToSelect);
                }
            }
            
            updateUndoRedoButtons();
            showToast('Undo successful', 'info');
        } else {
            showToast('Nothing to undo', 'warning');
        }
    }
    
    function redo() {
        if (redoStack.length > 0) {
            const currentState = {
                html: floorPlanGrid.innerHTML,
                selectedId: selectedItem ? selectedItem.dataset.tableId || selectedItem.dataset.elementId : null
            };
            
            undoStack.push(currentState);
            const nextState = redoStack.pop();
            
            floorPlanGrid.innerHTML = nextState.html;
            
            // Reinitialize interactions for all items
            document.querySelectorAll('.floor-plan-table, .floor-element').forEach(item => {
                setupItemDrag(item);
                if (item.classList.contains('floor-plan-table')) {
                    setupTableInteractions(item);
                } else {
                    setupElementInteractions(item);
                }
            });
            
            // Restore selection if possible
            if (nextState.selectedId) {
                const itemToSelect = document.querySelector(`[data-table-id="${nextState.selectedId}"]`) || 
                                    document.querySelector(`[data-element-id="${nextState.selectedId}"]`);
                if (itemToSelect) {
                    selectItem(itemToSelect);
                }
            }
            
            updateUndoRedoButtons();
            showToast('Redo successful', 'info');
        } else {
            showToast('Nothing to redo', 'warning');
        }
    }
    
    function updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = undoStack.length === 0;
        document.getElementById('redoBtn').disabled = redoStack.length === 0;
    }
    
    // Alignment tools
    function alignSelectedItems(alignment) {
        if (!selectedItem) return;
        
        const allItems = document.querySelectorAll('.floor-plan-table, .floor-element');
        const selectedItems = Array.from(allItems).filter(item => item.classList.contains('selected'));
        
        if (selectedItems.length < 2) {
            showToast('Select multiple items to align', 'warning');
            return;
        }
        
        switch(alignment) {
            case 'left':
                const minLeft = Math.min(...selectedItems.map(item => parseInt(item.style.left)));
                selectedItems.forEach(item => item.style.left = minLeft + 'px');
                break;
            case 'right':
                const maxRight = Math.max(...selectedItems.map(item => parseInt(item.style.left) + parseInt(item.style.width || item.offsetWidth)));
                selectedItems.forEach(item => item.style.left = (maxRight - parseInt(item.style.width || item.offsetWidth)) + 'px');
                break;
            case 'top':
                const minTop = Math.min(...selectedItems.map(item => parseInt(item.style.top)));
                selectedItems.forEach(item => item.style.top = minTop + 'px');
                break;
            case 'bottom':
                const maxBottom = Math.max(...selectedItems.map(item => parseInt(item.style.top) + parseInt(item.style.height || item.offsetHeight)));
                selectedItems.forEach(item => item.style.top = (maxBottom - parseInt(item.style.height || item.offsetHeight)) + 'px');
                break;
            case 'center-h':
                const avgLeft = selectedItems.reduce((sum, item) => sum + parseInt(item.style.left), 0) / selectedItems.length;
                selectedItems.forEach(item => item.style.left = avgLeft + 'px');
                break;
            case 'center-v':
                const avgTop = selectedItems.reduce((sum, item) => sum + parseInt(item.style.top), 0) / selectedItems.length;
                selectedItems.forEach(item => item.style.top = avgTop + 'px');
                break;
        }
        
        saveState();
        showToast(`Items aligned ${alignment.replace('-', ' ')}`, 'success');
    }
    
    // Distribute items evenly
    function distributeItems(direction) {
        if (!selectedItem) return;
        
        const allItems = document.querySelectorAll('.floor-plan-table, .floor-element');
        const selectedItems = Array.from(allItems).filter(item => item.classList.contains('selected'));
        
        if (selectedItems.length < 3) {
            showToast('Select at least 3 items to distribute', 'warning');
            return;
        }
        
        // Sort items by position
        if (direction === 'horizontal') {
            selectedItems.sort((a, b) => parseInt(a.style.left) - parseInt(b.style.left));
            
            // Calculate total width and gaps
            const firstItem = selectedItems[0];
            const lastItem = selectedItems[selectedItems.length - 1];
            const totalWidth = parseInt(lastItem.style.left) + parseInt(lastItem.style.width || lastItem.offsetWidth) - 
                              parseInt(firstItem.style.left);
            const itemsWidth = selectedItems.reduce((sum, item) => sum + parseInt(item.style.width || item.offsetWidth), 0);
            const gap = (totalWidth - itemsWidth) / (selectedItems.length - 1);
            
            // Position items
            let currentPos = parseInt(firstItem.style.left);
            for (let i = 0; i < selectedItems.length; i++) {
                selectedItems[i].style.left = currentPos + 'px';
                currentPos += parseInt(selectedItems[i].style.width || selectedItems[i].offsetWidth) + gap;
            }
        } else { // vertical
            selectedItems.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));
            
            // Calculate total height and gaps
            const firstItem = selectedItems[0];
            const lastItem = selectedItems[selectedItems.length - 1];
            const totalHeight = parseInt(lastItem.style.top) + parseInt(lastItem.style.height || lastItem.offsetHeight) - 
                               parseInt(firstItem.style.top);
            const itemsHeight = selectedItems.reduce((sum, item) => sum + parseInt(item.style.height || item.offsetHeight), 0);
            const gap = (totalHeight - itemsHeight) / (selectedItems.length - 1);
            
            // Position items
            let currentPos = parseInt(firstItem.style.top);
            for (let i = 0; i < selectedItems.length; i++) {
                selectedItems[i].style.top = currentPos + 'px';
                currentPos += parseInt(selectedItems[i].style.height || selectedItems[i].offsetHeight) + gap;
            }
        }
        
        saveState();
        showToast(`Items distributed ${direction === 'horizontal' ? 'horizontally' : 'vertically'}`, 'success');
    }
    
    // Group/ungroup functionality
    function groupSelectedItems() {
        const selectedItems = Array.from(document.querySelectorAll('.floor-plan-table.selected, .floor-element.selected'));
        
        if (selectedItems.length < 2) {
            showToast('Select at least 2 items to group', 'warning');
            return;
        }
        
        // Create group container
        const group = document.createElement('div');
        group.className = 'floor-group';
        group.dataset.groupId = 'group-' + Date.now();
        
        // Calculate group bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        selectedItems.forEach(item => {
            const x = parseInt(item.style.left);
            const y = parseInt(item.style.top);
            const width = parseInt(item.style.width || item.offsetWidth);
            const height = parseInt(item.style.height || item.offsetHeight);
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });
        
        // Position group
        group.style.left = minX + 'px';
        group.style.top = minY + 'px';
        group.style.width = (maxX - minX) + 'px';
        group.style.height = (maxY - minY) + 'px';
        
        // Reparent items to group and adjust their positions
        selectedItems.forEach(item => {
            const x = parseInt(item.style.left) - minX;
            const y = parseInt(item.style.top) - minY;
            
            item.style.left = x + 'px';
            item.style.top = y + 'px';
            item.classList.remove('selected');
            
            // Store original position in case of ungrouping
            item.dataset.originalLeft = x;
            item.dataset.originalTop = y;
            
            group.appendChild(item);
        });
        
        // Add group to floor plan
        floorPlanGrid.appendChild(group);
        
        // Make group selectable
        setupGroupInteractions(group);
        selectItem(group);
        
        saveState();
        showToast('Items grouped successfully', 'success');
    }
    
    function ungroupSelectedItems() {
        if (!selectedItem || !selectedItem.classList.contains('floor-group')) {
            showToast('Select a group to ungroup', 'warning');
            return;
        }
        
        const group = selectedItem;
        const items = Array.from(group.children);
        const groupX = parseInt(group.style.left);
        const groupY = parseInt(group.style.top);
        
        // Reposition items to their absolute positions
        items.forEach(item => {
            const x = groupX + parseInt(item.dataset.originalLeft);
            const y = groupY + parseInt(item.dataset.originalTop);
            
            item.style.left = x + 'px';
            item.style.top = y + 'px';
            floorPlanGrid.appendChild(item);
        });
        
        // Remove group
        group.remove();
        
        saveState();
        showToast('Group ungrouped successfully', 'success');
    }
    
    function setupGroupInteractions(group) {
        group.addEventListener('click', function(e) {
            e.stopPropagation();
            selectItem(this);
        });
        
        group.addEventListener('dblclick', function() {
            // Select all items in group
            Array.from(this.children).forEach(item => {
                item.classList.add('selected');
            });
        });
        
        // Make group draggable
        group.setAttribute('draggable', 'true');
        
        group.addEventListener('dragstart', function(e) {
            draggedItem = {
                type: 'group',
                element: this,
                originalX: parseInt(this.style.left),
                originalY: parseInt(this.style.top)
            };
            e.dataTransfer.setData('text/plain', 'move');
            e.dataTransfer.effectAllowed = 'move';
            this.classList.add('dragging');
        });
        
        group.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            
            // If position changed, save state
            if (parseInt(this.style.left) !== draggedItem.originalX || 
                parseInt(this.style.top) !== draggedItem.originalY) {
                saveState();
            }
        });
    }
    
    // Measurement tools
    function initMeasurementTools() {
        let startX, startY, measurementLine;
        
        floorPlanGrid.addEventListener('mousedown', function(e) {
            if (!e.ctrlKey || e.target !== floorPlanGrid) return;
            
            e.preventDefault();
            
            const rect = floorPlanGrid.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            
            measurementLine = document.createElement('div');
            measurementLine.className = 'measurement-line';
            measurementLine.style.left = startX + 'px';
            measurementLine.style.top = startY + 'px';
            floorPlanGrid.appendChild(measurementLine);
            
            function updateMeasurement(e) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate length
                const dx = x - startX;
                const dy = y - startY;
                const length = Math.round(Math.sqrt(dx * dx + dy * dy));
                
                // Update line position and size
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const lineLength = Math.sqrt(dx * dx + dy * dy);
                
                measurementLine.style.width = lineLength + 'px';
                measurementLine.style.transform = `rotate(${angle}deg)`;
                measurementLine.dataset.length = length + 'px';
            }
            
            function endMeasurement() {
                document.removeEventListener('mousemove', updateMeasurement);
                document.removeEventListener('mouseup', endMeasurement);
                
                // Remove line after delay
                setTimeout(() => {
                    if (measurementLine && measurementLine.parentNode) {
                        measurementLine.remove();
                    }
                }, 2000);
            }
            
            document.addEventListener('mousemove', updateMeasurement);
            document.addEventListener('mouseup', endMeasurement);
        });
    }
    
    // Keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Delete selected item
            if (e.key === 'Delete' && selectedItem) {
                selectedItem.remove();
                propertiesPanel.classList.remove('visible');
                showToast('Item deleted', 'warning');
                selectedItem = null;
                saveState();
            }
            
            // Copy selected item (Ctrl+C)
            if (e.ctrlKey && e.key === 'c' && selectedItem) {
                const rect = selectedItem.getBoundingClientRect();
                const gridRect = floorPlanGrid.getBoundingClientRect();
                const x = rect.left - gridRect.left + 20;
                const y = rect.top - gridRect.top + 20;
                
                if (selectedItem.classList.contains('floor-plan-table')) {
                    createTable(x, y, selectedItem.dataset.size, selectedItem.dataset.shape);
                } else if (selectedItem.classList.contains('floor-element')) {
                    createElement(x, y, selectedItem.dataset.elementType);
                }
            }
            
            // Undo (Ctrl+Z)
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                undo();
            }
            
            // Redo (Ctrl+Shift+Z or Ctrl+Y)
            if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
                redo();
            }
            
            // Select all (Ctrl+A)
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                document.querySelectorAll('.floor-plan-table, .floor-element').forEach(item => {
                    item.classList.add('selected');
                });
            }
            
            // Toggle grid (Ctrl+G)
            if (e.ctrlKey && e.key === 'g') {
                toggleGrid();
            }
            
            // Toggle snap to grid (Ctrl+Shift+G)
            if (e.ctrlKey && e.shiftKey && e.key === 'g') {
                toggleSnapToGrid();
            }
        });
    }
    
    function toggleGrid() {
        gridVisible = !gridVisible;
        floorPlanGrid.style.backgroundImage = gridVisible ? 
            'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)' : 'none';
        showToast(gridVisible ? 'Grid shown' : 'Grid hidden', 'info');
    }
    
    function toggleSnapToGrid() {
        snapToGrid = !snapToGrid;
        showToast(snapToGrid ? 'Snap to grid enabled' : 'Snap to grid disabled', 'info');
    }
    
    // Export floor plan as image
    function exportAsImage() {
        // Use html2canvas library or similar to export the floor plan
        // This is a placeholder for the actual implementation
        showToast('Exporting floor plan as image...', 'info');
        
        // In a real implementation, you would use:
        // html2canvas(floorPlanGrid).then(canvas => {
        //     const link = document.createElement('a');
        //     link.download = 'floor-plan.png';
        //     link.href = canvas.toDataURL();
        //     link.click();
        // });
    }
    
    // Print floor plan
    function printFloorPlan() {
        // Create a print-friendly version of the floor plan
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Floor Plan</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .floor-plan { position: relative; width: 100%; height: auto; }
                    .table { position: absolute; border: 1px solid #000; display: flex; align-items: center; justify-content: center; }
                    .element { position: absolute; border: 1px solid #000; }
                </style>
            </head>
            <body>
                <h1>Floor Plan</h1>
                <div class="floor-plan" style="width: ${floorPlanGrid.offsetWidth}px; height: ${floorPlanGrid.offsetHeight}px;">
                    ${floorPlanGrid.innerHTML}
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
    
    // Save state to localStorage
    function saveToLocalStorage(name) {
        try {
            const state = {
                name: name,
                html: floorPlanGrid.innerHTML,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('floorPlan_' + Date.now(), JSON.stringify(state));
            showToast(`Floor plan "${name}" saved locally`, 'success');
        } catch (e) {
            showToast('Error saving to local storage: ' + e.message, 'error');
        }
    }
    
    // Load state from localStorage
    function loadFromLocalStorage(key) {
        try {
            const state = JSON.parse(localStorage.getItem(key));
            if (state && state.html) {
                floorPlanGrid.innerHTML = state.html;
                
                // Reinitialize all items
                document.querySelectorAll('.floor-plan-table, .floor-element').forEach(item => {
                    setupItemDrag(item);
                    if (item.classList.contains('floor-plan-table')) {
                        setupTableInteractions(item);
                    } else {
                        setupElementInteractions(item);
                    }
                });
                
                showToast(`Floor plan "${state.name}" loaded`, 'success');
                return true;
            }
        } catch (e) {
            showToast('Error loading from local storage: ' + e.message, 'error');
        }
        return false;
    }
    
    // Setup control buttons with new features
    function setupControls() {
        // Close properties panel
        document.getElementById('closeProperties').addEventListener('click', function() {
            propertiesPanel.classList.remove('visible');
            if (selectedItem) {
                selectedItem.classList.remove('selected');
                selectedItem = null;
            }
        });
        
        // Delete item
        document.getElementById('deleteTable').addEventListener('click', function() {
            if (selectedItem) {
                selectedItem.remove();
                propertiesPanel.classList.remove('visible');
                showToast('Item deleted', 'warning');
                selectedItem = null;
                saveState();
            }
        });
        
        // Save table changes
        document.getElementById('saveTable').addEventListener('click', function() {
            if (selectedItem && selectedItem.classList.contains('floor-plan-table')) {
                // Update table properties from form
                selectedItem.querySelector('.table-label').textContent = 
                    document.getElementById('tableName').value;
                selectedItem.dataset.size = document.getElementById('tableSize').value;
                selectedItem.dataset.shape = document.getElementById('tableShape').value;
                
                // Update status
                const status = document.getElementById('tableStatus').value;
                const statusElement = selectedItem.querySelector('.table-status');
                statusElement.className = 'table-status ' + status;
                
                // Update rotation if changed
                const rotation = document.getElementById('tableRotation').value;
                selectedItem.style.transform = `rotate(${rotation}deg)`;
                selectedItem.dataset.rotation = rotation;
                
                showToast('Table updated successfully', 'success');
                saveState();
            }
        });
        
        // Save floor plan
        document.getElementById('saveFloorPlan').addEventListener('click', function() {
            saveModal.classList.add('visible');
        });
        
        // Clear all
        document.getElementById('clearAll').addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the entire floor plan?')) {
                floorPlanGrid.innerHTML = '';
                showToast('Floor plan cleared', 'warning');
                saveState();
            }
        });
        
        // Toggle grid
        document.getElementById('toggleGrid').addEventListener('click', toggleGrid);
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', function() {
            if (currentZoom < 200) {
                currentZoom += 10;
                updateZoom();
            }
        });
        
        document.getElementById('zoomOut').addEventListener('click', function() {
            if (currentZoom > 50) {
                currentZoom -= 10;
                updateZoom();
            }
        });
        
        // Center view
        document.getElementById('centerView').addEventListener('click', function() {
            floorPlanGrid.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            showToast('View centered', 'info');
        });
        
        // Toggle panel
        document.getElementById('togglePanel').addEventListener('click', function() {
            panelVisible = !panelVisible;
            document.querySelector('.tables-panel').classList.toggle('collapsed');
            this.querySelector('i').classList.toggle('fa-chevron-left');
            this.querySelector('i').classList.toggle('fa-chevron-right');
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Update active tab button
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.tab === tab) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', function() {
            saveModal.classList.remove('visible');
        });
        
        document.querySelector('.modal-cancel').addEventListener('click', function() {
            saveModal.classList.remove('visible');
        });
        
        document.querySelector('.modal-confirm').addEventListener('click', function() {
            const name = document.getElementById('floorPlanName').value;
            if (name) {
                saveModal.classList.remove('visible');
                saveToLocalStorage(name);
            } else {
                showToast('Please enter a floor plan name', 'error');
            }
        });
        
        // Undo/Redo buttons
        document.getElementById('undoBtn').addEventListener('click', undo);
        document.getElementById('redoBtn').addEventListener('click', redo);
        
        // Alignment buttons
        document.getElementById('alignLeft').addEventListener('click', () => alignSelectedItems('left'));
        document.getElementById('alignRight').addEventListener('click', () => alignSelectedItems('right'));
        document.getElementById('alignTop').addEventListener('click', () => alignSelectedItems('top'));
        document.getElementById('alignBottom').addEventListener('click', () => alignSelectedItems('bottom'));
        document.getElementById('alignCenterH').addEventListener('click', () => alignSelectedItems('center-h'));
        document.getElementById('alignCenterV').addEventListener('click', () => alignSelectedItems('center-v'));
        
        // Distribute buttons
        document.getElementById('distributeH').addEventListener('click', () => distributeItems('horizontal'));

                document.getElementById('distributeV').addEventListener('click', () => distributeItems('vertical'));
        
        // Group/Ungroup buttons
        document.getElementById('groupBtn').addEventListener('click', groupSelectedItems);
        document.getElementById('ungroupBtn').addEventListener('click', ungroupSelectedItems);
        
        // Export buttons
        document.getElementById('exportImage').addEventListener('click', exportAsImage);
        document.getElementById('exportPDF').addEventListener('click', printFloorPlan);
    }
    
    // Update zoom level
    function updateZoom() {
        floorPlanGrid.style.transform = `scale(${currentZoom / 100})`;
        document.querySelector('.zoom-level').textContent = `Zoom: ${currentZoom}%`;
    }
    
    // Select an item (table or element)
    function selectItem(item) {
        // Deselect current item if exists
        if (selectedItem) {
            selectedItem.classList.remove('selected');
        }
        
        // Select new item
        selectedItem = item;
        item.classList.add('selected');
        
        // Show properties panel
        propertiesPanel.classList.add('visible');
        
        // Update properties based on item type
        if (item.classList.contains('floor-plan-table')) {
            // Update table properties
            document.getElementById('tableId').value = item.dataset.tableId || '';
            document.getElementById('tableName').value = item.querySelector('.table-label').textContent;
            document.getElementById('tableSize').value = item.dataset.size || '4';
            document.getElementById('tableShape').value = item.dataset.shape || 'round';
            document.getElementById('tableX').value = parseInt(item.style.left) || 0;
            document.getElementById('tableY').value = parseInt(item.style.top) || 0;
            document.getElementById('tableRotation').value = item.dataset.rotation || '0';
            
            // Get status from class
            const statusClass = Array.from(item.querySelector('.table-status').classList).find(cls => 
                cls !== 'table-status');
            document.getElementById('tableStatus').value = statusClass || 'available';
            
            // Show table tabs
            document.querySelectorAll('.property-tabs, .tab-content').forEach(el => el.style.display = 'block');
        } else {
            // For elements, show simplified properties
            document.getElementById('tableId').value = '';
            document.getElementById('tableName').value = item.querySelector('.element-label').textContent;
            document.getElementById('tableX').value = parseInt(item.style.left) || 0;
            document.getElementById('tableY').value = parseInt(item.style.top) || 0;
            
            // Hide table-specific tabs
            document.querySelectorAll('.property-tabs, .tab-content').forEach(el => el.style.display = 'none');
            document.querySelector('.tab-content[data-tab="properties"]').style.display = 'block';
        }
    }
    
    // Show context menu
    function showContextMenu(x, y, item) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        
        // Common actions
        let menuItems = [
            { text: 'Select', icon: 'fa-mouse-pointer', action: () => selectItem(item) },
            { text: 'Duplicate', icon: 'fa-copy', action: () => duplicateItem(item) },
            { text: 'Delete', icon: 'fa-trash-alt', action: () => deleteItem(item) }
        ];
        
        // Table-specific actions
        if (item.classList.contains('floor-plan-table')) {
            menuItems.push(
                { text: 'Change Status', icon: 'fa-circle', action: () => changeTableStatus(item) },
                { text: 'Add Note', icon: 'fa-sticky-note', action: () => addTableNote(item) }
            );
        }
        
        // Position-specific actions
        menuItems.push(
            { text: 'Bring to Front', icon: 'fa-layer-group', action: () => bringToFront(item) },
            { text: 'Send to Back', icon: 'fa-layer-group', action: () => sendToBack(item) }
        );
        
        // Create menu items
        menuItems.forEach(menuItem => {
            const menuItemElement = document.createElement('div');
            menuItemElement.className = 'context-menu-item';
            menuItemElement.innerHTML = `<i class="fas ${menuItem.icon}"></i> ${menuItem.text}`;
            menuItemElement.addEventListener('click', function(e) {
                menuItem.action();
                contextMenu.remove();
                e.stopPropagation();
            });
            contextMenu.appendChild(menuItemElement);
        });
        
        document.body.appendChild(contextMenu);
        
        // Close menu when clicking elsewhere
        function closeMenu(e) {
            if (!contextMenu.contains(e.target)) {
                contextMenu.remove();
                document.removeEventListener('click', closeMenu);
            }
        }
        
        document.addEventListener('click', closeMenu);
    }
    
    // Duplicate item
    function duplicateItem(item) {
        const rect = item.getBoundingClientRect();
        const gridRect = floorPlanGrid.getBoundingClientRect();
        const x = rect.left - gridRect.left + 20;
        const y = rect.top - gridRect.top + 20;
        
        if (item.classList.contains('floor-plan-table')) {
            createTable(x, y, item.dataset.size, item.dataset.shape);
        } else if (item.classList.contains('floor-element')) {
            createElement(x, y, item.dataset.elementType);
        }
    }
    
    // Delete item
    function deleteItem(item) {
        item.remove();
        if (selectedItem === item) {
            propertiesPanel.classList.remove('visible');
            selectedItem = null;
        }
        saveState();
        showToast('Item deleted', 'warning');
    }
    
    // Change table status
    function changeTableStatus(table) {
        const currentStatus = Array.from(table.querySelector('.table-status').classList).find(cls => 
            cls !== 'table-status');
        const statuses = ['available', 'reserved', 'occupied', 'out-of-service'];
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        
        table.querySelector('.table-status').className = 'table-status ' + statuses[nextIndex];
        saveState();
        showToast(`Table status changed to ${statuses[nextIndex]}`, 'info');
    }
    
    // Add table note
    function addTableNote(table) {
        selectItem(table);
        document.querySelector('.tab-btn[data-tab="notes"]').click();
        document.getElementById('tableNotes').focus();
    }
    
    // Z-index management
    function bringToFront(item) {
        const items = document.querySelectorAll('.floor-plan-table, .floor-element');
        let maxZIndex = 0;
        
        items.forEach(i => {
            const zIndex = parseInt(window.getComputedStyle(i).zIndex) || 0;
            maxZIndex = Math.max(maxZIndex, zIndex);
        });
        
        item.style.zIndex = maxZIndex + 1;
        saveState();
        showToast('Item brought to front', 'info');
    }
    
    function sendToBack(item) {
        const items = document.querySelectorAll('.floor-plan-table, .floor-element');
        let minZIndex = 0;
        
        items.forEach(i => {
            const zIndex = parseInt(window.getComputedStyle(i).zIndex) || 0;
            minZIndex = Math.min(minZIndex, zIndex);
        });
        
        item.style.zIndex = minZIndex - 1;
        saveState();
        showToast('Item sent to back', 'info');
    }
    
    // Show toast notification
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after delay
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Initialize the application
    initFloorPlan();
    
    // Click outside to deselect
    document.addEventListener('click', function(e) {
        if (!propertiesPanel.contains(e.target) && !e.target.closest('.floor-plan-table, .floor-element')) {
            if (selectedItem) {
                selectedItem.classList.remove('selected');
                selectedItem = null;
            }
            propertiesPanel.classList.remove('visible');
        }
    });
    
    // Prevent default drag behavior for images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
});