// Theme management
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const lightIcon = document.getElementById('light-icon');
  const darkIcon = document.getElementById('dark-icon');
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
    updateThemeIcons(true);
  } else {
    updateThemeIcons(false);
  }
  
  // Theme toggle functionality
  themeToggleBtn.addEventListener('click', () => {
    // Add transition class for smooth color changes
    document.body.classList.add('theme-transition');
    
    // Toggle theme
    const isDarkMode = document.body.classList.toggle('dark-theme');
    
    // Update local storage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update visible icon
    updateThemeIcons(isDarkMode);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 500);
  });
  
  // Function to update theme icons visibility
  function updateThemeIcons(isDarkMode) {
    if (isDarkMode) {
      darkIcon.style.display = 'none';
      lightIcon.style.display = 'block';
    } else {
      darkIcon.style.display = 'block';
      lightIcon.style.display = 'none';
    }
  }
});