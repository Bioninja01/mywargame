import { useEffect, useState, useRef } from "react"

export default function YellowGame({ }) {

    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Game state (kept outside React state for performance)
    const state = useRef({
        x: 100,
        y: 100,
        vx: 120, // pixels per second
        vy: 80,
        lastTime: 0,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Resize canvas to match display size
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;

            const rect = canvas.getBoundingClientRect();

            // Set actual pixel size
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Reset transform before scaling (important!)
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Scale drawing operations
            ctx.scale(dpr, dpr);
        };

        // Game loop
        const update = (time) => {
            const s = state.current;
            const dt = (time - s.lastTime) / 1000 || 0;
            s.lastTime = time;

            // Update position
            s.x += s.vx * dt;
            s.y += s.vy * dt;

            // Bounce off edges
            if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
            if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

            // Render
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "lime";
            ctx.beginPath();
            ctx.arc(s.x, s.y, 20, 0, Math.PI * 2);
            ctx.fill();

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);

        // Handle window resize explicitly (forces redraw immediately)
        const handleResize = () => resizeCanvas();
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            id="game"
            ref={canvasRef}
        />
    );

}