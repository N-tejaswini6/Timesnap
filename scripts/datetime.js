// Date and time management
document.addEventListener('DOMContentLoaded', () => {
  const timeElement = document.getElementById('current-time');
  const dayElement = document.getElementById('current-day');
  const dateElement = document.getElementById('current-date');
  
  // Update the date and time
  function updateDateTime() {
    const now = new Date();
    
    // Format time (12-hour with AM/PM)
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = (hours % 12) || 12; // Convert to 12-hour format
    
    const timeString = `${hours12}:${minutes}:${seconds} ${ampm}`;
    timeElement.textContent = timeString;
    
    // Get day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[now.getDay()];
    dayElement.textContent = dayOfWeek;
    
    // Format date (e.g., "15 May 2025")
    const date = now.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    const dateString = `${date} ${month} ${year}`;
    dateElement.textContent = dateString;
  }
  
  // Update immediately and then every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
});