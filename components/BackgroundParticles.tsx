
import React, { useMemo } from 'react';

const BackgroundParticles: React.FC = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => {
            const size = Math.random() * 8 + 2; // size between 2px and 10px
            const style = {
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                animationDelay: `${Math.random() * 25}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
            };
            return <div key={i} className="particle" style={style}></div>;
        });
    }, []);

    return <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">{particles}</div>;
};

export default BackgroundParticles;
