document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeSwitch = document.getElementById('theme-switch');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    htmlElement.classList.add('dark-theme');
    themeSwitch.checked = true;
  }
  
  themeSwitch.addEventListener('change', function() {
    if (this.checked) {
      htmlElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Modal functionality
  const modal = document.getElementById('restock-modal');
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  
  // Open modal when restock button is clicked
  document.querySelectorAll('[title="Restock"]').forEach(button => {
    button.addEventListener('click', function() {
      // In a real app, you would populate the form with actual product data
      const row = this.closest('tr');
      const productName = row.cells[0].textContent;
      const currentStock = row.cells[3].querySelector('span').textContent.split('/')[0];
      
      document.getElementById('product-name').value = productName;
      document.getElementById('current-stock').value = currentStock;
      
      modal.style.display = 'flex';
    });
  });
  
  // Close modal
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Sortable table headers
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', function() {
      const sortBy = this.dataset.sort;
      const isAscending = this.classList.contains('asc');
      
      // Reset all headers
      document.querySelectorAll('.sortable').forEach(h => {
        h.classList.remove('asc', 'desc');
        h.querySelector('i').className = 'fas fa-sort';
      });
      
      // Set current header state
      this.classList.toggle('asc', !isAscending);
      this.classList.toggle('desc', isAscending);
      
      const icon = this.querySelector('i');
      icon.className = isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
      
      // In a real app, you would sort the table data here
      console.log(`Sorting by ${sortBy} in ${isAscending ? 'descending' : 'ascending'} order`);
    });
  });
  
  // Refresh button
  document.getElementById('refresh-stock').addEventListener('click', function() {
    // In a real app, this would refresh the data from the server
    this.querySelector('i').classList.add('fa-spin');
    setTimeout(() => {
      this.querySelector('i').classList.remove('fa-spin');
      // Show a toast notification or similar
      console.log('Stock data refreshed');
    }, 1000);
  });
  
  // Export button
  document.getElementById('export-btn').addEventListener('click', function() {
    // In a real app, this would trigger a file download
    console.log('Exporting stock data...');
  });
  
  // Initialize chart (placeholder - in a real app you would use Chart.js)
  const chartContainer = document.getElementById('stock-trend-chart');
  const chartCloseBtn = document.querySelector('.chart-close');
  
  // Toggle chart visibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 't' && e.ctrlKey) {
      chartContainer.classList.toggle('active');
    }
  });
  
  chartCloseBtn.addEventListener('click', function() {
    chartContainer.classList.remove('active');
  });
  
  // In a real app, you would initialize Chart.js here
  // const ctx = document.getElementById('stock-trend-canvas').getContext('2d');
  // new Chart(ctx, { ... });
});