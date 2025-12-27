//jshint esversion:8

/**
 * Animation Framework - Main Entry Point
 * 
 * This file initializes the animation engine and control system.
 * Shapes are registered via shapeRegistry and managed through the Scene.
 */

// ============================================
// Global references (for backward compatibility with shapes)
// ============================================
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let centerX = ctx.canvas.width / 2;
let centerY = ctx.canvas.height / 2;

// ============================================
// Initialize Core Systems
// ============================================

// Create animation engine and connect it to the scene
const engine = new AnimationEngine('myCanvas');
engine.setScene(scene);

// Initialize Scene UI
const sceneUI = new SceneUI(scene, 'layers-container');

// ============================================
// Event Listeners
// ============================================

let toolbarShowing = true;
document.addEventListener("keydown", toggleSettings);

// ============================================
// UI Control Functions
// ============================================

function manualToggleSettings() {
  toolbarShowing = !toolbarShowing;
  let tb = document.getElementById("toolbar");
  tb.style.display = toolbarShowing ? "flex" : "none";
}

function toggleSettings(e) {
  if (e.key == "p") {
    toolbarShowing = !toolbarShowing;
  }
  if (e.code === "Space") {
    engine.togglePause();
  }

  let tb = document.getElementById("toolbar");
  tb.style.display = toolbarShowing ? "flex" : "none";
}

function TogglePause() {
  let pb = document.getElementById("pauseButton");
  const paused = engine.togglePause();
  pb.textContent = paused ? "Play" : "Pause";
}

function Reset() {
  engine.reset();
}

function ForwardFrame() {
  engine.stepForward();
}

function BackwardFrame() {
  engine.stepBackward();
}

function ChangeDegPerSec(newValue) {
  engine.setSpeed(newValue);
}

function render_clear() {
  engine.clear();
}

// Start animation
window.onload = function() {
  engine.start();
};
