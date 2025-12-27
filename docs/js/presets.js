/**
 * Built-in Presets
 * 
 * Add your favorite scene configurations here!
 * Each preset has: name, description, and data (scene export)
 */
const BUILT_IN_PRESETS = [

  {
    name: "Poly Twist Rainbow",
    description: "hexagon bby",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "PolyTwistColourWidth",
          visible: true,
          paused: false,
          collapsed: true,
          values: {
            sides: 6,
            width: 500,
            line_width: 2,
            depth: 80,
            rotation: 0,
            colour1: "#ff0066",
            colour2: "#00ffff"
          },
          filters: {}
        }
      ]
    }
  },
  {
    name: "Expanding Nodes",
    description: "Pulsing nodal pattern",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "Nodal_expanding",
          visible: true,
          paused: false,
          collapsed: false,
          values: {
            expand: 2,
            points: 550,
            start: 0,
            line_width: 4,
            colour1: "#ffffff",
            colour2: "#4a9eff",
            colour_change: 3,
            speedMultiplier: 535
          },
          filters: {},
          controlBounds: {}
        }
      ]
    }
  },
  {
    name: "Wave Machine",
    description: "Mesmerizing sine wave radiation",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "NewWave",
          visible: true,
          paused: false,
          collapsed: false,
          values: {
            width: 967,
            sides: 8,
            step: 42,
            lineWidth: 3,
            limiter: 159,
            speedMultiplier: 556
          },
          filters: {
            limiter: [
              {
                type: "sin",
                params: {
                  min: 42,
                  max: 240,
                  rate: 0.5
                }
              }
            ]
          }
          ,
          controlBounds: {
            limiter: {
              min: 1,
              max: 1000
            }
          }
        }
      ]
    }
  },
  {
    name: "Black Hole Spiral",
    description: "Two intertwined spirals",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "Spiral1",
          visible: true,
          paused: false,
          collapsed: true,
          values: {
            width: 350, n: 4, piv: 90, step: 1, line_width: 2,
            colour: "#7734D3"
          },
          filters: {}
        },

      ]
    }
  },
  {
    name: "PhylloCone Blob",
    description: "Mystery orb",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "PhylloCone",
          visible: true,
          paused: false,
          collapsed: false,
          values: {
            start: 0,
            spiralProngs: 4,
            width_10: 12,
            iterations: 437,
            distance: 1,
            line_width: 2,
            colour1: "#2D81FC",
            colour2: "#FC0362",
            speedMultiplier: 100
          },
          filters: {},
          controlBounds: {}
        }
      ]
    }
  }
];
