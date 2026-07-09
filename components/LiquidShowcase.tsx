"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

const vs = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0, 1);
  }
`;

const fs = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_image;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_strength;
  uniform float u_speed;
  uniform float u_maskRadius;
  uniform vec2 u_resolution;
  uniform vec2 u_imageResolution;

  void main() {
      vec2 uv = v_uv;
      vec2 ratio = vec2(max(u_resolution.x / u_resolution.y, 1.0), max(u_resolution.y / u_resolution.x, 1.0));
      
      // Object-fit: cover logic ONLY for Mobile/Portrait to prevent vertical swelling
      // Desktop (Landscape) remains exactly as original (stretched to fit)
      vec2 coverUv = uv;
      if (u_resolution.x < u_resolution.y) {
          float rs = u_resolution.x / u_resolution.y;
          float ri = u_imageResolution.x / u_imageResolution.y;
          vec2 st = vec2(rs / ri, 1.0);
          vec2 offset = vec2((1.0 - st.x) * 0.5, 0.0);
          coverUv = uv * st + offset;
      }
      
      vec4 color = texture2D(u_image, coverUv);
      
      // Grayscale
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      vec3 grayColor = vec3(gray * 0.4);
      
      // Color reveal mask with aspect correction
      float mask = 0.0;
      // Sadece masaüstünde (yatay ekranda) fener efektine izin ver. Mobilde her zaman 0.0 (gri) kalacak.
      if (u_resolution.x >= u_resolution.y && u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0) {
          float d = distance(uv * ratio, u_mouse * ratio);
          mask = smoothstep(0.3, 0.05, d);
      }
      
      vec3 finalColor = mix(grayColor, color.rgb, mask);
      gl_FragColor = vec4(finalColor, color.a);
  }
`;

export default function LiquidShowcase({ imageSrc }: { imageSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const isVisibleRef = useRef(true); // Görünürlük durumunu tutan referans

  // Ekran görünürlüğünü takip eden IntersectionObserver entegrasyonu
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 } // Görselin %5'i bile ekranda olsa çalışır, tamamen kaybolunca uyur
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || size.width === 0) return;
    const canvas = canvasRef.current;

    let animId: number;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let texture: WebGLTexture | null = null;

    const initWebGL = () => {
      // Önceki animasyonu temizle
      if (animId) cancelAnimationFrame(animId);

      gl = canvas.getContext("webgl");
      if (!gl) return;

      // High DPI
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size.width * dpr;
      canvas.height = size.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);

      program = createProgram(gl, vs, fs);
      if (!program) return;

      const posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      
      img.onload = () => {
        if (!gl) return;
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // Flip texture for correct orientation in WebGL
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };

      const uTime = gl.getUniformLocation(program, "u_time");
      const uMouse = gl.getUniformLocation(program, "u_mouse");
      const uStrength = gl.getUniformLocation(program, "u_strength");
      const uSpeed = gl.getUniformLocation(program, "u_speed");
      const uResolution = gl.getUniformLocation(program, "u_resolution");
      const uImageResolution = gl.getUniformLocation(program, "u_imageResolution");

      const startTime = Date.now();

      gl.enable(gl.BLEND);
      // Actually just use standard blending
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const render = () => {
        // Eğer kahraman görselimiz (Hero) ekranda değilse WebGL çizim döngüsünü tamamen uykuya alıp ekran kartını %0 yüke düşürüyoruz
        if (!isVisibleRef.current || !texture || !program || !gl) {
          animId = requestAnimationFrame(render);
          return;
        }

        gl.useProgram(program);
        gl.uniform1f(uTime, (Date.now() - startTime) / 1000);
        // Map DOM mouse Y to WebGL coordinates (bottom-up)
        gl.uniform2f(uMouse, mouseRef.current.x, 1 - mouseRef.current.y);
        gl.uniform1f(uStrength, 0.5);
        gl.uniform1f(uSpeed, 1.0);
        gl.uniform2f(uResolution, size.width, size.height);
        gl.uniform2f(uImageResolution, img.width || 1, img.height || 1);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animId = requestAnimationFrame(render);
      };

      render();
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault(); // Tarayıcının canvas'ı çöpe atmasını engelle
      cancelAnimationFrame(animId);
    };

    const handleContextRestored = () => {
      initWebGL(); // Bağlantı geri geldiğinde sıfırdan her şeyi baştan kur
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // İlk kurulumu başlat
    initWebGL();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [size, imageSrc]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[15]">
      <div className="relative w-full h-full pointer-events-auto">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="w-full h-full cursor-default"
        />
      </div>
    </div>
  );
}

function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const vShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vShader, vsSrc);
  gl.compileShader(vShader);
  
  const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fShader, fsSrc);
  gl.compileShader(fShader);
  
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vShader);
  gl.attachShader(prog, fShader);
  gl.linkProgram(prog);
  return prog;
}
