import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls, Leva } from 'leva' // Import leva
import PhyllotaxisSystem from './PhyllotaxisSystem' // Import Phyllotaxis system
// import PolyTwistSystem from './PolyTwistSystem' // Import PolyTwist system
import './App.css'

// Define animation options
const animationOptions = {
  Phyllotaxis: 'Phyllotaxis',
  PolyTwist: 'PolyTwist',
  // Add more animation names here as you implement them
}

function App() {
  // Leva controls for animation selection and global settings
  const { selectedAnimation, speedMultiplier } = useControls({
    selectedAnimation: {
      options: animationOptions,
      value: animationOptions.Phyllotaxis, // Default selection
      label: 'Animation',
    },
    speedMultiplier: {
      value: 1.0, // Global speed multiplier
      min: 0.01,
      max: 5.0,
      step: 0.01,
      label: 'Global Speed',
    },
  })

  // Function to render the selected animation component
  const renderSelectedAnimation = () => {
    switch (selectedAnimation) {
      case animationOptions.Phyllotaxis:
        return <PhyllotaxisSystem speedMultiplier={speedMultiplier} />
      // case animationOptions.PolyTwist:
      //   return <PolyTwistSystem speedMultiplier={speedMultiplier} />
      // Add cases for other animations
      default:
        return null
    }
  }

  return (
    <>
      {/* Leva panel will be added here automatically */}
      <Leva  /> {/* Add the Leva panel, initially collapsed */}
      <Canvas camera={{ position: [0, 0, 500], fov: 75 }}> {/* Adjusted camera Z */}
        <ambientLight intensity={0.8} /> {/* Increased ambient light */}
        <pointLight position={[100, 100, 100]} intensity={1.5} /> {/* Adjusted point light */}
        {renderSelectedAnimation()} {/* Render the chosen animation */}
        <OrbitControls />
      </Canvas>
    </>
  )
}

export default App
