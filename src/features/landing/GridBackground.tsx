import React, { useEffect, useRef } from 'react';

const GridBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Function to get CSS variable value
        const getVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        const drawBioMesh = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Get current theme colors
            const bgBase = getVar('--color-bg');
            // We need to approximate the gradient colors based on the theme
            // Since canvas gradients don't take CSS vars directly without parsing,
            // we'll keep it simple: match the bg variable.

            // Note: For a true gradient in canvas using CSS vars, we'd need to convert hex to rgb...
            // Instead, we will use the --color-bg as the base fill.

            ctx.fillStyle = bgBase;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Hexagonal Grid (Organic Structure)
            const a = 2 * Math.PI / 6;
            const r = 30; // radius

            // Use accent color but very transparent
            // We can't easily parse current hex to rgba here without a helper, 
            // so we will rely on a generic low-opacity overlay or hardcode a 'dark/light' check?
            // Better strategy: Use the grid color var.

            const gridColor = getVar('--color-grid');

            // If gridColor is hex, we want it faint.
            // Let's assume the grid var is the stroke color.
            ctx.strokeStyle = gridColor;
            ctx.globalAlpha = 0.3; // Make it subtle
            ctx.lineWidth = 1;

            const drawHexagon = (x: number, y: number) => {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
                }
                ctx.closePath();
                ctx.stroke();
            };

            const yOffset = r * Math.sin(a);
            const xOffset = r * (1 + Math.cos(a));

            for (let y = 0; y < canvas.height + r; y += 2 * yOffset) {
                for (let x = 0, j = 0; x < canvas.width + r; x += xOffset, j++) {
                    drawHexagon(x, y + (j % 2 === 0 ? yOffset : 0));
                }
            }

            // Reset alpha
            ctx.globalAlpha = 1.0;
        };

        // Draw initially
        drawBioMesh();

        // Redraw on resize
        const handleResize = () => drawBioMesh();
        window.addEventListener('resize', handleResize);

        // Observer for theme changes (attribute changes on html element)
        const observer = new MutationObserver(() => {
            drawBioMesh();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: -1
            }}
        />
    );
};

export default GridBackground;
