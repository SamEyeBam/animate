/**
 * RaysInShape - Rays bouncing within a box with center-returning trails
 */
class RaysInShape extends BaseShape {
  static config = [
    { type: 'range', min: 50, max: 1000, defaultValue: 500, property: 'rays', callback: (instance, newValue) => instance.setRays(newValue) },
    { type: 'range', min: 1, max: 30, defaultValue: 2, property: 'speed' },
    { type: 'checkbox', defaultValue: true, property: 'doesWave' },
    { type: 'range', min: 1, max: 200, defaultValue: 100, property: 'speedVertRate' },
    { type: 'range', min: 1, max: 200, defaultValue: 100, property: 'speedHorrRate' },
    { type: 'range', min: 1, max: 200, defaultValue: 100, property: 'speedVert' },
    { type: 'range', min: 1, max: 200, defaultValue: 100, property: 'speedHorr' },
    { type: 'range', min: 10, max: 2000, defaultValue: 800, property: 'boxSize' },
    { type: 'range', min: 1, max: 80, defaultValue: 5, property: 'trailLength' },
    { type: 'range', min: 1, max: 500, defaultValue: 5, property: 'lineWidth' },
    { type: 'checkbox', defaultValue: false, property: 'fade' },
    { type: 'color', defaultValue: [67, 219, 173], property: 'colourFree' },
    { type: 'color', defaultValue: [240, 92, 121], property: 'colourContained' },
    { type: 'header', text: '--CollisionBox---' },
    { type: 'checkbox', defaultValue: false, property: 'boxVisible' },
  ];

  constructor(rays, speed, doesWave, speedVertRate, speedHorrRate, speedVert, speedHorr, boxSize, trailLength = 50, lineWidth, fade, colourFree, colourContained, boxVisible) {
    super();
    this.rays = rays;
    this.speed = speed;
    this.speedVert = speedVert;
    this.speedHorr = speedHorr;
    this.boxSize = boxSize;
    this.trailLength = trailLength;
    this.rayObjects = [];
    this.centerRays = [];
    this.lineWidth = lineWidth;
    this.boxVisible = boxVisible;
    this.doesWave = doesWave;
    this.colourFree = colourFree;
    this.colourContained = colourContained;
    this.speedHorrRate = speedHorrRate;
    this.speedVertRate = speedVertRate;
    this.fade = fade;
  }

  initializeControls(controlManager) {
    super.initializeControls(controlManager);
    this.prepareRayObjects();
  }

  prepareRayObjects() {
    this.rayObjects = [];
    for (let i = 0; i < this.rays; i++) {
      const angle = (360 / this.rays) * i;
      this.rayObjects.push({
        angle: angle,
        lastX: centerX,
        lastY: centerY,
        positions: [{ x: centerX, y: centerY, angle: angle }]
      });
    }
    this.centerRays = [];
  }

  createCenterRay(x, y) {
    const dx = centerX - x;
    const dy = centerY - y;
    const angleToCenter = Math.atan2(dy, dx) * 180 / Math.PI;

    this.centerRays.push({
      positions: [{ x: x, y: y }],
      angle: angleToCenter,
      reachedCenter: false
    });
  }

