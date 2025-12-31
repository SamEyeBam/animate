

class Nodal extends BaseShape {
    static config = [
        { type: 'range', min: 0, max: 360, defaultValue: 0, property: 'shift' },
        { type: 'range', min: 10, max: 800, defaultValue: 400, property: 'radius' },
        { type: 'range', min: 3, max: 500, defaultValue: 100, property: 'points' },
        { type: 'range', min: 1, max: 250, defaultValue: 41, property: 'step' },
        { type: 'range', min: 1, max: 20, defaultValue: 2, property: 'lineWidth' },
        { type: 'color', defaultValue: [64, 199, 119], property: 'colour' },
    ];

    constructor(shift, radius, points, step, lineWidth, colour) {
        super();
        this.shift = shift;
        this.radius = radius;
        this.points = points;
        this.step = step;
        this.lineWidth = lineWidth;
        this.colour = colour;
    }

    draw(elapsed) {
        const rotation = elapsed * (this.speedMultiplier / 100) + this.shift;
        const angle = 360 / this.points * this.step;

        ctx.beginPath();
        ctx.moveTo(
            centerX + Math.cos(this.rad(angle + rotation)) * this.radius,
            centerY + Math.sin(this.rad(angle + rotation)) * this.radius
        );

        let totalMoves = 1;
        while ((totalMoves * this.step) % this.points !== 0) {
            totalMoves++;
        }
        totalMoves++;

        for (let z = 1; z <= totalMoves; z++) {
            ctx.lineTo(
                centerX + Math.cos(this.rad(angle * z + rotation)) * this.radius,
                centerY + Math.sin(this.rad(angle * z + rotation)) * this.radius
            );
        }

        ctx.strokeStyle = colourToText(this.colour);
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }

    rad(degrees) {
        return degrees * (Math.PI / 180);
    }
}
console.log('Nodal shape loaded');
shapeRegistry.register('Nodal', Nodal);