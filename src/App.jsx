// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


/*
Korean Handwriting Practice - Single-file React app (App.jsx)

How to use:
1. Create a new Vite React project (or use CRA):
   npm create vite@latest korean-practice --template react
   cd korean-practice
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   configure tailwind per docs (add ./src/**//* to content in tailwind.config.js)

2. Replace src/App.jsx with the contents of this file.
3. Add character PNGs into the project's public/characters/ folder. See `CHARACTERS` below for example filenames.
   Example filenames used in this demo:
     public/characters/g.png    (ㄱ)
     public/characters/n.png    (ㄴ)
     public/characters/d.png    (ㄷ)
     public/characters/r.png    (ㄹ)
     public/characters/m.png    (ㅁ)
     public/characters/b.png    (ㅂ)
   You can supply your own transparent PNGs (square recommended) or export raster images.

4. Run the dev server:
   npm run dev

Notes:
- Uses an HTML canvas on top of a faded character image so learners can trace with mouse/touch/stylus.
- Uses Pointer Events where available for unified input and pressure support.
- Provides Clear, Undo, Next/Prev, Toggle Guide (svg stroke overlay placeholder), and Save (download PNG) features.
- This is a single-file example for clarity. Split into components/files as needed for production.
*/

// import React, { useRef, useEffect, useState } from 'react'

// const CHARACTERS = [
//   { id: 'g', label: 'ㄱ', file: '/characters/g.png' },
//   { id: 'n', label: 'ㄴ', file: '/characters/n.png' },
//   { id: 'd', label: 'ㄷ', file: '/characters/d.png' },
//   { id: 'r', label: 'ㄹ', file: '/characters/r.png' },
//   { id: 'm', label: 'ㅁ', file: '/characters/m.png' },
//   { id: 'b', label: 'ㅂ', file: '/characters/b.png' }
// ]

// export default function App() {
//   const [index, setIndex] = useState(0)
//   const [strokeColor, setStrokeColor] = useState('#0b63ff')
//   const [strokeWidth, setStrokeWidth] = useState(6)
//   const [showGuide, setShowGuide] = useState(true)
//   const containerRef = useRef(null)

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
//       <header className="w-full max-w-3xl flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Korean Handwriting Practice</h1>
//         <div className="text-sm text-gray-600">Trace the faded character with mouse, finger, or stylus.</div>
//       </header>

//       <main ref={containerRef} className="w-full max-w-3xl flex flex-col md:flex-row gap-4">
//         <div className="flex-1 bg-white rounded-2xl shadow p-4">
//           <PracticeCard
//             character={CHARACTERS[index]}
//             strokeColor={strokeColor}
//             strokeWidth={strokeWidth}
//             showGuide={showGuide}
//             containerRef={containerRef}
//           />
//         </div>

//         <aside className="w-full md:w-80 bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-sm text-gray-500">Character</div>
//               <div className="text-2xl font-bold">{CHARACTERS[index].label}</div>
//             </div>
//             <div className="text-sm text-gray-500">{index + 1} / {CHARACTERS.length}</div>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => setIndex((i) => Math.max(0, i - 1))}
//               className="px-3 py-2 rounded-lg bg-gray-100"
//             >Prev</button>
//             <button
//               onClick={() => setIndex((i) => Math.min(CHARACTERS.length - 1, i + 1))}
//               className="px-3 py-2 rounded-lg bg-gray-100"
//             >Next</button>
//             <button onClick={() => setIndex(Math.floor(Math.random() * CHARACTERS.length))}>Random</button>
//           </div>

//           <label className="text-sm text-gray-600">Pen width</label>
//           <input type="range" min={1} max={30} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} />

//           <label className="text-sm text-gray-600">Pen color</label>
//           <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />

//           <div className="flex items-center gap-2">
//             <input id="guide" type="checkbox" checked={showGuide} onChange={() => setShowGuide((s) => !s)} />
//             <label htmlFor="guide" className="text-sm text-gray-700">Show guide overlay</label>
//           </div>

