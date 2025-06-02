class Stopwatch {
  constructor() {
    // DOM elements
    this.hoursElement = document.getElementById('hours');
    this.minutesElement = document.getElementById('minutes');
    this.secondsElement = document.getElementById('seconds');
    this.millisecondsElement = document.getElementById('milliseconds');
    this.startBtn = document.getElementById('start-btn');
    this.lapBtn = document.getElementById('lap-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.lapsList = document.getElementById('laps-list');
    
    // State variables
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.laps = [];
    this.running = false;
    this.lapTimes = [];
    
    // Motivational messages
    this.messages = {
      start: [
        "Time to make it count! 🚀",
        "Every second is an opportunity! ✨",
        "Let's achieve greatness! 💪",
        "Your journey begins now! 🌟",
        "Make every moment matter! ⭐"
      ],
      milestone: [
        "Keep going strong! 🔥",
        "You're crushing it! 💪",
        "Fantastic progress! 🌟",
        "Stay focused, stay amazing! ✨",
        "You're doing great! 🎯"
      ],
      achievement: [
        "New personal best! 🏆",
        "You're unstoppable! 🌟",
        "Outstanding performance! 🎉",
        "Breaking records! 💫",
        "Excellence achieved! 🔥"
      ]
    };
    
    // Binding methods to this instance
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.recordLap = this.recordLap.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.showMessage = this.showMessage.bind(this);
    
    // Load saved state from localStorage if available
    this.loadState();
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  showMessage(type) {
    const messages = this.messages[type];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const messageElement = document.createElement('div');
    messageElement.className = 'motivation-message';
    messageElement.textContent = message;
    
    document.querySelector('.stopwatch-container').appendChild(messageElement);
    
    // Animate and remove after animation
    setTimeout(() => {
      messageElement.classList.add('show');
      setTimeout(() => {
        messageElement.classList.add('hide');
        setTimeout(() => messageElement.remove(), 500);
      }, 2000);
    }, 100);
  }
  
  initEventListeners() {
    this.startBtn.addEventListener('click', () => {
      if (this.running) {
        this.pause();
      } else {
        this.start();
      }
    });
    
    this.resetBtn.addEventListener('click', this.reset);
    this.lapBtn.addEventListener('click', this.recordLap);
    
    // Update the display initially
    this.updateDisplay();
  }
  
  start() {
    if (!this.running) {
      const stopwatchContainer = document.querySelector('.stopwatch-container');
      stopwatchContainer.classList.add('running');
      
      this.running = true;
      this.startTime = Date.now() - this.elapsedTime;
      this.timerInterval = setInterval(this.updateDisplay, 10);
      
      // Show start message
      this.showMessage('start');
      
      // Update button states and appearance
      this.startBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        Pause
      `;
      this.startBtn.classList.remove('start-btn');
      this.startBtn.classList.add('pause-btn');
      this.lapBtn.disabled = false;
      this.resetBtn.disabled = false;
      
      // Save state
      this.saveState();
    }
  }
  
  pause() {
    if (this.running) {
      const stopwatchContainer = document.querySelector('.stopwatch-container');
      stopwatchContainer.classList.remove('running');
      
      this.running = false;
      clearInterval(this.timerInterval);
      this.elapsedTime = Date.now() - this.startTime;
      
      // Update button states and appearance
      this.startBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Resume
      `;
      this.startBtn.classList.remove('pause-btn');
      this.startBtn.classList.add('start-btn');
      
      // Save state
      this.saveState();
    }
  }
  
  reset() {
    clearInterval(this.timerInterval);
    this.running = false;
    this.elapsedTime = 0;
    this.laps = [];
    this.lapTimes = [];
    
    const stopwatchContainer = document.querySelector('.stopwatch-container');
    stopwatchContainer.classList.remove('running');
    
    // Reset display
    this.updateDisplay();
    this.renderLaps();
    
    // Update button states
    this.startBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      Start
    `;
    this.startBtn.classList.remove('pause-btn');
    this.startBtn.classList.add('start-btn');
    this.lapBtn.disabled = true;
    this.resetBtn.disabled = true;
    
    // Clear saved state
    localStorage.removeItem('stopwatchState');
  }
  
  recordLap() {
    if (this.running) {
      const lapTime = this.elapsedTime;
      const lapNumber = this.laps.length + 1;
      const previousLapTime = this.laps.length > 0 ? this.laps[this.laps.length - 1].totalTime : 0;
      const splitTime = lapTime - previousLapTime;
      
      this.lapTimes.push(splitTime);
      
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      this.laps.push({
        number: lapNumber,
        splitTime: splitTime,
        totalTime: lapTime,
        timestamp: timestamp
      });
      
      // Show milestone message every 5 laps
      if (lapNumber % 5 === 0) {
        this.showMessage('milestone');
      }
      
      // Check if this is the fastest lap (excluding first lap)
      if (this.laps.length > 1) {
        const fastestSplit = Math.min(...this.lapTimes.slice(1));
        if (splitTime === fastestSplit) {
          this.showMessage('achievement');
        }
      }
      
      this.renderLaps();
      this.saveState();
    }
  }
  
  updateDisplay() {
    if (this.running) {
      this.elapsedTime = Date.now() - this.startTime;
    }
    
    // Calculate hours, minutes, seconds, and milliseconds
    const totalSeconds = Math.floor(this.elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);
    
    // Update display
    this.hoursElement.textContent = hours.toString().padStart(2, '0');
    this.minutesElement.textContent = minutes.toString().padStart(2, '0');
    this.secondsElement.textContent = seconds.toString().padStart(2, '0');
    this.millisecondsElement.textContent = milliseconds.toString().padStart(2, '0');
  }
  
  renderLaps() {
    // Clear existing laps
    this.lapsList.innerHTML = '';
    
    if (this.laps.length === 0) {
      this.lapsList.innerHTML = '<div class="empty-laps">No laps recorded yet</div>';
      return;
    }
    
    // Find fastest and slowest lap times (ignore the first lap)
    let fastestLap = Infinity;
    let slowestLap = 0;
    let fastestLapIndex = -1;
    let slowestLapIndex = -1;
    
    if (this.lapTimes.length > 1) {
      for (let i = 0; i < this.lapTimes.length; i++) {
        if (this.lapTimes[i] < fastestLap) {
          fastestLap = this.lapTimes[i];
          fastestLapIndex = i;
        }
        if (this.lapTimes[i] > slowestLap) {
          slowestLap = this.lapTimes[i];
          slowestLapIndex = i;
        }
      }
    }
    
    // Render each lap
    this.laps.forEach((lap, index) => {
      const lapItem = document.createElement('div');
      lapItem.className = 'lap-item';
      
      // Format split time
      const splitHours = Math.floor(lap.splitTime / 3600000);
      const splitMinutes = Math.floor((lap.splitTime % 3600000) / 60000);
      const splitSeconds = Math.floor((lap.splitTime % 60000) / 1000);
      const splitMilliseconds = Math.floor((lap.splitTime % 1000) / 10);
      
      const splitTimeFormatted = `${splitHours.toString().padStart(2, '0')}:${splitMinutes.toString().padStart(2, '0')}:${splitSeconds.toString().padStart(2, '0')}.${splitMilliseconds.toString().padStart(2, '0')}`;
      
      // Add class for fastest/slowest lap
      let timeClass = '';
      if (index === fastestLapIndex) {
        timeClass = 'fastest-lap';
      } else if (index === slowestLapIndex) {
        timeClass = 'slowest-lap';
      }
      
      lapItem.innerHTML = `
        <div class="lap-number">Lap ${lap.number}</div>
        <div class="lap-time ${timeClass}">${splitTimeFormatted}</div>
        <div class="lap-timestamp">${lap.timestamp}</div>
      `;
      
      this.lapsList.insertBefore(lapItem, this.lapsList.firstChild);
    });
  }
  
  saveState() {
    const state = {
      elapsedTime: this.elapsedTime,
      running: this.running,
      startTime: this.startTime,
      laps: this.laps,
      lapTimes: this.lapTimes
    };
    
    localStorage.setItem('stopwatchState', JSON.stringify(state));
  }
  
  loadState() {
    const savedState = localStorage.getItem('stopwatchState');
    
    if (savedState) {
      const state = JSON.parse(savedState);
      
      this.laps = state.laps || [];
      this.lapTimes = state.lapTimes || [];
      
      if (state.running) {
        // Calculate new elapsed time based on when it was paused plus time since then
        const timeSinceSave = Date.now() - state.startTime;
        this.elapsedTime = state.elapsedTime + timeSinceSave;
        // Don't auto-start the timer, just update the display
      } else {
        this.elapsedTime = state.elapsedTime || 0;
      }
      
      // Update display and lap list
      this.updateDisplay();
      this.renderLaps();
      
      // Update button states
      if (this.elapsedTime > 0) {
        this.resetBtn.disabled = false;
        this.lapBtn.disabled = !state.running;
      }
      
      if (state.running) {
        // Don't auto-start, just update the UI to show it's paused
        this.startBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Resume
        `;
      }
    }
  }
}