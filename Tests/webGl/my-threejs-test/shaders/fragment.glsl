varying vec3 vColor;

void main() {
    float distance = length(gl_PointCoord - vec2(0.5, 0.5));
    float radius = 0.5; // The radius of the circle, where 0.5 is the edge of the point sprite
    float intensity = 0.5; // Gaussian for smooth intensity increase
    // float intensity = exp(-pow(distance * 3.0, 2.0)); // Gaussian for smooth intensity increase
    
    // If the distance is greater than the radius, discard the fragment (make it transparent)
    if (distance > radius) {
        discard;
    }
    
    // Use the intensity to modulate the color within the circle
    vec3 brightColor = vColor * intensity; 
    brightColor = clamp(brightColor, 0.0, 2.5); 

    gl_FragColor = vec4(brightColor, 1.0); // Full alpha within the circle
}