//           <div className="mt-auto">
//             <div className="text-sm text-gray-500 mb-2">Characters included (place PNGs in <code>/public/characters</code>)</div>
//             <div className="grid grid-cols-6 gap-2 text-center">
//               {CHARACTERS.map((c) => (
//                 <div key={c.id} className="text-xs p-2 bg-gray-50 rounded">{c.label}</div>
//               ))}
//             </div>
//           </div>

//         </aside>
//       </main>

//       <footer className="w-full max-w-3xl mt-6 text-xs text-gray-500 text-center">
//         Tip: Use a stylus or finger on mobile for best results. This demo doesn't perform handwriting recognition — it focuses on tracing UX and tooling.
//       </footer>
//     </div>
//   )
// }

// function PracticeCard({ character, strokeColor, strokeWidth, showGuide, containerRef }) {
//   const canvasRef = useRef(null)
//   const overlayRef = useRef(null) // optional SVG guide overlay
//   const imgRef = useRef(null)
//   const [isPointerDown, setIsPointerDown] = useState(false)
//   const pathsRef = useRef([]) // stores strokes for undo
//   const currentPathRef = useRef(null)

//   // Resize canvas to match displayed image size
//   useEffect(() => {
//     const resize = () => {
//       const canvas = canvasRef.current
//       const container = canvas?.parentElement
//       if (!canvas || !container) return
//       const rect = container.getBoundingClientRect()
//       // keep square aspect based on smaller side
//       const size = Math.min(rect.width - 32, 480)
//       canvas.width = size
//       canvas.height = size
//       // also size overlay and image
//       if (overlayRef.current) {
//         overlayRef.current.setAttribute('width', size)
//         overlayRef.current.setAttribute('height', size)
//       }
//       if (imgRef.current) {
//         imgRef.current.style.width = size + 'px'
//         imgRef.current.style.height = size + 'px'
//       }
//       redrawAll()
//     }

//     const ro = new ResizeObserver(resize)
//     if (containerRef?.current) ro.observe(containerRef.current)
//     window.addEventListener('resize', resize)
//     resize()
//     return () => {
//       ro.disconnect()
//       window.removeEventListener('resize', resize)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [character])

//   // When character changes, clear strokes
//   useEffect(() => {
//     pathsRef.current = []
//     currentPathRef.current = null
//     clearCanvas()
//   }, [character])

//   // Pointer event handlers
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext('2d')
//     ctx.lineJoin = 'round'
//     ctx.lineCap = 'round'

//     function getPointFromEvent(e) {
//       const rect = canvas.getBoundingClientRect()
//       return {
//         x: (e.clientX - rect.left) * (canvas.width / rect.width),
//         y: (e.clientY - rect.top) * (canvas.height / rect.height),
//         pressure: e.pressure === undefined ? 0.5 : e.pressure
//       }
//     }

//     function pointerDown(e) {
//       e.preventDefault()
//       canvas.setPointerCapture(e.pointerId)
//       const p = getPointFromEvent(e)
//       currentPathRef.current = { points: [p], width: strokeWidth, color: strokeColor }
//       setIsPointerDown(true)
//       drawPoint(p, currentPathRef.current)
//     }

//     function pointerMove(e) {
//       if (!currentPathRef.current) return
//       const p = getPointFromEvent(e)
//       currentPathRef.current.points.push(p)
//       drawPoint(p, currentPathRef.current)
//     }

//     function pointerUp() {
//       if (!currentPathRef.current) return
//       pathsRef.current.push(currentPathRef.current)
//       currentPathRef.current = null
//       setIsPointerDown(false)
//     }

//     canvas.addEventListener('pointerdown', pointerDown)
//     canvas.addEventListener('pointermove', pointerMove)
//     window.addEventListener('pointerup', pointerUp)

//     return () => {
//       canvas.removeEventListener('pointerdown', pointerDown)
//       canvas.removeEventListener('pointermove', pointerMove)
//       window.removeEventListener('pointerup', pointerUp)
//     }
//     // strokeWidth and strokeColor intentionally not included to avoid reattaching handlers frequently
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     // redraw to apply new pen style immediately
//     redrawAll()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [strokeColor, strokeWidth])

