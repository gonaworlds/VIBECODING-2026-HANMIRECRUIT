import { useEffect, useRef, useState } from 'react';

const players = {
  walking: {
    metadataUrl: './data/walking-metadata.json',
    directory: './hanmi-eye-tracking/assets/',
  },
  reading: {
    metadataUrl: './data/reading-metadata.json',
    directory: './hanmi-reading-eye-tracking/assets/',
  },
};

export default function CanvasWalker({ variant, className, ariaLabel }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('이미지 준비 중');

  useEffect(() => {
    const canvas = canvasRef.current;
    const player = players[variant];
    const context = canvas.getContext('2d');

    if (!context) {
      setStatus('캐릭터를 표시할 수 없습니다. Canvas를 지원하는 브라우저를 사용해 주세요.');
      return undefined;
    }

    let active = true;
    let visible = true;
    let frameIndex = 0;
    let elapsed = 0;
    let previousFrameTime = 0;
    let animationFrame = 0;
    let pointer = null;
    let gaze = { x: 0, y: 0 };
    let metadata;
    let frames = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;

    function draw() {
      const image = frames[frameIndex];
      if (!metadata || !image) return;

      const offset = metadata.offset[frameIndex];
      context.clearRect(0, 0, metadata.stage[0], metadata.stage[1]);
      context.drawImage(image, offset[0], offset[1]);

      if (!pointer || !metadata.eyes?.[frameIndex]) return;

      const eyes = metadata.eyes[frameIndex];
      const centerX = offset[0] + (eyes[0].x + eyes[1].x) / 2;
      const centerY = offset[1] + (eyes[0].y + eyes[1].y) / 2;
      const dx = pointer.x - centerX;
      const dy = pointer.y - centerY;
      const distance = Math.hypot(dx, dy);
      const amount = Math.min(1, distance / 210);
      const target = distance
        ? { x: (dx / distance) * amount, y: (dy / distance) * amount }
        : { x: 0, y: 0 };

      if (paused) {
        gaze = target;
      } else {
        gaze.x += (target.x - gaze.x) * 0.3;
        gaze.y += (target.y - gaze.y) * 0.3;
      }

      for (const eye of eyes) {
        const x = offset[0] + eye.x;
        const y = offset[1] + eye.y;
        const { rx, ry } = eye;

        context.save();
        context.beginPath();
        context.ellipse(x, y, rx, ry, eye.rotation || 0, 0, Math.PI * 2);
        context.clip();
        context.fillStyle = '#fff';
        context.fillRect(x - rx * 2, y - ry * 2, rx * 4, ry * 4);

        const pupilX = x + gaze.x * rx * 0.29;
        const pupilY = y + gaze.y * ry * 0.23;
        context.fillStyle = '#14232a';
        context.beginPath();
        context.ellipse(pupilX, pupilY, rx * 0.55, ry * 0.59, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = 'rgba(255,255,255,.92)';
        context.beginPath();
        context.arc(pupilX - rx * 0.16, pupilY - ry * 0.25, rx * 0.12, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      if (metadata.occluders?.[frameIndex]) {
        context.save();
        context.beginPath();
        for (const [x, y, width] of metadata.occluders[frameIndex]) {
          context.rect(offset[0] + x - 0.5, offset[1] + y - 0.5, width + 1, 2);
        }
        context.clip();
        context.drawImage(image, offset[0], offset[1]);
        context.restore();
      }
    }

    function stopAnimation() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousFrameTime = 0;
    }

    function tick(timestamp) {
      animationFrame = 0;
      if (!active || !visible || document.hidden) {
        previousFrameTime = 0;
        return;
      }

      const delta = previousFrameTime
        ? Math.min((timestamp - previousFrameTime) / 1000, 0.1)
        : 0;
      previousFrameTime = timestamp;

      if (!paused) {
        elapsed += delta;
        frameIndex = Math.floor(elapsed * metadata.fps) % metadata.count;
      }

      draw();

      if (!paused) {
        animationFrame = window.requestAnimationFrame(tick);
      } else {
        previousFrameTime = 0;
      }
    }

    function update() {
      if (!active || !metadata || !visible || document.hidden) {
        stopAnimation();
        return;
      }

      if (paused) draw();
      if (!animationFrame && !paused) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    function onPointerMove(event) {
      if (event.pointerType === 'touch' || !metadata) return;
      const bounds = canvas.getBoundingClientRect();
      pointer = {
        x: ((event.clientX - bounds.left) * metadata.stage[0]) / bounds.width,
        y: ((event.clientY - bounds.top) * metadata.stage[1]) / bounds.height,
      };
      update();
    }

    function onPointerLeave() {
      pointer = null;
      if (paused) draw();
    }

    function onVisibilityChange() {
      update();
    }

    function onMotionPreferenceChange(event) {
      paused = event.matches;
      update();
    }

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointercancel', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionPreferenceChange);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { rootMargin: '80px' });
    observer.observe(canvas);

    async function loadFrames() {
      try {
        const response = await fetch(player.metadataUrl);
        if (!response.ok) {
          throw new Error(`프레임 정보를 불러오지 못했습니다. HTTP ${response.status}`);
        }

        metadata = await response.json();
        if (
          !Number.isInteger(metadata.count) ||
          !Array.isArray(metadata.offset) ||
          metadata.offset.length !== metadata.count
        ) {
          throw new Error('캐릭터 프레임 정보의 형식이 올바르지 않습니다.');
        }
        frames = new Array(metadata.count);

        let nextFrame = 0;
        let loadedFrames = 0;

        async function loadWorker() {
          while (nextFrame < metadata.count) {
            const index = nextFrame;
            nextFrame += 1;
            const image = new Image();
            const frameName = metadata.src
              ? metadata.src.replace('{n}', String(index + 1))
              : `run_${index + 1}.png`;

            await new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = () => reject(new Error(frameName));
              image.src = `${player.directory}${frameName}`;
            });

            if (!active) return;
            frames[index] = image;
            loadedFrames += 1;
            setStatus(`이미지 준비 중 ${loadedFrames}/${metadata.count}`);
            if (index === 0) draw();
          }
        }

        await Promise.all(Array.from({ length: 4 }, loadWorker));
        if (!active) return;
        setStatus('');
        update();
      } catch (error) {
        if (!active) return;
        console.error('한미 캐릭터 프레임을 불러오지 못했습니다.', error);
        setStatus(`캐릭터 이미지를 불러오지 못했습니다. ${error.message}`);
      }
    }

    loadFrames();

    return () => {
      active = false;
      stopAnimation();
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointercancel', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onMotionPreferenceChange);
    };
  }, [variant]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        role="img"
        aria-label={ariaLabel}
      />
      {status && <span data-status role="status">{status}</span>}
    </div>
  );
}
