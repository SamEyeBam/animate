function Draw_center() {
    ctx.beginPath();
    ctx.moveTo(centerX - 100, centerY);
    ctx.lineTo(centerX + 100, centerY);
    ctx.moveTo(centerX, centerY - 100);
    ctx.lineTo(centerX, centerY + 100);
    ctx.strokeStyle = "red";
    ctx.stroke();
    console.log("drawn center")
  }
  
  function DrawBorder(){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(ctx.canvas.width, 0);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
    ctx.lineTo(0, ctx.canvas.height);
    ctx.lineTo(0,0);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }