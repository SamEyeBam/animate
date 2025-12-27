/**
 * Countdown - Countdown timer display with progress bar
 */
class Countdown extends BaseShape {
  static config = [
    { type: 'range', min: 8000, max: 2000000, defaultValue: 2000000, property: 'milestone' },
  ];

  constructor(milestone) {
    super();
    this.milestone = milestone;
  }

  secondsUntilDate(targetDate) {
    const now = new Date();
    const nzTimeString = targetDate.replace('T', 'T').concat('+12:00');
    const target = new Date(nzTimeString);
    const difference = target.getTime() - now.getTime();
    return Math.round(difference / 1000);
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
    
    const futureDate = '2025-06-01T04:30:00';
    const seconds = this.secondsUntilDate(futureDate);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const percentRounded = (((elapsed / 1000) / seconds) * 100).toFixed(8);
    
    ctx.fillText(seconds + " Seconds", centerX, centerY - 200);
    ctx.fillText(minutes + " Minutes", centerX, centerY - 100);
    ctx.fillText(hours + " Hours", centerX, centerY);
    ctx.fillText(percentRounded + "% Closer", centerX, centerY + 300);

    const milestoneSeconds = this.milestone;
    const target = new Date(futureDate + '+12:00');
    const milestoneDate = new Date(target.getTime() - milestoneSeconds * 1000).toLocaleString();
    ctx.fillText(milestoneDate, centerX, centerY + 100);
    ctx.fillText("^-- " + milestoneSeconds + " milestone", centerX, centerY + 200);

    const canvasWidth = ctx.canvas.width;
    const secondsPerPixel = (seconds / canvasWidth);
    const secondsUntilFirstPixel = secondsPerPixel - (elapsed / 10);

    ctx.fillText("Time until first pixel: " + Math.round(secondsUntilFirstPixel) + " seconds", centerX, centerY + 350);

    this.drawProgressBar(percentRounded);
  }
}

shapeRegistry.register('Countdown', Countdown);
