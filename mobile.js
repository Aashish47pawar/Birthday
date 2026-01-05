let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;

  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;

  prevTouchX = 0;
  prevTouchY = 0;
  prevFingerAngle = 0; // Tracks angle between two fingers

  init(paper) {
    // --- TOUCH START ---
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // 1 Finger: Initialize Drag
      if (e.touches.length === 1) {
        this.prevTouchX = e.touches[0].clientX;
        this.prevTouchY = e.touches[0].clientY;
      }
      
      // 2 Fingers: Initialize Rotation
      if (e.touches.length === 2) {
        this.rotating = true;
        this.prevFingerAngle = this.getFingerAngle(e);
      }
    }, { passive: false });


    // --- TOUCH MOVE ---
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Stop Android scroll

      // Case 1: Dragging (1 finger)
      if (!this.rotating && e.touches.length === 1) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        this.velX = touchX - this.prevTouchX;
        this.velY = touchY - this.prevTouchY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevTouchX = touchX;
        this.prevTouchY = touchY;
      }

      // Case 2: Rotating (2 fingers)
      if (e.touches.length === 2) {
        this.rotating = true;
        
        const currentAngle = this.getFingerAngle(e);
        const angleChange = currentAngle - this.prevFingerAngle;
        
        this.rotation += angleChange;
        this.prevFingerAngle = currentAngle;
      }

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }, { passive: false });


    // --- TOUCH END ---
    paper.addEventListener('touchend', (e) => {
      this.holdingPaper = false;
      this.rotating = false;

      // SMOOTH RESET: If we lifted one finger but 1 remains, 
      // reset the 'prev' coordinates to avoid a "jump".
      if (e.touches.length === 1) {
        this.holdingPaper = true; // We are still holding it with 1 finger
        this.prevTouchX = e.touches[0].clientX;
        this.prevTouchY = e.touches[0].clientY;
      }
    });
  }

  // Helper function to calculate angle between two fingers
  getFingerAngle(e) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const deltaY = touch2.clientY - touch1.clientY;
    const deltaX = touch2.clientX - touch1.clientX;
    
    // atan2 gives angle in radians, convert to degrees
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
