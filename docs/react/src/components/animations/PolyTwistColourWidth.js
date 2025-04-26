import * as THREE from 'three';

export const PolyTwistColourWidth = ({ scene, rotation, params, viewport, objectsToDispose = [] }) => {
    const {
        sides,
        width,
        lineWidth,
        depth,
        rotation: rotationParam,
        colour1,
        colour2
    } = params;

    // Calculate the inner angle of the polygon
    const innerAngle = 180 - ((sides - 2) * 180) / sides;
    const scopeAngle = rotation - (innerAngle * Math.floor(rotation / innerAngle));

    // Calculate the twist angle
    let outAngle = 0;
    if (scopeAngle < innerAngle / 2) {
        outAngle = innerAngle / (2 * Math.cos((2 * Math.PI * scopeAngle) / (3 * innerAngle))) - innerAngle / 2;
    } else {
        outAngle = -innerAngle / (2 * Math.cos(((2 * Math.PI) / 3) - ((2 * Math.PI * scopeAngle) / (3 * innerAngle)))) + (innerAngle * 3) / 2;
    }

    // Calculate width multiplier
    const minWidth = Math.sin(toRadians(innerAngle / 2)) * (0.5 / Math.tan(toRadians(innerAngle / 2))) * 2;
    const widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90 + innerAngle / 2 - outAngle + innerAngle * Math.floor(outAngle / innerAngle)));

    // Draw each polygon with increasing size and color transition
    for (let i = 0; i < depth; i++) {
        const fraction = i / depth;
        const color = lerpColor(colour1, colour2, fraction);

        // Create a polygon shape
        drawPolygon(
            scene,
            sides,
            width * Math.pow(widthMultiplier, i),
            outAngle * i + rotationParam,
            color,
            lineWidth,
            objectsToDispose
        );
    }
};

// Helper functions
function drawPolygon(scene, sides, width, rotation, color, lineWidth, objectsToDispose) {
    const points = [];

    // Create points for the polygon
    for (let i = 0; i <= sides; i++) {
        const angle = (i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180;
        points.push(new THREE.Vector3(
            width * Math.cos(angle),
            width * Math.sin(angle),
            0
        ));
    }

    // Create geometry from points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create material with specified color
    const material = new THREE.LineBasicMaterial({
        color: new THREE.Color("#" + color),
        linewidth: lineWidth // Note: linewidth may not work as expected in WebGL
    });

    // Create and add the line
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    
    // Add to objects to dispose list
    if (objectsToDispose) {
        objectsToDispose.push(line);
    }
}

// Convert hex color string to THREE.js color
function lerpColor(colorA, colorB, t) {
    const a = new THREE.Color(colorA);
    const b = new THREE.Color(colorB);

    return new THREE.Color(
        a.r + (b.r - a.r) * t,
        a.g + (b.g - a.g) * t,
        a.b + (b.b - a.b) * t
    ).getHexString();
}

// Convert degrees to radians
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}