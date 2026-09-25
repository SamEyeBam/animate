/**
 * BallOfLife - A cylinder supporting a sphere, projected onto the 2D canvas.
 */
class BallOfLife extends BaseShape {
  static config = [
    { type: 'header', text: 'Point spacing & dimensions (cm)' },
    { type: 'range', min: 1, max: 100, defaultValue: 6, property: 'pointsPerRow', label: 'Columns around cylinder (total)' },
    { type: 'range', min: 1, max: 1000, step: 0.1, defaultValue: 30.4, property: 'columnSpacingCm', label: 'Column: point every (cm)' },
    { type: 'range', min: 1, max: 12, defaultValue: 3, property: 'pointSize' },
    { type: 'color', defaultValue: [255, 53, 53], property: 'pointColor' },
    { type: 'header', text: 'Cylinder' },
    { type: 'range', min: 1, max: 3000, step: 0.1, defaultValue: 103.9, property: 'cylinderRadiusCm', label: 'Cylinder radius (cm)' },
    { type: 'range', min: 1, max: 10000, step: 0.1, defaultValue: 1000, property: 'columnHeightCm', label: 'Column height (cm)' },
    { type: 'range', min: -360, max: 360, defaultValue: 0, property: 'twist' },
    { type: 'header', text: 'Sphere' },
    { type: 'range', min: 1, max: 3000, step: 0.1, defaultValue: 300, property: 'sphereRadiusCm', label: 'Ball radius (cm)' },
    { type: 'range', min: 1, max: 1000, step: 0.1, defaultValue: 30.4, property: 'longitudeSpacingCm', label: 'Longitude: point every (cm)' },
    { type: 'range', min: 3, max: 100, defaultValue: 17, property: 'longitudeCount', label: 'Longitude lines (total)' },
    { type: 'header', text: 'View' },
    { type: 'range', min: -80, max: 80, defaultValue: 7, property: 'tilt' },
    { type: 'range', min: 10, max: 200, defaultValue: 124, property: 'zoomPercent' },
    { type: 'range', min: 0, max: 100, defaultValue: 50, property: 'perspectiveStrength' },
    { type: 'header', text: 'Rings' },
    { type: 'checkbox', defaultValue: true, property: 'showRings' },
    { type: 'color', defaultValue: [191, 199, 213], property: 'ringColor' },
    { type: 'range', min: 1, max: 8, defaultValue: 1.5, property: 'ringWidth' },
    { type: 'header', text: 'Ground Points' },
    { type: 'checkbox', defaultValue: true, property: 'showGroundSpray' },
    { type: 'range', min: 1, max: 1000, step: 0.1, defaultValue: 30.4, property: 'groundSpacingCm', label: 'Ground: point every (cm)' },
    { type: 'range', min: 0, max: 10000, step: 0.1, defaultValue: 900, property: 'groundLengthCm', label: 'Ground line length (cm)' },
    { type: 'color', defaultValue: [255, 53, 53], property: 'sprayColor' },
    { type: 'range', min: 1, max: 12, defaultValue: 3, property: 'groundPointSize' },
    { type: 'header', text: 'Animation' },
    { type: 'dropdown', defaultValue: 'steady', property: 'lightingEffect', label: 'Lighting effect', options: [
      { value: 'steady', label: 'Steady (no animation)' },
      { value: 'pulse', label: 'Pulse' },
      { value: 'wave', label: 'Rising wave' },
      { value: 'chase', label: 'Rotating chase' },
      { value: 'sparkle', label: 'Sparkle' },
      { value: 'rainbow', label: 'Rainbow flow' },
    ] },
    { type: 'range', min: 0, max: 300, defaultValue: 100, property: 'lightingSpeed', label: 'Lighting speed (%)' },
    { type: 'checkbox', defaultValue: false, property: 'autoRotate' },
    { type: 'range', min: 0, max: 200, defaultValue: 100, property: 'rotateSpeed' },
    { type: 'checkbox', defaultValue: false, property: 'reverseRotation' },
    { type: 'header', text: 'Stickman (scale reference)' },
    { type: 'checkbox', defaultValue: true, property: 'showStickman', label: 'Show stickman' },
    { type: 'range', min: 1, max: 300, step: 0.1, defaultValue: 175, property: 'stickmanHeightCm', label: 'Stickman height (cm)' },
  ];

  constructor(...values) {
    super();
    // Match the registry's positional config arguments.
    BallOfLife.config.filter(item => item.property).forEach((item, index) => {
      const value = values[index] ?? item.defaultValue;
      this[item.property] = Array.isArray(value) ? [...value] : value;
    });
  }

