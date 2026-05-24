import React, { useEffect, useRef } from 'react';
import { ThemeConfig } from '../types';

interface BackgroundCanvasProps {
  theme: ThemeConfig;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Set up resize observer to size canvas correctly
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        width = canvas.width = w;
        height = canvas.height = h;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Interactive mouse state
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Color parser helper
    // theme.primaryColor could look like 'text-[#00ffcc]' or similar, but let's derive hex color
    let hexColor = '#00ffcc';
    if (theme.primaryColor.includes('#')) {
      const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
      if (match) hexColor = `#${match[1]}`;
    } else if (theme.primaryColor.includes('green')) {
      hexColor = '#22c55e';
    } else if (theme.primaryColor.includes('amber')) {
      hexColor = '#f59e0b';
    } else if (theme.primaryColor.includes('rose')) {
      hexColor = '#f43f5e';
    } else if (theme.primaryColor.includes('violet')) {
      hexColor = '#8b5cf6';
    } else if (theme.primaryColor.includes('cyan')) {
      hexColor = '#06b6d4';
    }

    // Particles / Grid setup
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const numParticles = 80;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Grid tracking offset
    let gridOffset = 0;

    // Matrix columns
    const columns = Math.floor(width / 24);
    const drops: number[] = Array(columns).fill(1);