  updateCenterRays(deltaTime) {
    const centerThreshold = 5;
    const maxDistance = 2000;

    for (let i = 0; i < this.centerRays.length; i++) {
      const ray = this.centerRays[i];

      if (ray.reachedCenter) {
        if (ray.positions.length > 0) {
          ray.positions.shift();
        }

        if (ray.positions.length <= 1) {
          this.centerRays.splice(i, 1);
          i--;
          continue;
        }
      } else {
        const currentPos = ray.positions[ray.positions.length - 1];

        const dx = (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
        const dy = (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
        const newX = currentPos.x + dx;
        const newY = currentPos.y + dy;

        const distFromOrigin = Math.sqrt(
          Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2)
        );

        if (distFromOrigin > maxDistance) {
          this.centerRays.splice(i, 1);
          i--;
          continue;
        }

        ray.positions.push({ x: newX, y: newY });

        const distToCenter = Math.sqrt(
          Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2)
        );

        if (distToCenter <= centerThreshold) {
          ray.reachedCenter = true;
        }

        while (ray.positions.length > this.trailLength) {
          ray.positions.shift();
        }
      }

      for (let j = 1; j < ray.positions.length; j++) {
        const prev = ray.positions[j - 1];
        const curr = ray.positions[j];

        let alpha = 1;
        if (this.fade) {
          alpha = (j / ray.positions.length) * 0.8 + 0.2;
        }

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);

        const col = this.colourFree;
        ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`;
        ctx.stroke();
      }
    }
  }

  setRays(newValue) {
    this.rays = newValue;
    this.prepareRayObjects();
  }

  draw(elapsed, deltaTime) {
    deltaTime *= this.speedMultiplier / 100;
    this.updateFilters(elapsed);

    if (this.doesWave) {
      const vertRate = this.speedVertRate / 100;
      const horrRate = this.speedHorrRate / 100;
      this.speedVert = Math.sin(elapsed / 10 * vertRate) * 85 + 100;
      this.speedHorr = Math.sin(elapsed / 10 * horrRate) * 85 + 100;
      updateControlInput(this.speedVert, "speedVert");
      updateControlInput(this.speedHorr, "speedHorr");
    }

    const boxLeft = centerX - this.boxSize / 2;
    const boxRight = centerX + this.boxSize / 2;
    const boxTop = centerY - this.boxSize / 2;
    const boxBottom = centerY + this.boxSize / 2;

    if (this.boxVisible) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(boxLeft, boxTop, this.boxSize, this.boxSize);
    }
    ctx.lineWidth = this.lineWidth;

    for (let j = 0; j < this.rayObjects.length; j++) {
      const ray = this.rayObjects[j];
      const currentPos = ray.positions[ray.positions.length - 1];

      let dx = (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
      let dy = (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
      let newX = currentPos.x + dx;
      let newY = currentPos.y + dy;
      let collisionType = null;
      const oldAngle = ray.angle;

      if (newX < boxLeft || newX > boxRight) {
        const collisionX = newX < boxLeft ? boxLeft : boxRight;
        const collisionRatio = (collisionX - currentPos.x) / dx;
        const collisionY = currentPos.y + dy * collisionRatio;

        ray.positions.push({
          x: collisionX,
          y: collisionY,
          angle: oldAngle,
          collision: 'horizontal'
        });

        this.createCenterRay(collisionX, collisionY);

        ray.angle = 180 - ray.angle;
        ray.angle = ((ray.angle % 360) + 360) % 360;

        const remainingRatio = 1 - collisionRatio;
        dx = remainingRatio * (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
        dy = remainingRatio * (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
        newX = collisionX + dx;
        newY = collisionY + dy;
        collisionType = 'horizontal';
      }

      if (newY < boxTop || newY > boxBottom) {
        if (collisionType === null) {
          const collisionY = newY < boxTop ? boxTop : boxBottom;
          const collisionRatio = (collisionY - currentPos.y) / dy;
          const collisionX = currentPos.x + dx * collisionRatio;

          ray.positions.push({
            x: collisionX,
            y: collisionY,
            angle: oldAngle,
            collision: 'vertical'
          });

          this.createCenterRay(collisionX, collisionY);

          ray.angle = 360 - ray.angle;
          ray.angle = ((ray.angle % 360) + 360) % 360;

          const remainingRatio = 1 - collisionRatio;
          dx = remainingRatio * (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
          dy = remainingRatio * (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
          newX = collisionX + dx;
          newY = collisionY + dy;
        } else {
          newX = Math.max(boxLeft, Math.min(newX, boxRight));
          newY = Math.max(boxTop, Math.min(newY, boxBottom));
          ray.positions.push({
            x: newX,
            y: newY,
            angle: ray.angle,
            collision: 'corner'
          });

          this.createCenterRay(newX, newY);
        }
      }

      newX = Math.max(boxLeft, Math.min(newX, boxRight));
      newY = Math.max(boxTop, Math.min(newY, boxBottom));

      if (collisionType === null) {
        ray.positions.push({
          x: newX,
          y: newY,
          angle: ray.angle
        });
      }

      while (ray.positions.length > this.trailLength) {
        ray.positions.shift();
      }

      for (let i = 1; i < ray.positions.length; i++) {
        const prev = ray.positions[i - 1];
        const curr = ray.positions[i];

        let alpha = 1;
        if (this.fade) {
          alpha = (i / ray.positions.length) * 0.8 + 0.2;
        }
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);

        if (curr.collision) {
          ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
        } else {
          const col = this.colourContained;
          ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`;
        }

        ctx.stroke();
      }
    }

    this.updateCenterRays(deltaTime);
  }
}

shapeRegistry.register('RaysInShape', RaysInShape);
