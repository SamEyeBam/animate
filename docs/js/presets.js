/**
 * Built-in Presets
 * 
 * Add your favorite scene configurations here!
 * Each preset has: name, description, and data (scene export)
 */
const BUILT_IN_PRESETS = [
  {
    name: "Hypnotic Spiral",
    description: "Classic spiral pattern with smooth colors",
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
            width: 400,
            n: 6,
            piv: 60,
            step: 1,
            line_width: 2
          },
          filters: {}
        }
      ]
    }
  },
  {
    name: "Floral Bloom",
    description: "Organic flower-like pattern",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "FloralPhyllo",
          visible: true,
          paused: false,
          collapsed: true,
          values: {
            width: 500,
            n: 8,
            piv: 45,
            start: 0,
            end: 180,
            step: 1,
            line_width: 1
          },
          filters: {}
        }
      ]
    }
  },
  {
    name: "Poly Twist Rainbow",
    description: "Colorful twisting polygon",
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
          collapsed: true,
          values: {
            width: 300,
            nodeCount: 12,
            start: 0,
            colour1: "#ffffff",
            colour2: "#4a9eff"
          },
          filters: {}
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
          values: { width: 350, n: 4, piv: 90, step: 1, line_width: 2,
            colour: "#7734D3"
           },
          filters: {}
        },
        
      ]
    }
  },
  {
    name: "Phyllotaxis Garden",
    description: "Nature-inspired spiral arrangement",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "Phyllotaxis",
          visible: true,
          paused: false,
          collapsed: true,
          values: {
            n: 300,
            c: 8,
            start: 137.5,
            colour1: "#ff6b6b",
            colour2: "#4ecdc4",
            dotSize: 6,
            mode: "spiral"
          },
          filters: {}
        }
      ]
    }
  }
];