    // Animation Loop
    const render = () => {
      // Clear with fading effect to preserve trails in some styles
      if (theme.canvasStyle === 'matrix') {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.08)'; // Deep background build in index.css
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // Smooth mouse coordinates toward target
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      if (theme.canvasStyle === 'stars') {
        // Starfield with interactive parallax
        ctx.strokeStyle = `${hexColor}15`;
        ctx.fillStyle = `${hexColor}60`;

        particles.forEach((p) => {
          // Add parallax displacement
          const dx = (mouse.x - width / 2) * 0.02;
          const dy = (mouse.y - height / 2) * 0.02;

          let px = p.x + dx;
          let py = p.y + dy;

          // Wrap boundaries
          if (px < 0) px += width;
          if (px > width) px -= width;
          if (py < 0) py += height;
          if (py > height) py -= height;

          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `${hexColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();

          // Connect stars that are close
          particles.forEach((other) => {
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x + dx, p.y + dy);
              ctx.lineTo(other.x + dx, other.y + dy);
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = `${hexColor}${Math.floor((1 - dist / 100) * 0.08 * 255).toString(16).padStart(2, '0')}`;
              ctx.stroke();
            }
          });

          // Update position
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        });

      } else if (theme.canvasStyle === 'grid') {
        // Cyber perspective 3D grid line rendering
        ctx.strokeStyle = `${hexColor}1A`;
        ctx.lineWidth = 1;

        gridOffset = (gridOffset + 0.3) % 40;

        // Draw horizontal grid lines (perspective simulation)
        const totalLines = 20;
        for (let i = 0; i < totalLines; i++) {
          const ratio = i / totalLines;
          // Curve coordinate heights for mock 3D field below dashboard
          const y = height * ratio;
          ctx.beginPath();
          ctx.moveTo(0, y + gridOffset);
          ctx.lineTo(width, y + gridOffset);
          ctx.stroke();
        }

        // Vertical lines with slight converging angles to a focal center (mouse-driven)
        const vLines = 25;
        const focalX = mouse.x;
        const focalY = -height * 0.2; // Virtual horizon point above screen

        for (let i = 0; i < vLines; i++) {
          const startX = (width / (vLines - 1)) * i;
          ctx.beginPath();
          ctx.moveTo(startX, height);
          // Angle lines towards virtual floating star above screen
          const dx = startX - focalX;
          ctx.lineTo(focalX + dx * 0.2, 0);
          ctx.stroke();
        }

        // Add small scanning sweep
        ctx.fillStyle = `rgba(0, 0, 0, 0)`;
        const scanY = (Date.now() / 15) % (height * 1.5) - height * 0.25;
        const gradient = ctx.createLinearGradient(0, scanY, 0, scanY + 120);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `${hexColor}15`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

      } else if (theme.canvasStyle === 'matrix') {
        // High-tech terminal numeric flow
        ctx.fillStyle = `${hexColor}cc`;
        ctx.font = '10px monospace';

        for (let i = 0; i < drops.length; i++) {
          // Random 0 or 1
          const char = Math.random() > 0.5 ? '1' : '0';
          const x = i * 24;
          const y = drops[i] * 24;

          // Fade characters with coordinates
          ctx.fillStyle = `${hexColor}1F`;
          ctx.fillText(char, x, y);

          // Head of stream is brighter
          ctx.fillStyle = `${hexColor}AA`;
          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }

      } else if (theme.canvasStyle === 'glitch') {
        // Futuristic radial radar sonar arcs tracking mouse
        ctx.strokeStyle = `${hexColor}1a`;
        ctx.lineWidth = 1.5;

        // Concentric circles centered around mouse
        const maxRadius = Math.max(width, height) * 0.4;
        const offsetCircle = (Date.now() / 40) % 150;

        for (let radius = offsetCircle; radius < maxRadius; radius += 150) {
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Draw small HUD marker ticks
          ctx.font = '8px monospace';
          ctx.fillStyle = `${hexColor}40`;
          ctx.fillText(`R_${Math.round(radius)}M`, mouse.x + radius + 5, mouse.y);
        }

        // Center reticle
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `${hexColor}80`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(mouse.x - 20, mouse.y);
        ctx.lineTo(mouse.x + 20, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 20);
        ctx.lineTo(mouse.x, mouse.y + 20);
        ctx.stroke();
      } else if (theme.canvasStyle === 'neon_grid') {
        // Neon Grid: Glowing neon cyber grid with a 3D perspective scroll + magenta digital node particles
        ctx.strokeStyle = '#00ffcc22';
        ctx.lineWidth = 1.2;

        gridOffset = (gridOffset + 0.8) % 40;
        const totalLines = 18;
        for (let i = 0; i < totalLines; i++) {
          const ratio = i / totalLines;
          const y = height * 0.4 + (height * 0.6) * ratio;
          ctx.beginPath();
          ctx.moveTo(0, y + gridOffset);
          ctx.lineTo(width, y + gridOffset);
          ctx.stroke();
        }

        const vLines = 20;
        const focalX = width / 2;
        const focalY = height * 0.3;
        for (let i = 0; i < vLines; i++) {
          const startX = (width / (vLines - 1)) * i;
          ctx.beginPath();
          ctx.moveTo(startX, height);
          ctx.lineTo(focalX + (startX - focalX) * 0.20, focalY);
          ctx.stroke();
        }

        // Animated neon star nodes in magenta/cyan
        particles.forEach((p, idx) => {
          p.x += p.vx * 1.5;
          p.y += p.vy * 1.5;
          if (p.x < 0) p.x += width;
          if (p.x > width) p.x -= width;
          if (p.y < 0) p.y += height;
          if (p.y > height) p.y -= height;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(217, 70, 239, 0.45)' : 'rgba(0, 255, 204, 0.45)';
          ctx.fill();

          if (idx % 6 === 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
            ctx.strokeStyle = idx % 2 === 0 ? 'rgba(217, 70, 239, 0.12)' : 'rgba(0, 255, 204, 0.12)';
            ctx.stroke();
          }
        });
      } else if (theme.canvasStyle === 'glassmorphic') {
        // Glassmorphic Flow: beautiful slow floating fluid colored blobs that blend elegantly with backdrop blurs
        const blobs = (window as any).glassBlobs || [];
        if (blobs.length === 0) {
          for (let i = 0; i < 4; i++) {
            blobs.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.6,
              vy: (Math.random() - 0.5) * 0.6,
              r: Math.random() * 150 + 150,
              color: i === 0 ? 'rgba(56, 189, 248, 0.15)' : i === 1 ? 'rgba(6, 182, 212, 0.15)' : i === 2 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(14, 165, 233, 0.12)'
            });
          }
          (window as any).glassBlobs = blobs;
        }

        blobs.forEach((blob: any) => {
          blob.x += blob.vx;
          blob.y += blob.vy;

          if (blob.x < -blob.r) blob.x = width + blob.r;
          if (blob.x > width + blob.r) blob.x = -blob.r;
          if (blob.y < -blob.r) blob.y = height + blob.r;
          if (blob.y > height + blob.r) blob.y = -blob.r;

          const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
          grad.addColorStop(0, blob.color);
          grad.addColorStop(0.8, 'rgba(10, 17, 32, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Add slow techno grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
        ctx.lineWidth = 1;
        const step = 60;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (theme.canvasStyle === 'disruptive_dash') {
        // Disruptive Dash: high-contrast industrial grid, hazard guidelines, crosshairs, telemetry coordinates
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.06)';
        ctx.lineWidth = 1;

        const boxSize = 80;
        for (let x = 0; x < width; x += boxSize * 2) {
          for (let y = 0; y < height; y += boxSize * 2) {
            ctx.strokeRect(x, y, boxSize, boxSize);
          }
        }

        // Draw warning diagonal lines (subtle hazard style)
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.03)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        for (let i = -10; i < 25; i++) {
          ctx.moveTo(i * 120, 0);
          ctx.lineTo(i * 120 + height, height);
        }
        ctx.stroke();

        // Target locator crosshair with tracking labels
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(mouse.x - 26, mouse.y);
        ctx.lineTo(mouse.x - 8, mouse.y);
        ctx.moveTo(mouse.x + 8, mouse.y);
        ctx.lineTo(mouse.x + 26, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 26);
        ctx.lineTo(mouse.x, mouse.y - 8);
        ctx.moveTo(mouse.x, mouse.y + 8);
        ctx.lineTo(mouse.x, mouse.y + 26);
        ctx.stroke();

        ctx.fillStyle = 'rgba(234, 179, 8, 0.22)';
        ctx.font = '8px monospace';
        ctx.fillText(`SYS_X: ${Math.round(mouse.x)}`, mouse.x + 22, mouse.y - 10);
        ctx.fillText(`SYS_Y: ${Math.round(mouse.y)}`, mouse.x + 22, mouse.y);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, [theme]);

  // Use absolute sizing to stretch, with backdrop blur for tech feel
  return (
    <canvas
      id="saver-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
    />
  );
};
