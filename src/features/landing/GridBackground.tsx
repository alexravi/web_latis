import React, { useRef, useEffect } from 'react';

const GridBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw(ctx, canvas.width, canvas.height);
        };

        const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.clearRect(0, 0, width, height);

            const gridSize = 40;
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#F0F0F0';

            // Draw Grid
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw "Active" Highlights nearby mouse
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Snap mouse to grid
            const gx = Math.floor(mx / gridSize) * gridSize;
            const gy = Math.floor(my / gridSize) * gridSize;

            ctx.fillStyle = 'rgba(0, 102, 204, 0.05)'; // Subtle blue highlight
            ctx.fillRect(gx, 0, gridSize, height); // Column highlight
            ctx.fillRect(0, gy, width, gridSize); // Row highlight

            ctx.fillStyle = '#0066CC'; // Crosshair center
            ctx.fillRect(gx - 2, gy - 2, 4, 4);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            draw(ctx, canvas.width, canvas.height);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
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
                zIndex: -1,
                background: 'var(--color-bg)',
            }}
        />
    );
};

export default GridBackground;
