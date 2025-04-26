import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Toolbar from './components/Toolbar';
import AnimationScene from './components/AnimationScene';
import useAnimationStore from './store/animationStore';

function App() {
    const [showToolbar, setShowToolbar] = useState(true);
    const { selectedAnimation, setSelectedAnimation, animations } = useAnimationStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'p' || e.key === 'P') {
                setShowToolbar(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="App">
            <Canvas
                style={{ background: '#000', width: '100%', height: '100vh', position: 'absolute' }}
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <AnimationScene />
                <OrbitControls />
            </Canvas>

            <button
                className="toggle-button"
                onClick={() => setShowToolbar(prev => !prev)}
            >
                {showToolbar ? 'Hide' : 'Show'} Controls
            </button>

            <Toolbar
                isVisible={showToolbar}
                selectedAnimation={selectedAnimation}
                onAnimationChange={setSelectedAnimation}
                animations={animations}
            />
        </div>
    );
}

export default App;