/**
 * Countdown - Countdown timer display with progress bar
 */
class Countdown extends BaseShape {
  static config = [
    { type: 'range', min: 8000, max: 2000000, defaultValue: 10000, property: 'milestone' },
  ];

  constructor(milestone) {
    super();
    this.milestone = milestone;
  }

  secondsUntilDate(targetDate) {
    const now = new Date();
    // Parse the date string as NZ time (UTC+13:00 during NZDT, UTC+12:00 during NZST)
    // The date string should be in format: '2026-01-01T07:33:20'
    // We interpret this as NZ local time and convert to UTC
    const target = new Date(targetDate + '+13:00'); // +13:00 for NZDT, change to +12:00 for NZST
    const difference = target.getTime() - now.getTime();
    return Math.max(0, Math.round(difference / 1000)); // Don't return negative values
  }

  drawProgressBar(progress) {
    const colourBackground = "#0c2f69";
    const colourProgress = "#4287f5";
    const barWidth = ctx.canvas.width;
    const barHeight = 60;
    const barX = 0;
    const barY = ctx.canvas.height - barHeight;

    ctx.fillStyle = colourBackground;
    ctx.beginPath();
    ctx.rect(barX, barY, barWidth, barHeight);
    ctx.fill();

    ctx.fillStyle = colourProgress;
    ctx.beginPath();
    ctx.rect(barX, barY, (barWidth / 100) * progress, barHeight);
    ctx.fill();
  }

  draw(elapsed) {
    let fontSize = 48;
    if (ctx.canvas.width < 1000) {
      fontSize = 24;
    }

    ctx.font = fontSize + "px serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    
    // Set your target date in NZ local time format
    const futureDate = '2026-02-05T17:00:00';
    const seconds = this.secondsUntilDate(futureDate);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    
    // Calculate progress: how much closer since page loaded
    const target = new Date(futureDate + '+13:00'); // Use same timezone offset
    const now = new Date();
    const pageLoadTime = now.getTime() - elapsed; // When the page was loaded
    const totalTimeFromLoadToTarget = target.getTime() - pageLoadTime; // Total time from load to target
    const percentComplete = (elapsed / totalTimeFromLoadToTarget) * 100;
    const percentRounded = Math.min(100, Math.max(0, percentComplete)).toFixed(8);
    
    ctx.fillText(seconds + " Seconds", centerX, centerY - 200);
    ctx.fillText(minutes + " Minutes", centerX, centerY - 100);
    ctx.fillText(hours + " Hours (" + days + " days)", centerX, centerY);
    ctx.fillText(percentRounded + "% Closer", centerX, centerY + 300);

    const milestoneSeconds = this.milestone;
    const milestoneDate = new Date(target.getTime() - milestoneSeconds * 1000);
    const milestoneDisplayDate = milestoneDate.toLocaleString();
    ctx.fillText(milestoneDisplayDate, centerX, centerY + 100);
    ctx.fillText("^-- " + milestoneSeconds + "s milestone", centerX, centerY + 200);

    const canvasWidth = ctx.canvas.width;
    const secondsPerPixel = (seconds / canvasWidth);
    const secondsUntilFirstPixel = secondsPerPixel - (elapsed / 1000);

    ctx.fillText("Time until first pixel: " + Math.round(secondsUntilFirstPixel) + " seconds", centerX, centerY + 350);

    this.drawProgressBar(percentRounded);
  }
}

shapeRegistry.register('Countdown', Countdown);
