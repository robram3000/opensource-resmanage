document.addEventListener('DOMContentLoaded', function() {
  // Sales Performance Chart (Line Chart)
  const salesCtx = document.getElementById('salesChart').getContext('2d');
  const salesChart = new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Total Sales',
        data: [12500, 19000, 15000, 18000, 22000, 19500, 23000, 25000, 21000, 24000, 26000, 28000],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
        backgroundColor: 'rgba(15, 87, 136, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }, {
        label: 'Food Sales',
        data: [8000, 12000, 9500, 11000, 14000, 12500, 15000, 16000, 13500, 15500, 17000, 18000],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--success-color'),
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }, {
        label: 'Beverage Sales',
        data: [4500, 7000, 5500, 7000, 8000, 7000, 8000, 9000, 7500, 8500, 9000, 10000],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--info-color'),
        backgroundColor: 'rgba(23, 162, 184, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
          titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
          }
        },
        y: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
            callback: function(value) {
              return '' + value.toLocaleString();
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });

  // Revenue Sources Chart (Doughnut Chart)
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  const revenueChart = new Chart(revenueCtx, {
    type: 'doughnut',
    data: {
      labels: ['Dine-in', 'Takeaway', 'Delivery', 'Catering'],
      datasets: [{
        data: [45, 30, 20, 5],
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
          getComputedStyle(document.documentElement).getPropertyValue('--success-color'),
          getComputedStyle(document.documentElement).getPropertyValue('--info-color'),
          getComputedStyle(document.documentElement).getPropertyValue('--warning-color')
        ],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
          titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.raw + '%';
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // Top Menu Items Chart (Bar Chart)
  const menuItemsCtx = document.getElementById('menuItemsChart').getContext('2d');
  const menuItemsChart = new Chart(menuItemsCtx, {
    type: 'bar',
    data: {
      labels: ['Margherita Pizza', 'Caesar Salad', 'Pasta Carbonara', 'Grilled Salmon', 'Tiramisu'],
      datasets: [{
        label: 'Items Sold',
        data: [320, 280, 240, 180, 150],
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
          getComputedStyle(document.documentElement).getPropertyValue('--accent-light'),
          getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
          getComputedStyle(document.documentElement).getPropertyValue('--info-color'),
          getComputedStyle(document.documentElement).getPropertyValue('--warning-color')
        ],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
          titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
          }
        },
        y: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
            stepSize: 50
          }
        }
      }
    }
  });

  // Inventory Status Chart (Radar Chart)
  const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
  const inventoryChart = new Chart(inventoryCtx, {
    type: 'radar',
    data: {
      labels: ['Meat', 'Vegetables', 'Dairy', 'Grains', 'Spices', 'Beverages'],
      datasets: [{
        label: 'Current Stock',
        data: [75, 90, 65, 85, 70, 80],
        backgroundColor: 'rgba(15, 87, 136, 0.2)',
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
        borderWidth: 2,
        pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
        pointBorderColor: '#fff',
        pointHoverRadius: 5
      }, {
        label: 'Reorder Level',
        data: [30, 30, 30, 30, 30, 30],
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--danger-color'),
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--danger-color'),
        pointBorderColor: '#fff',
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
          }
        },
        tooltip: {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
          titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
          borderWidth: 1
        }
      },
      scales: {
        r: {
          angleLines: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          pointLabels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
            backdropColor: 'transparent'
          }
        }
      }
    }
  });

  // Reservation Trends Chart (Line Chart)
  const reservationCtx = document.getElementById('reservationChart').getContext('2d');
  const reservationChart = new Chart(reservationCtx, {
    type: 'line',
    data: {
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
      datasets: [{
        label: 'Weekday Reservations',
        data: [5, 10, 25, 15, 40, 20],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
        backgroundColor: 'rgba(44, 62, 80, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }, {
        label: 'Weekend Reservations',
        data: [10, 20, 35, 25, 60, 40],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
        backgroundColor: 'rgba(15, 87, 136, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
          }
        },
        tooltip: {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface-color'),
          titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
          }
        },
        y: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
            stepSize: 10
          }
        }
      }
    }
  });

  // Theme Toggle Functionality
  const themeToggle = document.querySelector('.btn-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update all charts to reflect theme changes
      updateChartsForTheme();
    });
  }

  // Sidebar Toggle Functionality
  const sidebarToggle = document.querySelector('.btn-sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
    });
  }

  // Function to update charts when theme changes
  function updateChartsForTheme() {
    // Update all charts with new theme colors
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--surface-color');
    
    // Update each chart's options
    const charts = [salesChart, revenueChart, menuItemsChart, inventoryChart, reservationChart];
    
    charts.forEach(chart => {
      if (chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }
      
      if (chart.options.plugins.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = surfaceColor;
        chart.options.plugins.tooltip.titleColor = textColor;
        chart.options.plugins.tooltip.bodyColor = textColor;
        chart.options.plugins.tooltip.borderColor = borderColor;
      }
      
      if (chart.options.scales) {
        if (chart.options.scales.x) {
          chart.options.scales.x.ticks.color = textSecondary;
          if (chart.options.scales.x.grid) {
            chart.options.scales.x.grid.color = borderColor;
          }
        }
        
        if (chart.options.scales.y) {
          chart.options.scales.y.ticks.color = textSecondary;
          if (chart.options.scales.y.grid) {
            chart.options.scales.y.grid.color = borderColor;
          }
        }
        
        if (chart.options.scales.r) {
          chart.options.scales.r.angleLines.color = borderColor;
          chart.options.scales.r.grid.color = borderColor;
          chart.options.scales.r.pointLabels.color = textSecondary;
          chart.options.scales.r.ticks.color = textSecondary;
        }
      }
      
      chart.update();
    });
  }

  // Check for saved theme preference
  function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  // Initialize
  checkSavedTheme();
});