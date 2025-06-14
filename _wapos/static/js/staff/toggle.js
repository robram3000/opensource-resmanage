document.getElementById('POS-themeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-theme');
  
  // Save preference to localStorage
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('darkTheme', isDark);
  
  // Update icon
  const icon = this.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
});

// Check for saved theme preference
if (localStorage.getItem('darkTheme') === 'true') {
  document.body.classList.add('dark-theme');
  const icon = document.querySelector('#POS-themeToggle i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}


// Left sidebar toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
  // Toggle view buttons
  const viewButtons = document.querySelectorAll('.view-toggle button');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      // You would add logic here to switch between views
    });
  });
  
  // Table click handler
  const tables = document.querySelectorAll('.table-card');
  tables.forEach(table => {
    table.addEventListener('click', function() {
      // Add your table selection logic here
      tables.forEach(t => t.classList.remove('selected'));
      this.classList.add('selected');
      
      // Example: Load table details into main POS interface
      const tableNumber = this.querySelector('.table-number').textContent;
      console.log(`Table ${tableNumber} selected`);
    });
  });
});