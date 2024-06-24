uniform float time;
uniform vec3 color1;
uniform vec3 color2;
varying vec3 vColor;

const float PI = 3.1415926535897932384626433832795;
const float goldenAngle = PI * (3.0 - sqrt(5.0));

void main() {
                // Calculate the normalized distance from center
    float index = float(gl_VertexID);
    float radiuss = sqrt(index) * 5.0;
    float normalizedRadius = radiuss / 200.0; // Adjust this divisor based on your pattern's size

                // Calculate the angle for each point based on its index
    float angle = index * (goldenAngle + time * 0.001);
    if (mod(index,2.0) != 0.0){
        angle *=-1.0;
    }

                // Color changes over time - Adding a slow wave effect based on the distance from center
    float colorTime = time * -2.1; // Slow down the color change over time
    float colorWave = sin(normalizedRadius * PI * 2.0 + colorTime); // Wave based on distance and time
    float colorMixFactor = colorWave * 0.5 + 0.5; // Normalize the wave between 0 and 1

    vColor = mix(color1, color2, colorMixFactor); // Mix the colors based on the computed factor

                // Calculate the animated position
    vec3 animatedPosition = vec3(radiuss * cos(angle), radiuss * sin(angle), 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_PointSize = 10.0;
}