  // Apply a 3x3 rotation matrix, then perspective divide. Strength 0 is orthographic.
  project(x, y, z, matrix, scale) {
    const rx = matrix[0] * x + matrix[1] * y + matrix[2] * z;
    const ry = matrix[3] * x + matrix[4] * y + matrix[5] * z;
    const rz = matrix[6] * x + matrix[7] * y + matrix[8] * z;
    const halfHeight = this.columnHeightCm / 600;
    const bound = Math.max(
      Math.hypot(this.cylinderRadiusCm / 300 +
        (this.showGroundSpray ? Math.max(0, this.groundLengthCm) / 300 : 0), halfHeight),
      halfHeight + 2 * this.sphereRadiusCm / 300,
      this.showStickman ? Math.hypot(
        this.cylinderRadiusCm / 300 + this.stickmanHeightCm / 300 * 0.6,
        halfHeight + this.stickmanHeightCm / 300
      ) : 0
    );
    // Keep the shapes and ground spray in front of the camera at maximum perspective.
    const distance = Math.max(6, bound * 2.5);
    const strength = Math.max(0, Math.min(100, this.perspectiveStrength)) / 50;
    const perspective = distance / (distance + rz * strength);
    return {
      x: centerX + rx * scale * perspective,
      y: centerY + ry * scale * perspective,
      depth: rz,
      perspective,
      worldX: x,
      worldY: y,
      worldZ: z,
    };
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const columns = Math.max(1, Math.min(100, Math.round(this.pointsPerRow)));
    const rows = Math.floor(this.columnHeightCm / this.columnSpacingCm + 1e-9) + 1;
    const direction = this.reverseRotation ? -1 : 1;
    const angle = this.autoRotate ? elapsed * this.speedMultiplier / 200 * (this.rotateSpeed / 100) * direction : 0;
    const tilt = this.tilt * Math.PI / 180;
    const ca = Math.cos(angle), sa = Math.sin(angle);
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    // R_x(tilt) * R_y(angle): spin around the cylinder axis, then tilt the view.
    const matrix = [ca, 0, sa, st * sa, ct, -st * ca, -ct * sa, st, ct * ca];
    const scale = Math.min(ctx.canvas.width / 6, ctx.canvas.height / 10) * this.zoomPercent / 100;
    const radius = this.cylinderRadiusCm / 300;
    const halfHeight = this.columnHeightCm / 600;
    const points = [];

    for (let row = 0; row < rows; row++) {
      // Start at the base and keep the requested spacing exactly.
      const fraction = 1 - row * this.columnSpacingCm / this.columnHeightCm;
      const y = (2 * fraction - 1) * halfHeight;
      for (let column = 0; column < columns; column++) {
        const theta = 2 * Math.PI * column / columns + fraction * this.twist * Math.PI / 180;
        points.push(this.project(radius * Math.cos(theta), y, radius * Math.sin(theta), matrix, scale));
      }
    }

    const sphereRadius = this.sphereRadiusCm / 300;
    // Seat the sphere in the hollow rim: radius² + centerOffset² = sphereRadius².
    // A sphere narrower than the opening has no rim contact; place its equator at the rim.
    const centerOffset = Math.sqrt(Math.max(0, sphereRadius * sphereRadius - radius * radius));
    const sphereCenterY = -halfHeight - centerOffset;
    const arcLength = Math.PI * this.sphereRadiusCm;
    const latitudes = Math.ceil(arcLength / this.longitudeSpacingCm) + 1;
    const longitudes = Math.max(3, Math.min(100, Math.round(this.longitudeCount)));
    for (let latitude = 0; latitude < latitudes; latitude++) {
      // Latitude runs from -90 to +90 degrees, including one point at each pole.
      const phi = -Math.PI / 2 + Math.min(latitude * this.longitudeSpacingCm / this.sphereRadiusCm, Math.PI);
      const pole = latitude === 0 || latitude === latitudes - 1;
      const ringRadius = pole ? 0 : sphereRadius * Math.cos(phi);
      const y = sphereCenterY + sphereRadius * Math.sin(phi);
      const count = pole ? 1 : longitudes;
      for (let longitude = 0; longitude < count; longitude++) {
        const theta = 2 * Math.PI * longitude / longitudes;
        points.push(this.project(ringRadius * Math.cos(theta), y,
          ringRadius * Math.sin(theta), matrix, scale));
      }
    }

    ctx.save();
    if (this.showGroundSpray) {
      const count = Math.floor(this.groundLengthCm / this.groundSpacingCm + 1e-9);
      const length = Math.max(0, this.groundLengthCm) / 300;
      for (let column = 0; column < columns; column++) {
        // Match the twist at the cylinder base.
        const theta = 2 * Math.PI * column / columns +
          this.twist * Math.PI / 180;
        for (let point = 1; point <= count; point++) {
          // Continue outward from the base point without duplicating it.
          const distance = radius + point * this.groundSpacingCm / 300;
          if (length === 0) break;
          const p = this.project(distance * Math.cos(theta), halfHeight,
            distance * Math.sin(theta), matrix, scale);
          points.push({ ...p, color: this.sprayColor, size: this.groundPointSize });
        }
      }
    }
    // Project circular rims using the same transform as the points.
    ctx.strokeStyle = Array.isArray(this.ringColor) ? `rgb(${this.ringColor.join(',')})` : this.ringColor;
    ctx.lineWidth = this.ringWidth;
    for (const y of this.showRings ? [-halfHeight, halfHeight] : []) {
      ctx.beginPath();
      for (let i = 0; i < 128; i++) {
        const theta = 2 * Math.PI * i / 128;
        const p = this.project(radius * Math.cos(theta), y, radius * Math.sin(theta), matrix, scale);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Paint far points first; perspective makes nearer points appear larger.
    const lightingTime = elapsed * (this.speedMultiplier / 100) * (this.lightingSpeed / 100);
    const baseAlpha = ctx.globalAlpha;
    points.sort((a, b) => b.depth - a.depth);
    for (const p of points) {
      const lighting = this.pointLighting(p, lightingTime);
      const color = lighting.color ?? p.color ?? this.pointColor;
      ctx.globalAlpha = baseAlpha * lighting.brightness;
      ctx.fillStyle = Array.isArray(color) ? `rgb(${color.join(',')})` : color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size ?? this.pointSize) * p.perspective, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = baseAlpha;
    if (this.showStickman) {
      this.drawStickman(halfHeight, radius, [1, 0, 0, 0, ct, -st, 0, st, ct], scale);
    }
    ctx.restore();
  }

  pointLighting(point, time) {
    const turn = 2 * Math.PI;
    const height = this.columnHeightCm / 600 - point.worldY;
    const radialDistance = Math.hypot(point.worldX, point.worldZ);
    const theta = Math.atan2(point.worldZ, point.worldX);
    // Use physical coordinates so patterns remain attached to points while rotating.
    const travel = height - radialDistance;
    switch (this.lightingEffect) {
      case 'pulse':
        return { brightness: 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(time * turn)) };
      case 'wave':
        return { brightness: 0.12 + 0.88 * Math.pow(0.5 + 0.5 * Math.cos(travel * 3 - time * turn), 4) };
      case 'chase':
        return { brightness: 0.12 + 0.88 * Math.pow(0.5 + 0.5 * Math.cos(theta - time * turn), 8) };
      case 'sparkle': {
        const seed = Math.sin(point.worldX * 127.1 + point.worldY * 311.7 + point.worldZ * 74.7) * 43758.5453;
        const phase = seed - Math.floor(seed);
        return { brightness: 0.1 + 0.9 * Math.pow(0.5 + 0.5 * Math.sin(time * turn * (0.7 + phase) + phase * turn), 16) };
      }
      case 'rainbow': {
        const hue = ((travel * 65 + theta * 180 / Math.PI - time * 90) % 360 + 360) % 360;
        return { brightness: 1, color: `hsl(${hue}, 100%, 60%)` };
      }
      default:
        return { brightness: 1 };
    }
  }

  drawStickman(groundY, radius, matrix, scale) {
    const height = this.stickmanHeightCm / 300;
    const center = radius + height * 0.4;
    // Keep the figure beside the cylinder as it spins, on the same ground plane.
    const project = (x, y) => this.project(center + x * height, groundY - y * height, 0, matrix, scale);
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = Math.max(1, height * scale * 0.025);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const angle = i / 48 * Math.PI * 2;
      const p = project(0.09 * Math.cos(angle), 0.91 + 0.09 * Math.sin(angle));
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    for (const limb of [
      [[0, 0.82], [0, 0.43]],
      [[-0.2, 0.48], [0, 0.72], [0.2, 0.48]],
      [[-0.17, 0], [0, 0.43], [0.17, 0]],
    ]) {
      ctx.beginPath();
      limb.forEach(([x, y], index) => {
        const p = project(x, y);
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }
}

shapeRegistry.register('ball of life', BallOfLife);
