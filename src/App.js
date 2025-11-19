import React, { useState, useEffect,useRef } from "react";

import "./eye-training.css";

// ---- Game 1: Circular Path ----
function CircularPathGame() {
  const canvasRef = React.useRef(null);
  const [angle, setAngle] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [running, setRunning] = React.useState(true);

  const circleRadius = 200;
  const centerX = 400;
  const centerY = 300;
  const speed = 0.05;
  const smallCircleRadius = 40;
  const greenBallRadius = 15;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    const startTime = Date.now();

    function draw(currentAngle, currentDirection) {
      if (!running) return;

      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 20) {
        setRunning(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.stroke();

      const redCircleX = centerX;
      const redCircleY = centerY - circleRadius;
      ctx.beginPath();
      ctx.arc(redCircleX, redCircleY, smallCircleRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.stroke();

      let newAngle = currentAngle + speed * currentDirection;
      if (newAngle >= 2 * Math.PI) newAngle -= 2 * Math.PI;
      if (newAngle < 0) newAngle += 2 * Math.PI;

      const x = centerX + circleRadius * Math.cos(newAngle);
      const y = centerY + circleRadius * Math.sin(newAngle);

      ctx.beginPath();
      ctx.arc(x, y, greenBallRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();

      if (Math.abs(x - redCircleX) < 1 && Math.abs(y - redCircleY) < 1) {
        currentDirection *= -1;
      }

      setAngle(newAngle);
      setDirection(currentDirection);
      animationFrameId = requestAnimationFrame(() => draw(newAngle, currentDirection));
    }

    animationFrameId = requestAnimationFrame(() => draw(angle, direction));
    return () => cancelAnimationFrame(animationFrameId);
  }, [angle, direction, running]);

  return (
    <div className="circular-game-wrapper">
      <h2>Circular Path Game</h2>
      {running ? <canvas ref={canvasRef} width={800} height={600} /> : <h3>Game Over</h3>}
    </div>
  );
}

// ---- Game 2: Eye Improvement ----
function EyeImprovementGame() {
  const canvasRef = React.useRef(null);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const leftPositions = [
      { x: 50, y: 100 },
      { x: 50, y: 200 },
      { x: 50, y: 300 },
      { x: 50, y: 400 },
    ];
    const rightPositions = [
      { x: 750, y: 100 },
      { x: 750, y: 200 },
      { x: 750, y: 300 },
      { x: 750, y: 400 },
    ];

    let currentLeft = 0;
    let currentRight = 0;
    let movingLeft = true;
    let moveForward = true;
    let ballX = leftPositions[0].x;
    let ballY = leftPositions[0].y;
    const forwardSpeed = 6;
    const returnSpeed = 12;
    const startTime = Date.now();
    let animationId;

    function drawBall(x, y, color) {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawStaticBalls() {
      leftPositions.forEach((pos) => drawBall(pos.x, pos.y, "darkgreen"));
      rightPositions.forEach((pos) => drawBall(pos.x, pos.y, "darkgreen"));
    }

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 20) {
        cancelAnimationFrame(animationId);
        setRunning(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStaticBalls();

      if (movingLeft) {
        if (currentLeft >= leftPositions.length) {
          movingLeft = false;
          currentRight = 0;
          ballX = rightPositions[0].x;
          ballY = rightPositions[0].y;
          moveForward = true;
        } else {
          const targetX = moveForward
            ? rightPositions[currentLeft].x
            : leftPositions[currentLeft].x;
          if (moveForward) {
            ballX += forwardSpeed;
            if (ballX >= targetX - 20) moveForward = false;
          } else {
            ballX -= returnSpeed;
            if (ballX <= leftPositions[currentLeft].x) {
              moveForward = true;
              currentLeft++;
              if (currentLeft < leftPositions.length) {
                ballX = leftPositions[currentLeft].x;
                ballY = leftPositions[currentLeft].y;
              }
            }
          }
        }
      } else {
        if (currentRight >= rightPositions.length) {
          cancelAnimationFrame(animationId);
          setRunning(false);
          return;
        }

        const targetX = moveForward
          ? leftPositions[currentRight].x
          : rightPositions[currentRight].x;

        if (moveForward) {
          ballX -= forwardSpeed;
          if (ballX <= targetX + 20) moveForward = false;
        } else {
          ballX += returnSpeed;
          if (ballX >= rightPositions[currentRight].x) {
            moveForward = true;
            currentRight++;
            if (currentRight < rightPositions.length) {
              ballX = rightPositions[currentRight].x;
              ballY = rightPositions[currentRight].y;
            }
          }
        }
      }

      drawBall(ballX, ballY, "limegreen");
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="game-container">
      <h2>Eye Improvement Game</h2>
      {running ? <canvas ref={canvasRef} width={800} height={600} /> : <h3>Game Over</h3>}
    </div>
  );
}

// ---- Game 2: Eye Improvement (Vertical Version) ----
function EyeImprovementGameVertical() {
  const canvasRef = React.useRef(null);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // LEFT = TOP SIDE
    const topPositions = [
      { x: 200, y: 50 },
      { x: 350, y: 50 },
      { x: 500, y: 50 },
      { x: 650, y: 50 },
    ];

    // RIGHT = BOTTOM SIDE
    const bottomPositions = [
      { x: 200, y: 550 },
      { x: 350, y: 550 },
      { x: 500, y: 550 },
      { x: 650, y: 550 },
    ];

    let currentTop = 0;
    let currentBottom = 0;

    let movingTop = true;
    let moveForward = true;

    let ballX = topPositions[0].x;
    let ballY = topPositions[0].y;

    const forwardSpeed = 6;
    const returnSpeed = 12;

    const startTime = Date.now();
    let animationId = null;

    // Draw ball
    function drawBall(x, y, color) {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Draw static reference points
    function drawStaticBalls() {
      topPositions.forEach((pos) => drawBall(pos.x, pos.y, "darkgreen"));
      bottomPositions.forEach((pos) => drawBall(pos.x, pos.y, "darkgreen"));
    }

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed >= 20) {
        cancelAnimationFrame(animationId);
        setRunning(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStaticBalls();

      // Movement logic
      if (movingTop) {
        if (currentTop >= topPositions.length) {
          movingTop = false;
          currentBottom = 0;
          ballX = bottomPositions[0].x;
          ballY = bottomPositions[0].y;
          moveForward = true;
        } else {
          const targetY = moveForward
            ? bottomPositions[currentTop].y
            : topPositions[currentTop].y;

          if (moveForward) {
            ballY += forwardSpeed;
            if (ballY >= targetY - 20) moveForward = false;
          } else {
            ballY -= returnSpeed;
            if (ballY <= topPositions[currentTop].y) {
              moveForward = true;
              currentTop++;
              if (currentTop < topPositions.length) {
                ballX = topPositions[currentTop].x;
                ballY = topPositions[currentTop].y;
              }
            }
          }
        }
      } else {
        if (currentBottom >= bottomPositions.length) {
          cancelAnimationFrame(animationId);
          setRunning(false);
          return;
        }

        const targetY = moveForward
          ? topPositions[currentBottom].y
          : bottomPositions[currentBottom].y;

        if (moveForward) {
          ballY -= forwardSpeed;
          if (ballY <= targetY + 20) moveForward = false;
        } else {
          ballY += returnSpeed;
          if (ballY >= bottomPositions[currentBottom].y) {
            moveForward = true;
            currentBottom++;
            if (currentBottom < bottomPositions.length) {
              ballX = bottomPositions[currentBottom].x;
              ballY = bottomPositions[currentBottom].y;
            }
          }
        }
      }

      drawBall(ballX, ballY, "limegreen");
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="game-container">
      <h2>Eye Improvement Game (Vertical)</h2>
      {running ? (
        <canvas ref={canvasRef} width={800} height={600} />
      ) : (
        <h3>🎯 Game Over</h3>
      )}
    </div>
  );
}


// ---- Game 3: Zigzagvertical(your correct one) ----

export function ZigzagPathGameHorizantal() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ballSize = 30;
    const speed = 0.8;
    const numCycles = 3;
    const numSegments = 12;
    const segmentHeight = 50;
    const leftX = 100;
    const rightX = 700;
    const totalLength = 12 * 60; // Segment length = 60
    let t = 0;
    let direction = 1;
    let cyclesCompleted = 0;

    // Generate zigzag path points
    const pathPoints = [];
    for (let i = 0; i <= numSegments; i++) {
      const x = i % 2 === 0 ? leftX : rightX;
      const y = 50 + i * segmentHeight;
      pathPoints.push({ x, y });
    }

    function drawZigzagPath() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.beginPath();
        ctx.moveTo(pathPoints[i - 1].x, pathPoints[i - 1].y);
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        ctx.stroke();
      }
    }

    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, ballSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
    }

    function animate() {
      if (!running) return;

      drawZigzagPath();

      // Update progress
      t += direction * speed;

      if (t >= totalLength || t <= 0) {
        direction *= -1;
        if (direction < 0) cyclesCompleted++;
        if (cyclesCompleted >= numCycles) {
          setRunning(false);
          return;
        }
      }

      // Calculate current segment and interpolate
      const segmentLength = totalLength / numSegments;
      let currentSegment = Math.floor(t / segmentLength);
      currentSegment = Math.max(0, Math.min(currentSegment, numSegments - 1));

      const segmentProgress = (t % segmentLength) / segmentLength;

      const start = pathPoints[currentSegment];
      const end = pathPoints[currentSegment + 1] || start;

      const x = start.x + (end.x - start.x) * segmentProgress;
      const y = start.y + (end.y - start.y) * segmentProgress;

      drawBall(x, y);

      requestAnimationFrame(animate);
    }

    animate();
  }, [running]);

  return (
    <div className="game-container">
      <h2>Zigzag Path Game</h2>
      {running ? (
        <canvas ref={canvasRef} width={800} height={600} />
      ) : (
        <div className="game-over">🎯 Game Over! (Completed 3 cycles)</div>
      )}
    </div>
  );
}



