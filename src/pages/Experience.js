import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, FileText, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import NavButton from '../components/NavButton';
import '../styles/entranceAnimations.css';

// Experience data
const CARDS_DATA = [
  { 
    title: "UBS", 
    role: "Software Developer Intern", 
    date: "Jun 2025 - Aug 2025",
    desc: "- Developed an Agentic AI application to accelerate code creation for Global Markets." + 
    "\n\n- Implemented a multi-agent workflow improving output consistency and reducing manual review." + 
    "\n\n- Optimised RAG agent performance by implementing hybrid tool selection, increasing system reliability." + 
    "\n\n- [REDACTED] Digital Assets [REDACTED]." + 
    "\n\n- Launched an intern development program, leading public speaking sessions.",
    color: "#E60100",
    url: "https://www.ubs.com",
    modelPath: "/3DLogos/UBS3DLogo.glb"
  },
  { 
    title: "University of Warwick", 
    role: "BSc Computer Science", 
    date: "Sep 2023 - Jun 2026",
    desc: "Warwick Hackathon '25 Winner (incident.io's Adaptive Agents)" +
    "\n\nKey Modules:" + 
    "\n- Neural Networks" +
    "\n- Machine Learning" +
    "\n- Software Engineering" +
    "\n- Artificial Intelligence" +
    "\n- Operating Systems & Networks" +
    "\n- Database Systems" +
    "\n- Web Development",
    color: "#a499f4",
    url: "https://warwick.ac.uk",
    modelPath: "/3DLogos/Warwick3DLogo.glb"
  },
  { 
    title: "Merletto Lounge", 
    role: "Assistant Manager", 
    date: "Mar 2021 - Current",
    desc: "- Managed teams of up to 6 per shift." +
    "\n\n- Conducted essential onboarding training for both staff and management." +
    "\n\n- Handled stocks and audits." +
    "\n\n- Utilised forecasting to minimise labour costs.",
    color: "#c65602",
    url: "https://thelounges.co.uk/merletto/",
    modelPath: "/3DLogos/Loungers3DLogo.glb"
  }
];

// Helper function to create fallback 3D model (used while GLB loads)
function createFallbackModel(color) {
  const geometry = new THREE.TorusKnotGeometry(0.35, 0.12, 100, 16);
  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    roughness: 0.3,
    metalness: 0.8,
    transparent: true
  });
  return new THREE.Mesh(geometry, material);
}

// GLTFLoader instance
const gltfLoader = new GLTFLoader();

