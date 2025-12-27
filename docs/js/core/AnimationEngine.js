/**
 * AnimationEngine - Manages the canvas, render loop, and timing
 */
class AnimationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Sizing
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Timing
    this.targetFps = 60;
    this.frameDuration = 1000 / this.targetFps;
    this.lastTimestamp = 0;
    this.elapsedTime = 0;
    this.rotation = 0;
    this.degPerSec = 10;
    
    // State
    this.paused = false;
    this.isRunning = false;
    
    // Scene reference (set via setScene)
    this.scene = null;
  }

  /**
   * Set the scene to render
   * @param {Scene} scene - The scene instance
   */
  setScene(scene) {
    this.scene = scene;
  }

  /**
   * Resize canvas to fill window
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    
    // Update global references for backward compatibility
    if (typeof centerX !== 'undefined') {
      centerX = this.centerX;
      centerY = this.centerY;
    }
    if (typeof ctx !== 'undefined') {
      ctx = this.ctx;
    }
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Main render loop
   */
  render(timestamp) {
    if (!this.isRunning) return;
    
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }
    
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    
    let adjustedDeltaTime = 0;
    
    if (!this.paused) {
      this.rotation += this.degPerSec / this.targetFps;
      this.elapsedTime += deltaTime;
      adjustedDeltaTime = deltaTime / 100;
    }
    
    const adjustedElapsed = this.elapsedTime / 1000;
    
    // Clear and draw
    this.clear();
    if (this.scene) {
      this.scene.draw(adjustedElapsed, adjustedDeltaTime);
    }
    
    requestAnimationFrame((ts) => this.render(ts));
  }

  /**
   * Start the animation loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = 0;
    requestAnimationFrame((ts) => this.render(ts));
  }

  /**
   * Stop the animation loop
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    this.paused = !this.paused;
    return this.paused;
  }

  /**
   * Reset rotation/timing
   */
  reset() {
    this.rotation = 0;
    this.elapsedTime = 0;
  }

  /**
   * Step forward one frame
   */
  stepForward() {
    this.rotation += this.degPerSec / this.targetFps;
  }

  /**
   * Step backward one frame
   */
  stepBackward() {
    this.rotation -= this.degPerSec / this.targetFps;
  }

  /**
   * Set degrees per second
   */
  setSpeed(degPerSec) {
    this.degPerSec = parseFloat(degPerSec);
  }

  /**
   * Get canvas context (for shapes that need direct access)
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Get center coordinates
   */
  getCenter() {
    return { x: this.centerX, y: this.centerY };
  }
}