/// 4️⃣ Horizontal Zigzag Path Game
export function ZigzagPathGameVertical() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ballSize = 30;
    const speed = 0.8;

    const numSegments = 12;
    const segmentWidth = 60;

    const topY = 100;
    const bottomY = 500;

    const leftX = 50;
    const totalLength = numSegments * segmentWidth;

    let t = 0;
    let direction = 1;

    // Create horizontal zigzag points
    const pathPoints = [];
    for (let i = 0; i <= numSegments; i++) {
      const x = leftX + i * segmentWidth;
      const y = i % 2 === 0 ? topY : bottomY;
      pathPoints.push({ x, y });
    }

    function drawPath() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;

      for (let i = 1; i < pathPoints.length; i++) {
        ctx.beginPath();
        ctx.moveTo(pathPoints[i - 1].x, pathPoints[i - 1].y);
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        ctx.stroke();
      }
    }

    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, ballSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
    }

    const startTime = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 20) {
        setRunning(false);
        return;
      }

      drawPath();
      t += direction * speed;

      if (t >= totalLength || t <= 0) direction *= -1;

      const segmentLength = totalLength / numSegments;
      let currentSegment = Math.floor(t / segmentLength);
      const segmentProgress = (t % segmentLength) / segmentLength;

      const start = pathPoints[currentSegment];
      const end = pathPoints[currentSegment + 1] || start;

      const x = start.x + (end.x - start.x) * segmentProgress;
      const y = start.y + (end.y - start.y) * segmentProgress;

      drawBall(x, y);
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Horizontal Zigzag Path Game</h2>
      {running ? (
        <canvas width={800} height={600} ref={canvasRef} />
      ) : (
        <h3>🎯 Game Over! (20 seconds)</h3>
      )}
    </div>
  );
}

