import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.016);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.z = 28;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Particles — more, brighter, richer color palette
    const particleCount = 2400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorAccents = [
      new THREE.Color(0xff5510), // vivid orange
      new THREE.Color(0xff7830), // warm amber-orange
      new THREE.Color(0x3a1a08), // deep ember
      new THREE.Color(0x5a2010), // dark copper
      new THREE.Color(0x1a0f1a), // very dark slate-purple (subtle cool contrast)
      new THREE.Color(0xffa060), // bright warm highlight
    ];

    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
      const distance = THREE.MathUtils.randFloat(5, 50);

      positions[i * 3]     = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);

      const base = colorAccents[Math.floor(Math.random() * colorAccents.length)].clone();
      // Make ~25% of particles noticeably brighter for subtle sparkle
      if (Math.random() > 0.75) {
        base.addScalar(0.16);
      } else if (Math.random() > 0.5) {
        base.addScalar(0.06);
      }
      colors[i * 3]     = Math.min(base.r, 1);
      colors[i * 3 + 1] = Math.min(base.g, 1);
      colors[i * 3 + 2] = Math.min(base.b, 1);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Richer particle texture — broader soft bloom
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.2, "rgba(255, 120, 40, 0.5)");
        gradient.addColorStop(0.5, "rgba(180, 60, 10, 0.18)");
        gradient.addColorStop(0.8, "rgba(80,  20,  5, 0.04)");
        gradient.addColorStop(1,   "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.24,
      map: createParticleTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const starfield = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starfield);

    // 4. Wireframe sculptures — slightly more visible, more ambient
    const geometryIco = new THREE.IcosahedronGeometry(8, 1);
    const materialIco = new THREE.MeshBasicMaterial({
      color: 0xff5510,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const structure = new THREE.Mesh(geometryIco, materialIco);
    structure.position.set(10, 4, -5);
    scene.add(structure);

    const geometryIco2 = new THREE.IcosahedronGeometry(6, 1);
    const materialIco2 = new THREE.MeshBasicMaterial({
      color: 0xffa060,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const structure2 = new THREE.Mesh(geometryIco2, materialIco2);
    structure2.position.set(-12, -6, -2);
    scene.add(structure2);

    // Third subtle ring for depth layering
    const geometryRing = new THREE.TorusGeometry(14, 0.08, 8, 80);
    const materialRing = new THREE.MeshBasicMaterial({
      color: 0xff4e00,
      transparent: true,
      opacity: 0.022,
    });
    const ring = new THREE.Mesh(geometryRing, materialRing);
    ring.rotation.x = Math.PI / 3;
    ring.position.set(0, 0, -8);
    scene.add(ring);

    // 5. Softer lighting — warm key + gentle fill + ambient
    const keyLight = new THREE.PointLight(0xff5510, 1.4, 60);
    keyLight.position.set(20, 10, 10);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xff8040, 0.5, 40);
    fillLight.position.set(-15, -5, 5);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.06);
    scene.add(ambientLight);

    // 6. Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let scrollY = 0;
    let targetScrollY = 0;
    const handleScroll = () => { targetScrollY = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 7. Animation loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.06;

      starfield.rotation.y = elapsedTime * 0.018 + targetX * 0.08;
      starfield.rotation.x = elapsedTime * 0.009 + targetY * 0.05;

      structure.rotation.y = -elapsedTime * 0.04 + targetX * 0.1;
      structure.rotation.x =  elapsedTime * 0.02 + targetY * 0.08;
      structure.position.y = 4 + Math.sin(elapsedTime * 0.3) * 1.5;

      structure2.rotation.y =  elapsedTime * 0.03 - targetX * 0.06;
      structure2.rotation.x = -elapsedTime * 0.01 - targetY * 0.05;
      structure2.position.y = -6 + Math.cos(elapsedTime * 0.2) * 1;

      ring.rotation.z = elapsedTime * 0.015;
      ring.rotation.y = elapsedTime * 0.008 + targetX * 0.04;

      // Key light breathes very subtly
      keyLight.intensity = 1.4 + Math.sin(elapsedTime * 0.4) * 0.12;

      camera.position.x = targetX * 3;
      camera.position.y = targetY * 3 - (scrollY * 0.012);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          width = containerRef.current.clientWidth;
          height = containerRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      geometryIco.dispose();
      materialIco.dispose();
      geometryIco2.dispose();
      materialIco2.dispose();
      geometryRing.dispose();
      materialRing.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-50 overflow-hidden bg-[#050505]"
      id="3d-background-canvas"
    />
  );
}
