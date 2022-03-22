function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function rotateMatrix2d(p, angle) {
  // cos0 sin0
  // -sin0 cos0
  const angleD = degToRad(angle);
  const r = [
    [Math.cos(angleD), Math.sin(angleD)],
    [-Math.sin(angleD), Math.cos(angleD)],
  ];
  const newPoint = [
    p[0] * r[0][0] + p[1] * r[0][1],
    p[0] * r[1][0] + p[1] * r[1][1],
  ];
  return newPoint;
}

function rotateMatrix3dX(p, angle) {
  // cos0 sin0
  // -sin0 cos0
  const angleD = degToRad(angle);
  const r = [
    [1, 0, 0],
    [0, Math.cos(angleD), -Math.sin(angleD)],
    [0, Math.sin(angleD), Math.cos(angleD)],
  ];
  const newPoint = [
    p[0] * r[0][0] + p[1] * r[0][1] + p[2] * r[0][2],
    p[0] * r[1][0] + p[1] * r[1][1] + p[2] * r[1][2],
    p[0] * r[2][0] + p[1] * r[2][1] + p[2] * r[2][2],
  ];
  return newPoint;
}

function rotateMatrix3dY(p, angle) {
  // cos0 sin0
  // -sin0 cos0
  const angleD = degToRad(angle);
  const r = [
    [Math.cos(angleD), 0, Math.sin(angleD)],
    [0, 1, 0],
    [-Math.sin(angleD), 0, Math.cos(angleD)],
  ];
  const newPoint = [
    p[0] * r[0][0] + p[1] * r[0][1] + p[2] * r[0][2],
    p[0] * r[1][0] + p[1] * r[1][1] + p[2] * r[1][2],
    p[0] * r[2][0] + p[1] * r[2][1] + p[2] * r[2][2],
  ];
  return newPoint;
}
function rotateMatrix3dZ(p, angle) {
  // cos0 sin0
  // -sin0 cos0
  const angleD = degToRad(angle);
  const r = [
    [Math.cos(angleD), -Math.sin(angleD), 0],
    [Math.sin(angleD), Math.cos(angleD), 0],
    [0, 0, 1],
  ];
  const newPoint = [
    p[0] * r[0][0] + p[1] * r[0][1] + p[2] * r[0][2],
    p[0] * r[1][0] + p[1] * r[1][1] + p[2] * r[1][2],
    p[0] * r[2][0] + p[1] * r[2][1] + p[2] * r[2][2],
  ];
  return newPoint;
}

function projectionOrth(v) {
  const p = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  const nPoint = [
    p[0][0] * v[0] + p[0][1] * v[1] + p[0][2] * v[2],
    p[1][0] * v[0] + p[1][1] * v[1] + p[1][2] * v[2],
  ];
  return nPoint;
}