// 5️⃣ Infinite Loop Eye Tracking Game
export function InfiniteLoopGame() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const ballSize = 30;
    const speed = 0.02;
    const centerX = width / 2;
    const centerY = height / 2;
    const loopSize = 250;
    let t = 0;

    function drawPath() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const rad = (i * Math.PI) / 180;
        const x = centerX + loopSize * Math.sin(rad);
        const y = centerY + loopSize * Math.sin(rad) * Math.cos(rad);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, ballSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.closePath();
    }

    const startTime = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 20) {
        setRunning(false);
        return;
      }

      drawPath();
      const x = centerX + loopSize * Math.sin(t);
      const y = centerY + loopSize * Math.sin(t) * Math.cos(t);
      drawBall(x, y);
      t += speed;
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Infinite Loop Eye Tracking Game</h2>
      {running ? (
        <canvas width={800} height={600} ref={canvasRef} />
      ) : (
        <h3>🌀 Game Over! (20 seconds)</h3>
      )}
    </div>
  );
}

// 6️⃣ Star Eye Tracking Game
export function StarEyeTrackingGame() {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(0.02); // 🔥 Reduced speed here

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const ballSize = 30;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;
    const numPoints = 5;
    let t = 0;
    let direction = 1;

    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 144 * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }

    function drawPath() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[next].x, points[next].y);
        ctx.stroke();
      }
    }

    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, ballSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }

    function animate() {
      drawPath();
      t += direction * speed;
      let progress = t;

      if (progress >= numPoints || progress < 0) {
        direction *= -1;
        progress = Math.max(0, Math.min(progress, numPoints - 1));
      }

      const segment = Math.floor(progress) % numPoints;
      const segmentProgress = progress - segment;
      const p1 = points[segment];
      const p2 = points[(segment + 1) % numPoints];

      const x = p1.x + (p2.x - p1.x) * segmentProgress;
      const y = p1.y + (p2.y - p1.y) * segmentProgress;

      drawBall(x, y);
      requestAnimationFrame(animate);
    }

    animate();
  }, [speed]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Star Eye Tracking Game</h2>
      <canvas width={800} height={600} ref={canvasRef} />
    </div>
  );
}


