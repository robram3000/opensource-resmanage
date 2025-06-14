document.addEventListener('DOMContentLoaded', function() {
  // Helper function to get CSS variables
  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Get colors from CSS variables
  const accentColor = getCssVar('--accent-color');
  const successColor = getCssVar('--success-color');
  const warningColor = getCssVar('--warning-color');
  const dangerColor = getCssVar('--danger-color');
  const primaryColor = getCssVar('--primary-color');
  const borderColor = getCssVar('--border-color');

  // 1. Hourly Sales Chart
  const hourlySalesCtx = document.getElementById('hourlySalesChart').getContext('2d');
  new Chart(hourlySalesCtx, {
    type: 'line',
    data: {
      labels: ['11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
      datasets: [{
        label: 'Lunch',
        data: [450, 1200, 1800, 950, 400, 300, 600, 1200, 1800, 2200, 1500, 800],
        borderColor: primaryColor,
        backgroundColor: `rgba(${primaryColor}, 0.1)`,
        tension: 0.3,
        fill: true
      }, {
        label: 'Dinner',
        data: [0, 0, 0, 0, 0, 200, 800, 1500, 2400, 2800, 2100, 1200],
        borderColor: accentColor,
        backgroundColor: `rgba(${accentColor}, 0.1)`,
        tension: 0.3,
        fill: true
      }]
    },
    options: getChartOptions('Hourly Sales Trends ($)')
  });

  // 2. Daily Sales Chart
  const dailySalesCtx = document.getElementById('dailySalesChart').getContext('2d');
  new Chart(dailySalesCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales',
        data: [4200, 4500, 4800, 5200, 6800, 8500, 7800],
        backgroundColor: [
          `rgba(${accentColor}, 0.7)`,
          `rgba(${accentColor}, 0.7)`,
          `rgba(${accentColor}, 0.7)`,
          `rgba(${accentColor}, 0.7)`,
          `rgba(${successColor}, 0.7)`,
          `rgba(${successColor}, 0.7)`,
          `rgba(${successColor}, 0.7)`
        ],
        borderColor: `rgba(${accentColor}, 1)`,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: getChartOptions('Daily Sales ($)', true)
  });

  // 3. Category Sales Chart (Pie)
  const categorySalesCtx = document.getElementById('categorySalesChart').getContext('2d');
  new Chart(categorySalesCtx, {
    type: 'doughnut',
    data: {
      labels: ['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Alcohol'],
      datasets: [{
        data: [18, 45, 15, 12, 10],
        backgroundColor: [
          `rgba(${primaryColor}, 0.7)`,
          `rgba(${accentColor}, 0.7)`,
          `rgba(${warningColor}, 0.7)`,
          `rgba(${successColor}, 0.7)`,
          `rgba(${dangerColor}, 0.7)`
        ],
        borderColor: `rgba(${borderColor}, 0.2)`,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: getCssVar('--text-color'),
            font: {
              family: getCssVar('--font-family-sans-serif')
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${percentage}% ($${(value * 40).toLocaleString()})`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // Common chart options
  function getChartOptions(title, isBar = false) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          color: getCssVar('--text-color'),
          font: {
            family: getCssVar('--font-family-sans-serif'),
            size: 14
          }
        },
        legend: {
          labels: {
            color: getCssVar('--text-color'),
            font: {
              family: getCssVar('--font-family-sans-serif')
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label || ''}: $${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: !isBar,
          ticks: {
            color: getCssVar('--text-secondary'),
            callback: function(value) {
              return `${value.toLocaleString()}`;
            }
          },
          grid: {
            color: `rgba(${borderColor}, 0.1)`
          }
        },
        x: {
          ticks: {
            color: getCssVar('--text-secondary')
          },
          grid: {
            color: `rgba(${borderColor}, 0.1)`,
            display: !isBar
          }
        }
      }
    };
  }
});