//   function drawPoint(p, path) {
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')
//     ctx.save()
//     ctx.lineWidth = Math.max(1, path.width * (p.pressure || 0.6))
//     ctx.strokeStyle = path.color
//     const pts = path.points
//     if (pts.length === 1) {
//       ctx.beginPath()
//       ctx.moveTo(pts[0].x, pts[0].y)
//       ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1)
//       ctx.stroke()
//     } else {
//       // smooth bezier between last two points
//       const len = pts.length
//       const p1 = pts[len - 2]
//       const p2 = pts[len - 1]
//       ctx.beginPath()
//       ctx.moveTo(p1.x, p1.y)
//       ctx.lineTo(p2.x, p2.y)
//       ctx.stroke()
//     }
//     ctx.restore()
//   }

//   function redrawAll() {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     // redraw saved paths
//     for (const path of pathsRef.current) {
//       ctx.save()
//       ctx.lineJoin = 'round'
//       ctx.lineCap = 'round'
//       ctx.strokeStyle = path.color
//       for (let i = 0; i < path.points.length; i++) {
//         const p = path.points[i]
//         ctx.lineWidth = Math.max(1, path.width * (p.pressure || 0.6))
//         if (i === 0) {
//           ctx.beginPath()
//           ctx.moveTo(p.x, p.y)
//           ctx.lineTo(p.x + 0.1, p.y + 0.1)
//           ctx.stroke()
//         } else {
//           const p0 = path.points[i - 1]
//           ctx.beginPath()
//           ctx.moveTo(p0.x, p0.y)
//           ctx.lineTo(p.x, p.y)
//           ctx.stroke()
//         }
//       }
//       ctx.restore()
//     }
//   }

//   function clearCanvas() {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     pathsRef.current = []
//     currentPathRef.current = null
//   }

//   function undo() {
//     pathsRef.current.pop()
//     redrawAll()
//   }

//   function downloadPNG() {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     // merge the faded character image and strokes into a single image
//     const out = document.createElement('canvas')
//     out.width = canvas.width
//     out.height = canvas.height
//     const ctx = out.getContext('2d')
//     // draw character image
//     const img = imgRef.current
//     if (img && img.complete) {
//       ctx.drawImage(img, 0, 0, out.width, out.height)
//     }
//     // draw strokes
//     ctx.drawImage(canvas, 0, 0)
//     const url = out.toDataURL('image/png')
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `${character.id}_practice.png`
//     a.click()
//   }

//   // optional placeholder guide: in a full version you could supply precise SVG stroke order data
//   function GuideSVG({ size }) {
//     // Example: a faint cross and stroke direction arrows — replace with real paths as needed
//     return (
//       <svg ref={overlayRef} width={size} height={size} className="absolute top-0 left-0 pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
//         <g opacity="0.25" stroke="#000" strokeWidth="4" fill="none">
//           <line x1={size * 0.15} y1={size * 0.15} x2={size * 0.85} y2={size * 0.85} />
//           <line x1={size * 0.85} y1={size * 0.15} x2={size * 0.15} y2={size * 0.85} />
//         </g>
//       </svg>
//     )
//   }

//   return (
//     <div className="w-full flex flex-col items-center">
//       <div className="relative bg-gray-100 rounded-xl overflow-hidden">
//         <img ref={imgRef} src={character.file} alt={character.label} className="absolute top-0 left-0 opacity-30 select-none" draggable={false} />
//         <canvas ref={canvasRef} className="relative touch-none" style={{ display: 'block' }} />
//         {showGuide && (
//           <div className="absolute inset-0">
//             {/* sized by resize observer */}
//             <GuideSVG size={300} />
//           </div>
//         )}
//       </div>

//       <div className="mt-4 w-full flex items-center gap-2">
//         <button className="px-3 py-2 bg-red-500 text-white rounded-lg" onClick={clearCanvas}>Clear</button>
//         <button className="px-3 py-2 bg-gray-100 rounded-lg" onClick={undo}>Undo</button>
//         <button className="px-3 py-2 bg-green-600 text-white rounded-lg ml-auto" onClick={downloadPNG}>Save PNG</button>
//       </div>

//       <div className="mt-2 text-xs text-gray-500">{isPointerDown ? 'Drawing...' : 'Ready'}</div>
//     </div>
//   )
// }


import React, { useRef, useState, useEffect, useCallback } from "react";