// 8 Eye Training Graph Game (Random Yellow Move)
export function EyeRotationGame() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  const canvasWidth = 1000;
  const canvasHeight = 800;
  const nodeRadius = 40;

  const baseNodes = [
    [150, 150], [300, 150], [450, 150], [600, 150],
    [150, 300], [300, 300], [450, 300], [600, 300],
    [150, 450], [300, 450], [450, 450], [600, 450]
  ];

  const edges = [
    [0, 1], [1, 4], [4, 5], [5, 2], [2, 3],
    [3, 6], [6, 7], [8, 6], [7, 11], [11, 6],
    [6, 9], [9, 4], [4, 8], [8, 5], [10, 7]
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const nodes = baseNodes.map((n) => ({
      x: centerX + (n[0] - 375),
      y: centerY + (n[1] - 300),
    }));

    let highlightIndex = Math.floor(Math.random() * nodes.length);
    let lastHighlightTime = Date.now();

    const startTime = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 20) {
        setRunning(false);
        return;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw edges
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = i === highlightIndex ? "yellow" : "blue";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Pick a new yellow node every 1 second
      if (Date.now() - lastHighlightTime > 1000) {
        highlightIndex = Math.floor(Math.random() * nodes.length);
        lastHighlightTime = Date.now();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Eye Training Graph Game</h2>
      {running ? (
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      ) : (
        <h3>👁️ Game Over! (20 seconds)</h3>
      )}
    </div>
  );
}

// //  2. Tunnel 3D Game

// function Tunnel3DGame() {
//   const canvasRef = useRef(null);
//   const [running, setRunning] = useState(true);
//   useAutoStop(setRunning, 20);

//   useEffect(() => {
//     const c = canvasRef.current;
//     if (!c) return;

