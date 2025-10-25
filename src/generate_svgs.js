// src/generate_svgs.js
// Node script to generate clean SVGs (static + animated) from a Korean font.
// Requires: npm i text-to-svg
import TextToSVG from 'text-to-svg';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// === configure this to a font you have (you said malgun exists) ===
const FONT_PATH = 'C:/Windows/Fonts/malgun.ttf';

// load font
const textToSVG = TextToSVG.loadSync(FONT_PATH);

// output folder
const OUTPUT_DIR = path.resolve('../public/svgs');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// characters to generate (syllables). add more later, or generate range.
const chars = [
  '가', '나', '다', '라', '마',
  '바', '사', '아', '자', '차',
  '카', '타', '파', '하'
];

// options used when rendering with text-to-svg; tweak y/fontSize if necessary
const textToSVGOptions = {
  x: 0,
  y: 200,        // vertical offset so glyph is inside viewBox
  fontSize: 260, // font size to produce a large path
  anchor: 'top'
};

// function: get the raw SVG string from text-to-svg, extract inner content, then rebuild safe SVG
function buildCleanSVG(char) {
  // getSVG returns a full svg string already, e.g. "<svg ...>...<path .../></svg>"
  const rawSvg = textToSVG.getSVG(char, textToSVGOptions);

  // Extract everything between the outer <svg ...> and </svg>
  // We will then wrap only the inner markup in a single clean <svg> with desired attributes.
  const innerMatch = rawSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const inner = innerMatch ? innerMatch[1] : rawSvg;

  // Build a new, clean svg wrapper. adjust viewBox to suit your app.
  // Using 0 0 300 300 as a predictable square viewBox for layout/scaling
const cleanSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 600 600" width="300" height="300"
     preserveAspectRatio="xMidYMid meet">
  <g transform="scale(2, 2) translate(0, -225)">
    ${inner}
  </g>
</svg>`;

  return cleanSvg;
}

//------------------------WORKING------------------------
// produce an animated variant by adding stroke-dash animation to each path element
// function makeAnimatedSVG(staticSvg) {
//   // Replace self-closing <path .../> with an animated version
//   return staticSvg.replace(
//     /<path([^>]*)\/>/gi,
//     (match, attrs) => {
//       // Preserve existing stroke and fill attributes, but ensure visible stroke
//       if (!/stroke=/.test(attrs)) {
//         attrs += ' stroke="black"';
//       }
//       if (!/fill=/.test(attrs)) {
//         attrs += ' fill="none"';
//       }

//       // Large dash length to cover scaled paths
//       const dash = 2000;

//       return `<path${attrs} stroke-dasharray="${dash}" stroke-dashoffset="${dash}">
//         <animate attributeName="stroke-dashoffset" from="${dash}" to="0" dur="5s" fill="freeze" />
//       </path>`;
//     }
//   );
// }
//------------------------WORKING------------------------
//------------------------ERRORED------------------------
function makeAnimatedSVG(staticSvg) {
  const dashSpeed = 2000;   // pixels per second of stroke reveal
  const dom = new JSDOM(staticSvg, { contentType: "image/svg+xml" });
  const doc = dom.window.document;
  const paths = Array.from(doc.querySelectorAll('path'));

  let currentBegin = 0;

  for (const path of paths) {
    // compute actual length
    const totalLength = path.getTotalLength ? path.getTotalLength() : 1000;
    const dur = totalLength / dashSpeed; // duration in seconds
    const dash = Math.ceil(totalLength);

    // ensure stroke + fill visibility
    if (!path.hasAttribute('stroke')) path.setAttribute('stroke', 'black');
    if (!path.hasAttribute('fill')) path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', dash);
    path.setAttribute('stroke-dashoffset', dash);

    // create animate element
    const animate = doc.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animate.setAttribute('attributeName', 'stroke-dashoffset');
    animate.setAttribute('from', dash);
    animate.setAttribute('to', '0');
    animate.setAttribute('dur', `${dur}s`);
    animate.setAttribute('begin', `${currentBegin}s`);
    animate.setAttribute('fill', 'freeze');

    path.appendChild(animate);

    // advance timeline for next stroke
    currentBegin += dur;
  }

  return doc.documentElement.outerHTML;
}
//------------------------ERRORED------------------------

// generate files
for (const ch of chars) {
  try {
    const safeName = `${ch.charCodeAt(0)}`; // use codepoint to avoid filesystem issues with raw Hangul names
    const staticSvg = buildCleanSVG(ch);
    const animatedSvg = makeAnimatedSVG(staticSvg);

    fs.writeFileSync(path.join(OUTPUT_DIR, `${safeName}.svg`), staticSvg, 'utf8');
    fs.writeFileSync(path.join(OUTPUT_DIR, `${safeName}_anim.svg`), animatedSvg, 'utf8');

    console.log(`✅ ${ch} -> ${safeName}.svg and ${safeName}_anim.svg`);
  } catch (err) {
    console.error(`❌ failed for ${ch}`, err);
  }
}

console.log(`🎉 Done. SVGs written into ${OUTPUT_DIR}`);



// import TextToSVG from 'text-to-svg'
// import fs from 'fs'
// import path from 'path'

// // Choose a Korean font available on your system
// // Examples: "C:/Windows/Fonts/NotoSansKR-Regular.otf" or "C:/Windows/Fonts/MalgunGothic.ttf"
// const FONT_PATH = 'C:/Windows/Fonts/malgunbd.ttf'
// const textToSVG = TextToSVG.loadSync(FONT_PATH)

// // Output structure
// const outputRoot = './public/svgs'
// const jamoDir = path.join(outputRoot, 'jamo')
// const syllableDir = path.join(outputRoot, 'syllables')

// for (const dir of [outputRoot, jamoDir, syllableDir]) {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
// }

// // Jamo and syllables
// const jamo = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ']
// const syllables = ['가','나','다','라','마','바','사','아','자','차','카','타','파','하']

// // Function to build an SVG (with optional animation)
// function makeSVG(char, animated = false) {
//   const svg = textToSVG.getPath(char, { x: 0, y: 100, fontSize: 100, anchor: 'top' })
//   const svgPath = svg.replace('<path', '<path stroke="black" stroke-width="3" fill="none"')

//   // Wrap with SVG header
//   let final = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
//     <rect width="100%" height="100%" fill="none"/>
//     ${svgPath}
//   </svg>`

//   // Animated version: stroke-dash trick
//   if (animated) {
//     final = final.replace(
//       /<path([^>]*)\/>/,
//       `<path$1 stroke-dasharray="500" stroke-dashoffset="500">
//         <animate attributeName="stroke-dashoffset" from="500" to="0" dur="1s" fill="freeze"/>
//       </path>`
//     )
//   }

//   return final
// }

// // Generate both static and animated variants
// function writeSet(chars, folder) {
//   chars.forEach((char) => {
//     const safeName = char.charCodeAt(0)
//     const normalPath = path.join(folder, `${safeName}.svg`)
//     const animatedPath = path.join(folder, `${safeName}_anim.svg`)
//     fs.writeFileSync(normalPath, makeSVG(char, false))
//     fs.writeFileSync(animatedPath, makeSVG(char, true))
//   })
// }

// // Generate
// writeSet(jamo, jamoDir)
// writeSet(syllables, syllableDir)

// console.log('✅ Generated SVGs in public/svgs/{jamo,syllables}')