export default function Experience() {
  const containerRef = useRef(null);
  const threeRef = useRef({
    scene: null,
    renderer: null,
    camera: null,
    cardGroups: [],
    mouse: new THREE.Vector2(),
    rotationAngle: 0,
    targetRotationAngle: 0,
    isDragging: false,
    startX: 0,
    startRotation: 0,
    animationFrame: null,
    activeIndex: 0,
    dummy: new THREE.Object3D(),
    raycaster: new THREE.Raycaster()
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stepAngle = (Math.PI * 2) / CARDS_DATA.length;

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const three = threeRef.current;
    const isMobile = window.innerWidth < 1024; // lg breakpoint

    // Scene setup
    const scene = new THREE.Scene();
    three.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 12;
    camera.position.y = isMobile ? -2.2 : 0;  // Camera lower on mobile = logos appear higher
    three.camera = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    three.renderer = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x9370DB, 0.4);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Create cards - center on mobile, offset left on desktop
    const globalXOffset = isMobile ? 0 : -2.5;
    const cardGroups = [];

    CARDS_DATA.forEach((data, i) => {
      const group = new THREE.Group();
      
      // Card mesh (hidden - kept for structure/animation compatibility)
      const cardGeometry = new THREE.PlaneGeometry(3, 3 * (800 / 512));
      const cardMaterial = new THREE.MeshBasicMaterial({ 
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
      cardMesh.visible = false;  // Cards are hidden, only logos shown
      group.add(cardMesh);

      // Create a container for the 3D logo
      const modelContainer = new THREE.Group();
      modelContainer.position.set(0.2, 0.2, 0.5); // Shifted slightly right to center on card
      modelContainer.name = "logo";
      group.add(modelContainer);

      // Create fallback model (shown while GLB loads)
      const fallbackModel = createFallbackModel(data.color);
      modelContainer.add(fallbackModel);

      scene.add(group);
      
      const cardData = {
        group,
        cardMesh,
        model: modelContainer,
        fallbackModel,
        baseAngle: (i / CARDS_DATA.length) * Math.PI * 2,
        data,
        globalXOffset
      };
      
      cardGroups.push(cardData);

      // Load GLB model asynchronously
      if (data.modelPath) {
        gltfLoader.load(
          data.modelPath,
          (gltf) => {
            const loadedModel = gltf.scene;
            
            // Auto-scale the model to fit nicely
            const box = new THREE.Box3().setFromObject(loadedModel);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.0 / maxDim; // Scale to roughly 2 units
            loadedModel.scale.setScalar(scale);
            
            // Center the model
            const center = box.getCenter(new THREE.Vector3());
            loadedModel.position.sub(center.multiplyScalar(scale));
            
            // Remove fallback and add loaded model
            modelContainer.remove(fallbackModel);
            modelContainer.add(loadedModel);
            
            // Store reference to the loaded model for material manipulation
            cardData.loadedModel = loadedModel;
          },
          undefined,
          (error) => {
            console.warn(`Failed to load model ${data.modelPath}:`, error);
            // Keep fallback model on error
          }
        );
      }
    });

    three.cardGroups = cardGroups;

    // Entrance animation state
    const entranceDuration = 1.2; // seconds
    const startTime = performance.now();
    
    // Easing function for smooth entrance (ease-out cubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Animation loop
    let lastActiveIndex = 0;
    let currentIsMobile = isMobile;
    
    const animate = () => {
      three.animationFrame = requestAnimationFrame(animate);

      // Calculate entrance animation elapsed time
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth rotation interpolation
      three.rotationAngle += (three.targetRotationAngle - three.rotationAngle) * 0.08;

      let maxZ = -Infinity;
      let newActiveIndex = 0;
      
      // First pass: position cards and determine active card
      cardGroups.forEach((item, index) => {
        const angle = item.baseAngle + three.rotationAngle;
        
        // Stagger the entrance animation for each card
        const cardDelay = index * 0.15;
        const cardProgress = Math.max(0, Math.min(1, (elapsed - cardDelay) / (entranceDuration * 0.8)));
        const cardEasedProgress = easeOutCubic(cardProgress);
        
        const cardEntranceY = (1 - cardEasedProgress) * -6;
        const cardEntranceSpin = (1 - cardEasedProgress) * Math.PI * 1.5;
        const cardEntranceScale = 0.2 + (cardEasedProgress * 0.8);
        
        if (currentIsMobile) {
          // MOBILE: Show only 3D logos (no cards), sliding in from left/right
          // Normalize angle to get position relative to front (-PI to PI)
          let normalizedAngle = angle % (Math.PI * 2);
          if (normalizedAngle > Math.PI) normalizedAngle -= Math.PI * 2;
          if (normalizedAngle < -Math.PI) normalizedAngle += Math.PI * 2;
          
          // Position logos horizontally based on their angle from front
          const slideDistance = 8; // How far off-screen logos go
          item.group.position.x = normalizedAngle * slideDistance / Math.PI;
          item.group.position.z = Math.abs(normalizedAngle) < 0.5 ? 0 : -2;
          item.group.position.y = cardEntranceY;
          
          // Hide the card mesh on mobile - only show the 3D logo
          item.cardMesh.visible = false;
          
          // Scale the group for entrance animation
          const distanceFromCenter = Math.abs(normalizedAngle) / Math.PI; // 0 to 1
          const mobileScale = 0.8 * (1 - distanceFromCenter * 0.3);
          const scale = cardEntranceScale * mobileScale;
          item.group.scale.set(scale, scale, scale);
          
          // Determine active card (closest to center angle)
          if (index === 0) maxZ = Math.abs(normalizedAngle);
          if (Math.abs(normalizedAngle) <= maxZ) {
            maxZ = Math.abs(normalizedAngle);
            newActiveIndex = index;
          }
          
          // Model (3D logo) scale and opacity based on distance from center
          const logoOpacity = Math.max(0, 1 - distanceFromCenter * 1.5);
          const modelScale = 1.5 + ((1 - distanceFromCenter) * 0.5); // Larger logos on mobile
          item.model.scale.setScalar(modelScale * cardEasedProgress);
          
          // Center the logo (remove the offset that was for card positioning)
          item.model.position.set(0, 0, 0.5);
          
          // Fade out non-active logos
          if (item.loadedModel) {
            item.loadedModel.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = logoOpacity * cardEasedProgress;
              }
            });
          }
          if (item.fallbackModel && item.fallbackModel.material) {
            item.fallbackModel.material.opacity = logoOpacity * cardEasedProgress;
          }
        } else {
          // DESKTOP: Circular carousel layout with logos only (no cards)
          const carouselRadiusX = 3.5;
          const carouselRadiusZ = 3;
          
          // Position in a circular carousel
          item.group.position.x = item.globalXOffset + Math.cos(angle) * carouselRadiusX;
          item.group.position.z = Math.sin(angle) * carouselRadiusZ;
          item.group.position.y = cardEntranceY;
          
          // Hide the card mesh - only show 3D logos
          item.cardMesh.visible = false;
          
          // Determine active card (frontmost)
          if (item.group.position.z > maxZ) {
            maxZ = item.group.position.z;
            newActiveIndex = index;
          }

          const z = item.group.position.z;
          const baseScale = 1 + (z * 0.05);
          const scale = baseScale * cardEntranceScale;
          item.group.scale.set(scale, scale, scale);
          
          // Opacity fade for depth effect
          const normalizedZ = (z + carouselRadiusZ) / (carouselRadiusZ * 2);
          const logoOpacity = Math.max(0.15, Math.pow(normalizedZ, 2));
          
          // Scale up logos since we're not showing cards
          const modelScale = 1.5 + (normalizedZ * 0.5);
          item.model.scale.setScalar(modelScale);
          
          // Center the logo
          item.model.position.set(0, 0, 0.5);
          
          // Apply opacity to loaded models
          if (item.loadedModel) {
            item.loadedModel.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = logoOpacity * cardEasedProgress;
              }
            });
          }
          if (item.fallbackModel && item.fallbackModel.material) {
            item.fallbackModel.material.opacity = logoOpacity * cardEasedProgress;
          }
        }
        
        // Apply entrance rotation to the card mesh
        item.cardMesh.rotation.y = cardEntranceSpin;
      });

      // Second pass: spin background cards (now that we know which is active)
      cardGroups.forEach((item, index) => {
        if (index !== newActiveIndex) {
          item.model.rotation.x += 0.008;
          item.model.rotation.y += 0.012;
        }
      });

      // Update React state only when active index changes
      if (newActiveIndex !== lastActiveIndex) {
        lastActiveIndex = newActiveIndex;
        three.activeIndex = newActiveIndex;
        setActiveIndex(newActiveIndex);
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 300);
      }

      // Active card: mouse follow with damping (Super Mario Galaxy style)
      const activeCard = cardGroups[newActiveIndex];
      if (activeCard) {
        three.raycaster.setFromCamera(three.mouse, camera);
        const targetZ = activeCard.group.position.z + 0.5;
        
        const t = (targetZ - three.raycaster.ray.origin.z) / three.raycaster.ray.direction.z;
        const targetPoint = new THREE.Vector3()
          .copy(three.raycaster.ray.origin)
          .add(three.raycaster.ray.direction.clone().multiplyScalar(t));
        
        // Calculate target rotation using dummy object
        three.dummy.position.copy(activeCard.model.getWorldPosition(new THREE.Vector3()));
        three.dummy.lookAt(targetPoint);
        
        // Smooth slerp (damping effect like Super Mario Galaxy planets)
        activeCard.model.quaternion.slerp(three.dummy.quaternion, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Event handlers
    const handleMouseMove = (e) => {
      three.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      three.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (three.isDragging) {
        const deltaX = e.clientX - three.startX;
        const rotationDelta = (deltaX / window.innerWidth) * (Math.PI * 2);
        three.targetRotationAngle = three.startRotation - rotationDelta; // Inverted for natural feel
      }
    };

    const handleMouseDown = (e) => {
      // Only start dragging if clicking on left half of screen
      if (e.clientX < window.innerWidth * 0.6) {
        three.isDragging = true;
        three.startX = e.clientX;
        three.startRotation = three.targetRotationAngle;
      }
    };

    const handleMouseUp = () => {
      if (!three.isDragging) return;
      three.isDragging = false;
      // Snap to nearest card
      const snapIndex = Math.round(three.targetRotationAngle / stepAngle);
      three.targetRotationAngle = snapIndex * stepAngle;
    };

    const handleTouchStart = (e) => {
      // On mobile, allow dragging from anywhere in the carousel area (top 42%)
      const touchY = e.touches[0].clientY;
      const isMobileView = window.innerWidth < 1024;
      const isInCarouselArea = isMobileView 
        ? touchY < window.innerHeight * 0.42  // Top 42% on mobile (carousel zone)
        : e.touches[0].clientX < window.innerWidth * 0.6;  // Left side on desktop
      
      if (isInCarouselArea) {
        three.isDragging = true;
        three.startX = e.touches[0].clientX;
        three.startRotation = three.targetRotationAngle;
      }
    };

    const handleTouchMove = (e) => {
      three.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      three.mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;

      if (three.isDragging) {
        const deltaX = e.touches[0].clientX - three.startX;
        const rotationDelta = (deltaX / window.innerWidth) * (Math.PI * 2);
        three.targetRotationAngle = three.startRotation - rotationDelta; // Inverted for natural feel
      }
    };

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      currentIsMobile = newIsMobile;  // Update for animation loop
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.y = newIsMobile ? -2.2 : 0;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update card positions on resize
      const newGlobalXOffset = newIsMobile ? 0 : -2.5;
      cardGroups.forEach(item => {
        item.globalXOffset = newGlobalXOffset;
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      if (three.animationFrame) {
        cancelAnimationFrame(three.animationFrame);
      }
      
      if (renderer && container) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []); // Empty dependency array - only run once

  // Navigation handlers
  const handlePrev = () => {
    threeRef.current.targetRotationAngle += stepAngle;
  };

  const handleNext = () => {
    threeRef.current.targetRotationAngle -= stepAngle;
  };

  const activeData = CARDS_DATA[activeIndex];

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden font-mono">
      {/* Three.js Canvas Container - visible on all screen sizes */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-[1]"
        style={{ cursor: 'grab' }}
      />

      {/* Top Header - Full Width */}
      <header className="absolute top-0 left-0 right-0 z-20 flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 gap-y-3 pointer-events-auto">
        {/* Name/Logo - links to home (far left) */}
        <Link 
          to="/" 
          className="text-lg sm:text-xl font-bold text-white hover:text-[#E8B4A0] transition-colors animate-slide-right"
          style={{ opacity: 0, animationDelay: '0.1s' }}
        >
          Taz <span className="text-[#E8B4A0]">Siriwardena</span>
        </Link>

        {/* Page Title (center) - positioned relative to viewport, hidden on very small screens */}
        <h1 
          className="hidden sm:block fixed top-4 sm:top-6 left-0 right-0 text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight animate-slide-up pointer-events-none px-36 md:px-44 lg:px-52"
          style={{ opacity: 0, animationDelay: '0.15s' }}
        >
          Experience<span className="text-[#A855F7]">.</span>
        </h1>
        
        {/* Nav Buttons (far right) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/" 
            className="hidden lg:block text-[#E8B4A0] hover:text-white transition-colors text-sm animate-fade-in"
            style={{ opacity: 0, animationDelay: '0.2s' }}
          >
            ← Back to Home
          </Link>
          <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.25s' }}>
            <NavButton icon={Terminal} label="Projects" to="/projects" color="teal" />
          </div>
          <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.3s' }}>
            <NavButton icon={FileText} label="Experience" to="/experience" color="purple" active />
          </div>
        </div>
      </header>

      {/* Mobile Page Title - shown only on very small screens */}
      <div className="sm:hidden absolute top-20 left-0 right-0 z-20 text-center pointer-events-none">
        <h1 
          className="text-2xl font-bold text-white tracking-tight animate-slide-up"
          style={{ opacity: 0, animationDelay: '0.15s' }}
        >
          Experience<span className="text-[#A855F7]">.</span>
        </h1>
      </div>

      {/* UI Layer - Responsive layout */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 min-h-screen min-h-[100dvh] pointer-events-none">
        
        {/* Left Side / Top on Mobile: Carousel Zone - transparent to show Three.js */}
        <div className="flex-shrink-0 h-[42vh] lg:h-auto lg:flex-1" />

        {/* Right Side / Bottom on Mobile: Information Panel */}
        <div className="flex-1 lg:flex-none flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 pt-2 lg:pt-24 bg-gradient-to-t lg:bg-gradient-to-l from-[#1E1E1E] via-[#1E1E1E] to-[#1E1E1E]/70 lg:from-[#1E1E1E]/95 lg:via-[#1E1E1E]/70 lg:to-transparent backdrop-blur-sm pointer-events-auto overflow-y-auto">

          {/* Main Content */}
          <div 
            className="flex-grow flex flex-col justify-start lg:justify-center items-center lg:items-start max-w-lg mx-auto lg:mx-0 animate-slide-up"
            style={{ opacity: 0, animationDelay: '0.35s' }}
          >
            <div className="mb-1 sm:mb-3">
              <span className="text-[#E8B4A0]/60 uppercase tracking-widest text-[10px] sm:text-xs font-semibold">
                Selected Role
              </span>
            </div>
            
            <h2 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight transition-all duration-300 text-center lg:text-left ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {activeData.role}
            </h2>

            <div className="mb-2 sm:mb-4 flex items-center flex-wrap justify-center lg:justify-start gap-x-2 gap-y-1">
              <span 
                className="text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300"
                style={{ color: activeData.color }}
              >
                {activeData.title}
              </span>
              <span className="text-white/50">•</span>
              <span className="text-white/60 text-[10px] sm:text-xs lg:text-sm">{activeData.date}</span>
              {activeData.url && (
                <a 
                  href={activeData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-white/50 hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center -m-1"
                  title={`Visit ${activeData.title}`}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
            
            <div 
              className="h-1 w-12 sm:w-16 lg:w-20 rounded-full mb-3 sm:mb-6 transition-all duration-500 mx-auto lg:mx-0"
              style={{ backgroundColor: activeData.color }}
            />

            <p 
              className={`text-xs sm:text-sm lg:text-base xl:text-lg text-white/80 leading-relaxed transition-all duration-300 whitespace-pre-line text-center lg:text-left ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {activeData.desc}
            </p>
          </div>

          {/* Footer Controls - Centered on mobile, left-aligned on desktop */}
          <footer className="flex justify-center lg:justify-start items-center gap-4 sm:gap-6 mt-4 lg:mt-0 pb-4 lg:pb-0 animate-slide-up" style={{ opacity: 0, animationDelay: '0.4s' }}>
            <button 
              onClick={handlePrev}
              className="rounded-full p-3 sm:p-4 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all group border border-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 group-active:-translate-x-1 transition-transform" />
            </button>
            <div className="text-white/40 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
              <span className="hidden lg:inline">Drag or Click</span>
              <span className="lg:hidden">Swipe or Tap</span>
            </div>
            <button 
              onClick={handleNext}
              className="rounded-full p-3 sm:p-4 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all group border border-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