//     const ctx = c.getContext("2d");
//     c.width = 800;
//     c.height = 600;

//     let t = 0;
//     const centerX = c.width / 2;
//     const centerY = c.height / 2;
//     const slats = 20;

//     function draw() {
//       if (!running) return;

//       ctx.clearRect(0, 0, c.width, c.height);

//       const g = ctx.createLinearGradient(0, 0, 0, c.height);
//       g.addColorStop(0, "#1f2937");
//       g.addColorStop(1, "#e6e6e6");
//       ctx.fillStyle = g;
//       ctx.fillRect(0, 0, c.width, c.height);

//       for (let i = slats; i > 0; i--) {
//         const depth = i / slats;
//         const scale = 0.35 + depth * 1.4;
//         const w = 300 * scale, h = 30 * scale;
//         const offset = (1 - depth) * 220;

//         const x = centerX + Math.sin(t * 0.002 + i * 0.15) * 30 - w / 2;
//         const y = centerY - 200 + offset;

//         ctx.save();
//         ctx.globalAlpha = depth * 0.9;
//         ctx.fillStyle = `rgba(20,24,28,${0.6 * depth})`;
        
//         const r = 10 * scale;
//         ctx.beginPath();
//         ctx.moveTo(x + r, y);
//         ctx.lineTo(x + w - r, y);
//         ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//         ctx.lineTo(x + w, y + h - r);
//         ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//         ctx.lineTo(x + r, y + h);
//         ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//         ctx.lineTo(x, y + r);
//         ctx.quadraticCurveTo(x, y, x + r, y);
//         ctx.fill();
//         ctx.restore();
//       }

//       const ballX = centerX + Math.cos(t * 0.01) * 120;
//       const ballY = centerY + Math.sin(t * 0.012) * 30 + 40;

//       ctx.beginPath();
//       ctx.arc(ballX, ballY, 18, 0, Math.PI * 2);
//       ctx.fillStyle = "#2dd4bf";
//       ctx.fill();

//       ctx.save();
//       ctx.globalAlpha = 0.25;
//       ctx.beginPath();
//       ctx.ellipse(ballX, ballY + 40, 60, 10, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "#2dd4bf";
//       ctx.fill();
//       ctx.restore();

//       t += 1;
//       requestAnimationFrame(draw);
//     }

//     draw();
//   }, [running]);

//   return (
//     <div className="game-container">
//       <h2>Tunnel 3D</h2>
//       {running ? (
//         <canvas ref={canvasRef} width={800} height={600} />
//       ) : (
//         <h3 className="game-over">Game Over</h3>
//       )}
//     </div>
//   );
// }
// function useAutoStop(setRunning, seconds) {
//   useEffect(() => {
//     const timer = setTimeout(() => setRunning(false), seconds * 1000);
//     return () => clearTimeout(timer);
//   }, [seconds, setRunning]);
// }




// ---- MAIN APP ----
export default function AllEyeGames() {
  const games = [
    <CircularPathGame key="1" />,
    <EyeImprovementGame key="2" />,
    <EyeImprovementGameVertical key="3" />,
    <ZigzagPathGameHorizantal key="4" />,
    <ZigzagPathGameVertical key="5" />,
    <InfiniteLoopGame key="6" />,
    <StarEyeTrackingGame key="7" />,
    <EyeRotationGame key="8" />,
    // <Tunnel3DGame key="9" />,
  ];

  const [index, setIndex] = useState(0);

  // Auto switch every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [games.length]);

  return (
    <div style={{ textAlign: "center" }}>
      {games[index]}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() =>
            setIndex((prev) => (prev - 1 + games.length) % games.length)
          }
        >
          ⬅ Previous
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % games.length)}
          style={{ marginLeft: 20 }}
        >
          Next ➡
        </button>
      </div>
      <p style={{ marginTop: 10, color: "#374151", fontWeight: "600" }}>
        Game {index + 1} of {games.length}
      </p>
    </div>
  );
}




