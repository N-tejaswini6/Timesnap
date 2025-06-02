// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize stopwatch
  const stopwatch = new Stopwatch();
  
  // Add metadata to document title
  updateDocumentTitle();
  
  // Handle visibility change (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Force update the display when tab becomes visible again
      updateDocumentTitle();
    }
  });
  
  // Update document title with current time
  function updateDocumentTitle() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.title = `Timeshap | ${timeString}`;
  }
  
  // Change title periodically
  setInterval(updateDocumentTitle, 60000); // Update every minute
  
  // Apply subtle background gradient based on time of day
  applyTimeBasedGradient();
  setInterval(applyTimeBasedGradient, 300000); // Update every 5 minutes
  
  function applyTimeBasedGradient() {
    const now = new Date();
    const hour = now.getHours();
    let gradientColors;
    
    // Morning: 5am-11am
    if (hour >= 5 && hour < 11) {
      gradientColors = 'linear-gradient(135deg, rgba(255, 190, 111, 0.05), rgba(255, 119, 61, 0.05))';
    }
    // Midday: 11am-4pm
    else if (hour >= 11 && hour < 16) {
      gradientColors = 'linear-gradient(135deg, rgba(100, 181, 246, 0.05), rgba(41, 121, 255, 0.05))';
    }
    // Evening: 4pm-8pm
    else if (hour >= 16 && hour < 20) {
      gradientColors = 'linear-gradient(135deg, rgba(255, 183, 77, 0.05), rgba(255, 111, 0, 0.05))';
    }
    // Night: 8pm-5am
    else {
      gradientColors = 'linear-gradient(135deg, rgba(66, 66, 66, 0.05), rgba(25, 25, 25, 0.05))';
    }
    
    document.body.style.backgroundImage = gradientColors;
  }
});

// Show welcome message on first visit
(() => {
  const hasVisited = localStorage.getItem('hasVisited');
  
  if (!hasVisited) {
    // Create welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px var(--shadow);
      z-index: 1000;
      max-width: 90%;
      width: 400px;
      text-align: center;
      animation: fadeIn 0.5s ease-out;
      border: 1px solid var(--border);
    `;
    
    welcomeMessage.innerHTML = `
      <h3 style="margin: 0 0 8px; font-size: 1.2rem;">Welcome to Timeshap!</h3>
      <p style="margin: 0 0 16px;">A professional stopwatch application with advanced features.</p>
      <button id="welcome-close" style="
        background: var(--accent);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      ">Got it</button>
    `;
    
    document.body.appendChild(welcomeMessage);
    
    // Close button functionality
    document.getElementById('welcome-close').addEventListener('click', () => {
      welcomeMessage.style.animation = 'fadeIn 0.3s ease-in reverse';
      setTimeout(() => {
        welcomeMessage.remove();
      }, 300);
      localStorage.setItem('hasVisited', 'true');
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.body.contains(welcomeMessage)) {
        welcomeMessage.style.animation = 'fadeIn 0.3s ease-in reverse';
        setTimeout(() => {
          welcomeMessage.remove();
        }, 300);
        localStorage.setItem('hasVisited', 'true');
      }
    }, 10000);
  }
})();