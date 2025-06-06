class ActivityGantt {
  constructor() {
    this.container = document.querySelector('.activity-gantt-container');
    this.leftPanelBody = document.querySelector('.activity-gantt-table-body');
    this.rightPanelRows = document.querySelector('.activity-gantt-rows');
    this.weekHeader = document.querySelector('.activity-gantt-week-header');
    this.monthTitle = document.querySelector('.activity-gantt-month-title');
    this.currentRange = document.querySelector('.activity-gantt-current-range');
    
    // Sample data - in a real app, this would come from an API
    this.logs = [
      {
        id: 'LOG-001',
        event: 'User Login',
        user: 'john.doe',
        type: 'user',
        startTime: '2025-08-01T09:00:00',
        endTime: '2025-08-01T09:30:00'
      },
      {
        id: 'LOG-002',
        event: 'Data Export',
        user: 'jane.smith',
        type: 'user',
        startTime: '2025-08-01T10:15:00',
        endTime: '2025-08-01T11:45:00'
      },
      {
        id: 'LOG-003',
        event: 'Report Generation',
        user: 'john.doe',
        type: 'user',
        startTime: '2025-08-02T14:00:00',
        endTime: '2025-08-02T15:30:00'
      },
      {
        id: 'LOG-004',
        event: 'System Update',
        user: 'admin',
        type: 'system',
        startTime: '2025-08-03T03:00:00',
        endTime: '2025-08-03T05:00:00'
      },
      {
        id: 'LOG-005',
        event: 'Database Backup',
        user: 'system',
        type: 'system',
        startTime: '2025-08-05T00:00:00',
        endTime: '2025-08-05T01:30:00'
      },
      {
        id: 'LOG-006',
        event: 'Security Audit',
        user: 'admin',
        type: 'admin',
        startTime: '2025-08-05T09:00:00',
        endTime: '2025-08-05T12:00:00'
      },
      {
        id: 'LOG-007',
        event: 'API Maintenance',
        user: 'system',
        type: 'system',
        startTime: '2025-08-06T02:00:00',
        endTime: '2025-08-06T04:30:00'
      }
    ];
    
    this.currentMonth = 7; // August (0-indexed)
    this.currentYear = 2025;
    this.dayWidth = 60; // px
    
    this.init();
  }
  
  init() {
    this.renderLogList();
    this.renderWeekHeader();
    this.renderGanttChart();
    this.setupEventListeners();
    this.setupCurrentTimeIndicator();
  }
  
  renderLogList() {
    this.leftPanelBody.innerHTML = '';
    
    this.logs.forEach(log => {
      const logItem = document.createElement('div');
      logItem.className = 'activity-gantt-log-item';
      logItem.dataset.logId = log.id;
      
      const duration = this.formatDuration(
        new Date(log.startTime), 
        new Date(log.endTime)
      );
      
      logItem.innerHTML = `
        <div class="activity-gantt-log-cell">${log.id}</div>
        <div class="activity-gantt-log-cell">${log.event}</div>
        <div class="activity-gantt-log-cell">${log.user}</div>
        <div class="activity-gantt-log-cell">${duration}</div>
      `;
      
      this.leftPanelBody.appendChild(logItem);
    });
  }
  
  renderWeekHeader() {
    // Clear existing headers
    this.weekHeader.innerHTML = '';
    
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    
    // Adjust for Monday as first day of week
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Render day headers for the entire month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayHeader = document.createElement('div');
      dayHeader.className = 'activity-gantt-day-header';
      
      dayHeader.innerHTML = `
        <div class="activity-gantt-day-label">${dayName}</div>
        <div class="activity-gantt-day-date">${day}</div>
      `;
      
      this.weekHeader.appendChild(dayHeader);
    }
    
    // Update month title
    const monthName = new Date(this.currentYear, this.currentMonth, 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
    this.monthTitle.textContent = monthName;
    this.currentRange.textContent = monthName;
  }
  
  renderGanttChart() {
    this.rightPanelRows.innerHTML = '';
    
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    
    // Add current time indicator
    const now = new Date();
    if (now.getMonth() === this.currentMonth && now.getFullYear() === this.currentYear) {
      const currentTimePos = (now.getDate() - 1) * this.dayWidth + 
                           (now.getHours() / 24 * this.dayWidth);
      
      const timeMarker = document.createElement('div');
      timeMarker.className = 'activity-gantt-current-time';
      timeMarker.style.left = `${currentTimePos}px`;
      this.rightPanelRows.appendChild(timeMarker);
    }
    
    this.logs.forEach((log, index) => {
      const row = document.createElement('div');
      row.className = 'activity-gantt-row';
      row.dataset.logId = log.id;
      
      // Add row label
      const rowLabel = document.createElement('div');
      rowLabel.className = 'activity-gantt-row-label';
      rowLabel.textContent = log.event;
      row.appendChild(rowLabel);
      
      const barContainer = document.createElement('div');
      barContainer.className = 'activity-gantt-bar-container';
      
      const startDate = new Date(log.startTime);
      const endDate = new Date(log.endTime);
      
      // Only show bars for logs in the current month
      if (startDate.getMonth() === this.currentMonth && startDate.getFullYear() === this.currentYear) {
        const startDay = startDate.getDate();
        const startHour = startDate.getHours() + (startDate.getMinutes() / 60);
        
        const durationHours = (endDate - startDate) / (1000 * 60 * 60);
        const durationDays = durationHours / 24;
        
        // Calculate bar position and width
        const left = (startDay - 1) * this.dayWidth + (startHour / 24 * this.dayWidth);
        const width = durationDays * this.dayWidth;
        
        // Determine bar color based on event type
        let barColor = 'var(--accent-color)';
        if (log.type === 'system') barColor = 'var(--success-color)';
        if (log.type === 'admin') barColor = 'var(--warning-color)';
        
        // Create the bar
        const bar = document.createElement('div');
        bar.className = 'activity-gantt-bar';
        bar.style.left = `${left}px`;
        bar.style.width = `${Math.max(width, 4)}px`; // Minimum 4px width
        bar.style.backgroundColor = barColor;
        
        // Create bar info tooltip
        const barInfo = document.createElement('div');
        barInfo.className = 'activity-gantt-bar-info';
        barInfo.innerHTML = `
          <strong>${log.event}</strong>
          <div>User: ${log.user}</div>
          <div>Start: ${startDate.toLocaleString()}</div>
          <div>End: ${endDate.toLocaleString()}</div>
          <div>Duration: ${this.formatDuration(startDate, endDate)}</div>
        `;
        
        bar.appendChild(barInfo);
        barContainer.appendChild(bar);
        
        // If this log continues to the next day, add a connector
        if (endDate.getDate() > startDate.getDate()) {
          const connectorWidth = (endDate.getDate() - startDate.getDate()) * this.dayWidth;
          const connector = document.createElement('div');
          connector.className = 'activity-gantt-bar-connector';
          connector.style.left = `${left + width}px`;
          connector.style.width = `${connectorWidth}px`;
          connector.style.backgroundColor = barColor;
          barContainer.appendChild(connector);
        }
      }
      
      row.appendChild(barContainer);
      this.rightPanelRows.appendChild(row);
    });
  }
  
  setupCurrentTimeIndicator() {
    // Update current time indicator every minute
    setInterval(() => {
      const now = new Date();
      if (now.getMonth() === this.currentMonth && now.getFullYear() === this.currentYear) {
        const currentTimePos = (now.getDate() - 1) * this.dayWidth + 
                             (now.getHours() / 24 * this.dayWidth);
        
        const timeMarker = document.querySelector('.activity-gantt-current-time');
        if (timeMarker) {
          timeMarker.style.left = `${currentTimePos}px`;
        }
      }
    }, 60000);
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
  
  setupEventListeners() {
    // Highlight row when log item is clicked
    this.leftPanelBody.addEventListener('click', (e) => {
      const logItem = e.target.closest('.activity-gantt-log-item');
      if (!logItem) return;
      
      // Remove active class from all items
      document.querySelectorAll('.activity-gantt-log-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Remove active class from all rows
      document.querySelectorAll('.activity-gantt-row').forEach(row => {
        row.classList.remove('active');
      });
      
      // Add active class to clicked item and corresponding row
      logItem.classList.add('active');
      const logId = logItem.dataset.logId;
      const ganttRow = document.querySelector(`.activity-gantt-row[data-log-id="${logId}"]`);
      if (ganttRow) {
        ganttRow.classList.add('active');
        ganttRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    // Navigation buttons
    const prevBtn = this.container.querySelector('.activity-gantt-navigation .mu-btn:first-child');
    const nextBtn = this.container.querySelector('.activity-gantt-navigation .mu-btn:last-child');
    
    prevBtn.addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderWeekHeader();
      this.renderGanttChart();
    });
    
    nextBtn.addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderWeekHeader();
      this.renderGanttChart();
    });
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