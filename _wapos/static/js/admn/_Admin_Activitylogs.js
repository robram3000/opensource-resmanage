class ActivityGantt {
  constructor() {
    this.container = document.querySelector('.activity-gantt-container');
    this.rowsContainer = document.querySelector('.activity-gantt-rows');
    this.weekHeader = document.querySelector('.activity-gantt-week-header');
    this.zoomLevel = 100;
    this.dayWidth = 60; // Base width for days
    
    // Sample data
    this.logs = [
      {
        id: 'LOG-001',
        event: 'System backup',
        user: 'System',
        type: 'system',
        startTime: '2025-08-05T01:00:00',
        endTime: '2025-08-05T01:45:00'
      },
      // Add more sample data as needed
    ];
    
    this.init();
  }
  
  init() {
    this.renderWeekHeader();
    this.renderGanttRows();
    this.setupEventListeners();
    this.setupGridLines();
  }
  
  renderWeekHeader() {
    this.weekHeader.innerHTML = '';
    
    // Render 7 days as example
    for (let i = 1; i <= 7; i++) {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'activity-gantt-day-header';
      if (i >= 5) dayHeader.classList.add('weekend');
      
      const date = new Date(2025, 7, i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      dayHeader.innerHTML = `
        <div>${dayName}</div>
        <div>${i}</div>
      `;
      
      this.weekHeader.appendChild(dayHeader);
    }
  }
  
  renderGanttRows() {
    this.rowsContainer.innerHTML = '';
    
    this.logs.forEach(log => {
      const row = document.createElement('div');
      row.className = 'activity-gantt-row';
      
      const startDate = new Date(log.startTime);
      const endDate = new Date(log.endTime);
      
      // Calculate bar position and width
      const dayOfMonth = startDate.getDate();
      const startHour = startDate.getHours() + (startDate.getMinutes() / 60);
      const durationHours = (endDate - startDate) / (1000 * 60 * 60);
      
      const left = ((dayOfMonth - 1) * this.dayWidth) + (startHour / 24 * this.dayWidth);
      const width = (durationHours / 24) * this.dayWidth;
      
      row.innerHTML = `
        <div class="activity-gantt-row-label">${log.event}</div>
        <div class="activity-gantt-bar-container">
          <div class="activity-gantt-bar bar-type-${log.type}" 
               style="left: ${left}px; width: ${Math.max(width, 4)}px;">
            <div class="activity-gantt-bar-info">
              <strong>${log.event}</strong>
              <div class="info-row">
                <span class="info-label">User:</span>
                <span class="info-value">${log.user}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ID:</span>
                <span class="info-value">${log.id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Start:</span>
                <span class="info-value">${startDate.toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">End:</span>
                <span class="info-value">${endDate.toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duration:</span>
                <span class="info-value">${this.formatDuration(startDate, endDate)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      this.rowsContainer.appendChild(row);
    });
  }
  
  setupGridLines() {
    // Vertical lines (days)
    for (let i = 0; i <= 7; i++) {
      const line = document.createElement('div');
      line.className = 'grid-line-vertical';
      line.style.left = `${i * this.dayWidth}px`;
      this.rowsContainer.appendChild(line);
    }
    
    // Horizontal lines (rows)
    const rowCount = this.logs.length;
    for (let i = 0; i <= rowCount; i++) {
      const line = document.createElement('div');
      line.className = 'grid-line-horizontal';
      line.style.top = `${i * 40}px`;
      this.rowsContainer.appendChild(line);
    }
  }
  
  setupEventListeners() {
    // Zoom controls
    document.querySelector('.zoom-in').addEventListener('click', () => {
      this.zoomLevel = Math.min(this.zoomLevel + 20, 200);
      this.updateZoom();
    });
    
    document.querySelector('.zoom-out').addEventListener('click', () => {
      this.zoomLevel = Math.max(this.zoomLevel - 20, 60);
      this.updateZoom();
    });
    
    // View mode toggle
    document.querySelectorAll('input[name="view-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.toggleViewMode(e.target.value);
      });
    });
  }
  
  updateZoom() {
    this.dayWidth = 60 * (this.zoomLevel / 100);
    document.querySelector('.zoom-level').textContent = `${this.zoomLevel}%`;
    this.renderWeekHeader();
    this.renderGanttRows();
    this.setupGridLines();
  }
  
  toggleViewMode(mode) {
    if (mode === 'compact') {
      this.rowsContainer.style.backgroundSize = `${this.dayWidth}px 40px`;
      document.querySelectorAll('.activity-gantt-row').forEach(row => {
        row.style.height = '40px';
      });
    } else {
      this.rowsContainer.style.backgroundSize = `${this.dayWidth}px 60px`;
      document.querySelectorAll('.activity-gantt-row').forEach(row => {
        row.style.height = '60px';
      });
    }
  }
  
  formatDuration(startDate, endDate) {
    const durationMs = endDate - startDate;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ActivityGantt();
});

class EnhancedDropdowns {
  constructor() {
    this.dropdowns = document.querySelectorAll('.filter-dropdown, .time-range-dropdown, .export-dropdown');
    this.init();
  }
  
  init() {
    this.dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.mu-btn');
      const menu = dropdown.querySelector('.mu-dropdown-menu');
      
      // Toggle dropdown
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllDropdowns();
        dropdown.classList.toggle('open');
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
      
      // Handle menu item clicks
      if (menu) {
        menu.querySelectorAll('.mu-dropdown-item').forEach(item => {
          item.addEventListener('click', (e) => {
            if (!item.classList.contains('active')) {
              menu.querySelectorAll('.mu-dropdown-item').forEach(i => {
                i.classList.remove('active');
              });
              item.classList.add('active');
              
              // Update button text for time range dropdown
              if (dropdown.classList.contains('time-range-dropdown')) {
                const rangeText = item.querySelector('span').textContent;
                dropdown.querySelector('.mu-btn span').textContent = rangeText;
              }
            }
          });
        });
      }
    });
  }
  
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedDropdowns();
  new ActivityGantt(); // Your existing Gantt chart initialization
});