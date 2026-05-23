import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // 1. Create Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.z = 28;

    // 2. Renderer with Antialiasing and proper alpha blending
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Create Ambient Particles (Starfield)
    const particleCount = 1800;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const randomScales = new Float32Array(particleCount);

    const colorAccents = [
      new THREE.Color(0xff4e00), // fiery orange theme accent
      new THREE.Color(0x2a140a), // deep copper warm bronze
      new THREE.Color(0x502008), // dark red-orange
      new THREE.Color(0x0f172a), // slate
    ];

    for (let i = 0; i < particleCount; i++) {
      // Create a cylindrical or spherical spread of particles for realistic depth
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
      const distance = THREE.MathUtils.randFloat(5, 45);

      positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);

      // Interpolate colors for high-end cinematic ambiance
      const mixedColor = colorAccents[Math.floor(Math.random() * colorAccents.length)].clone();
      if (Math.random() > 0.7) {
        mixedColor.addScalar(0.2); // make some particles brighter
      }
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      randomScales[i] = Math.random();
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture creator (glowing circular diffuse point)
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 78, 0, 0.6)");
        gradient.addColorStop(0.6, "rgba(80, 32, 8, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.28,
      map: createParticleTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const starfield = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starfield);

    // 4. Create floating elegant cinematic wireframe objects in background
    // We create multiple rings/sculptures that slowly float and merge
    const geometryIco = new THREE.IcosahedronGeometry(8, 1);
    const materialIco = new THREE.MeshBasicMaterial({
      color: 0xff4e00,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const structure = new THREE.Mesh(geometryIco, materialIco);
    structure.position.set(10, 4, -5);
    scene.add(structure);

    const geometryIco2 = new THREE.IcosahedronGeometry(6, 1);
    const materialIco2 = new THREE.MeshBasicMaterial({
      color: 0xffa066,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const structure2 = new THREE.Mesh(geometryIco2, materialIco2);
    structure2.position.set(-12, -6, -2);
    scene.add(structure2);

    // Subtle lighting transitions in scene
    const pointLight = new THREE.PointLight(0xff4e00, 1.2, 50);
    pointLight.position.set(20, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // 5. Track mouse coordinates for cinematic parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize values between -1 and 1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle scroll to map to camera perspective transforms depth-wise
    let scrollY = 0;
    let targetScrollY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 6. Animation loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation (lerp) for cursor parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Smooth interpolation for scroll
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Apply parallax rotation to starfield and structures
      starfield.rotation.y = elapsedTime * 0.02 + targetX * 0.08;
      starfield.rotation.x = elapsedTime * 0.01 + targetY * 0.05;

      // Drift wireframes slowly
      structure.rotation.y = -elapsedTime * 0.04 + targetX * 0.1;
      structure.rotation.x = elapsedTime * 0.02 + targetY * 0.08;
      structure.position.y = 4 + Math.sin(elapsedTime * 0.3) * 1.5;

      structure2.rotation.y = elapsedTime * 0.03 - targetX * 0.06;
      structure2.rotation.x = -elapsedTime * 0.01 - targetY * 0.05;
      structure2.position.y = -6 + Math.cos(elapsedTime * 0.2) * 1;

      // Camera transitions on scroll (slight pan downwards and zoom)
      camera.position.x = targetX * 3;
      camera.position.y = targetY * 3 - (scrollY * 0.012);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Handle system resize via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
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

    // Clean up
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