const CHARACTERS = [
  { file: "/characters/ga.png", label: "가" },
  { file: "/characters/na.png", label: "나" },
  { file: "/characters/da.png", label: "다" },
  { file: "/characters/ma.png", label: "마" },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(4);
  const [showGuide, setShowGuide] = useState(true);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const pathsRef = useRef([]);
  const currentPathRef = useRef(null);

  const character = CHARACTERS[index];

  // -------------------------------
  // DRAWING LOGIC
  // -------------------------------
  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
  };

  const pointerDown = (e) => {
    drawing.current = true;
    const { offsetX, offsetY } = getCoords(e);
    const ctx = ctxRef.current;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    currentPathRef.current = [{ x: offsetX, y: offsetY, color: penColor, size: penSize }];
  };

  const pointerMove = (e) => {
    if (!drawing.current) return;
    const { offsetX, offsetY } = getCoords(e);
    const ctx = ctxRef.current;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    currentPathRef.current.push({ x: offsetX, y: offsetY, color: penColor, size: penSize });
  };

  const pointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    pathsRef.current.push(currentPathRef.current);
    currentPathRef.current = null;
  };

  // -------------------------------
  // REDRAW FUNCTION
  // -------------------------------
  const redraw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const path of pathsRef.current) {
      ctx.beginPath();
      ctx.strokeStyle = path[0].color;
      ctx.lineWidth = path[0].size;
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    }
  }, []);

  // -------------------------------
  // RESIZE FUNCTION
  // -------------------------------
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = size;
    canvas.height = size;
    redraw();
  }, [redraw]);

  // -------------------------------
  // INITIAL SETUP + RESIZE HANDLER
  // -------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // -------------------------------
  // ACTION BUTTONS
  // -------------------------------
  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathsRef.current = [];
  };

  const undo = () => {
    pathsRef.current.pop();
    redraw();
  };

  const saveImage = () => {
    const link = document.createElement("a");
    link.download = `${character.label}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-3xl font-bold mb-1">Korean Handwriting Practice</h1>
        <p className="text-gray-600 text-sm max-w-xl mx-auto">
          Trace the faded Korean character using your mouse, finger, or stylus.
        </p>
      </header>

      {/* Main content area */}
      <main className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Left: Drawing card */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <div className="relative w-full max-w-[320px] aspect-square bg-white rounded-2xl overflow-hidden shadow-lg flex justify-center items-center">
            {/* Background PNG */}
            <img
              src={character.file}
              alt={character.label}
              className="absolute inset-0 w-full h-full object-contain opacity-25 pointer-events-none select-none"
              draggable={false}
            />

            {/* Canvas overlay */}
            <canvas
              ref={canvasRef}
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
              onTouchStart={pointerDown}
              onTouchMove={pointerMove}
              onTouchEnd={pointerUp}
              className="absolute inset-0 touch-none"
            />

            {/* Optional guide overlay */}
            {showGuide && (
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <GuideSVG size={280} />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Prev
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(CHARACTERS.length - 1, i + 1))}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Next
            </button>
            <button
              onClick={() => setIndex(Math.floor(Math.random() * CHARACTERS.length))}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Random
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <aside className="w-full lg:w-80 bg-white text-gray-900 rounded-2xl shadow p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pen Color</label>
            <input
              type="color"
              value={penColor}
              onChange={(e) => setPenColor(e.target.value)}
              className="w-full h-10 cursor-pointer border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pen Size</label>
            <input
              type="range"
              min="1"
              max="20"
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={clearCanvas} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded">
              Clear
            </button>
            <button onClick={undo} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded">
              Undo
            </button>
            <button onClick={saveImage} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded">
              Save
            </button>
          </div>

          <label className="flex items-center gap-2 mt-2 text-sm">
            <input
              type="checkbox"
              checked={showGuide}
              onChange={(e) => setShowGuide(e.target.checked)}
            />
            Show Stroke Guide
          </label>
        </aside>
      </main>
    </div>
  );
}

// -------------------------------
// Simple stroke guide
// -------------------------------
function GuideSVG({ size = 300 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-10"
    >
      <line x1="0" y1="50" x2="100" y2="50" stroke="red" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="100" stroke="red" strokeWidth="1" />
    </svg>
  );
}
