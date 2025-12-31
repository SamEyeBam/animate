/**
 * Built-in Presets
 * 
 * Add your favorite scene configurations here!
 * Each preset has: name, description, and data (scene export)
 */
const BUILT_IN_PRESETS = [

  {
    name: "Minds Eye is Full Of Flowers",
    description: "Look at me",
    builtIn: true,
    data: {
      version: 1,
      layers: [
        {
          name: "FloralPhyllo",
          visible: true,
          paused: false,
          collapsed: false,
          values: {
            width_start: 30,
            width_scale: 333,
            depth: 200,
            start: 625,
            colour1: [
              66,
              135,
              245
            ],
            colour2: [
              252,
              3,
              98
            ],
            speedMultiplier: 500
          },
          filters: {},
          controlBounds: {}
        },
        {
          name: "EyePrototype",
          visible: true,
          paused: false,
          collapsed: false,
          values: {
            x: 0,
            y: 0,
            rotate: 0,
            flip: 0,
            width: 531,
            blink_speed: 27,
            draw_spiral: 0,
            spiral_full: 1,
            draw_pupil: 0,
            draw_expand: 0,
            draw_hypno: 1,
            line_width: 1,
            colourPupil: [
              0,
              255,
              251
            ],
            colourSpiral: [
              255,
              0,
              0
            ],
            colourExpand: [
              0,
              255,
              251
            ],
            speedMultiplier: 100
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
