"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type ConfiguratorFinish = "lustre" | "ponceMat";

type KitchenViewerProps = {
  textureUrl: string;
  finish: ConfiguratorFinish;
  loadingLabel: string;
  unavailableLabel: string;
  referenceImage: string;
  referenceAlt: string;
};

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Procedural 3D kitchen modelled on the reference photo: light oak wall
 * run with cooktop and oven tower, a central island with a waterfall
 * countertop, stools, pendant lights and a dining table by the window.
 * The marble texture is applied to the island top and sides and to the
 * wall countertop, and is swapped live from the parent component.
 */
export default function KitchenViewer({
  textureUrl,
  finish,
  loadingLabel,
  unavailableLabel,
  referenceImage,
  referenceAlt,
}: KitchenViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const marbleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const loadSeqRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [supported] = useState(webglSupported);

  useEffect(() => {
    if (!supported) return;
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xece7de);

    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      60,
    );
    // Viewpoint close to the reference photo: front-right, above the island.
    camera.position.set(2.7, 2.05, 3.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.1, 0.8, -0.3);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 8.5;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = 1.48;

    // Soft studio reflections for the polished stone, generated locally
    // (no external HDR download).
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8a7a66, 0.6));

    const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
    sun.position.set(3.2, 4.6, 2.8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -5;
    sun.shadow.camera.right = 5;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -5;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 14;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const disposables: Array<{ dispose(): void }> = [envTexture];

    const std = (
      color: number,
      roughness: number,
      extra: Partial<THREE.MeshStandardMaterialParameters> = {},
    ) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness,
        ...extra,
      });
      disposables.push(material);
      return material;
    };

    const oak = std(0xdfc4a0, 0.65);
    const oakDark = std(0xa08055, 0.6);
    const wallMat = std(0xf5f2ec, 0.95);
    const floorMat = std(0xdcc7a8, 0.7);
    const steel = std(0xb8bcc0, 0.35, { metalness: 0.9 });
    const blackMetal = std(0x1a1a1a, 0.5, { metalness: 0.6 });
    const darkGlass = std(0x17181a, 0.15, { metalness: 0.4 });
    const seatMat = std(0x26221f, 0.6);

    const marble = new THREE.MeshStandardMaterial({
      color: 0xf2efe9,
      roughness: 0.08,
      metalness: 0,
      envMapIntensity: 1,
    });
    disposables.push(marble);
    marbleMaterialRef.current = marble;

    const box = (
      w: number,
      h: number,
      d: number,
      material: THREE.Material,
      x: number,
      y: number,
      z: number,
      castShadow = true,
    ) => {
      const geometry = new THREE.BoxGeometry(w, h, d);
      disposables.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    const cylinder = (
      rTop: number,
      rBottom: number,
      h: number,
      material: THREE.Material,
      x: number,
      y: number,
      z: number,
    ) => {
      const geometry = new THREE.CylinderGeometry(rTop, rBottom, h, 20);
      disposables.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    // --- Room shell (dollhouse style: back + left walls, open front) ---
    box(7.4, 0.1, 6.4, floorMat, 0, -0.05, 0, false);
    // Back wall segments around the window opening (x 0.6..3.4, y 0.9..2.6).
    box(4.3, 3.1, 0.1, wallMat, -1.55, 1.55, -3.15, false);
    box(0.3, 3.1, 0.1, wallMat, 3.55, 1.55, -3.15, false);
    box(2.8, 0.9, 0.1, wallMat, 2.0, 0.45, -3.15, false);
    box(2.8, 0.5, 0.1, wallMat, 2.0, 2.85, -3.15, false);
    box(0.1, 3.1, 6.4, wallMat, -3.65, 1.55, 0, false);

    // Window: frame, glass and a flat garden backdrop behind it.
    const frameMat = std(0x3a332c, 0.6);
    box(2.92, 0.07, 0.08, frameMat, 2.0, 0.9, -3.1, false);
    box(2.92, 0.07, 0.08, frameMat, 2.0, 2.6, -3.1, false);
    box(0.07, 1.77, 0.08, frameMat, 0.6, 1.75, -3.1, false);
    box(0.07, 1.77, 0.08, frameMat, 3.4, 1.75, -3.1, false);
    box(0.05, 1.7, 0.06, frameMat, 2.0, 1.75, -3.1, false);
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.7),
      new THREE.MeshStandardMaterial({
        color: 0xdfeef2,
        roughness: 0.05,
        transparent: true,
        opacity: 0.3,
      }),
    );
    glass.position.set(2.0, 1.75, -3.13);
    scene.add(glass);
    disposables.push(glass.geometry, glass.material as THREE.Material);

    const backdrop = (
      w: number,
      h: number,
      color: number,
      x: number,
      y: number,
      z: number,
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(x, y, z);
      scene.add(mesh);
      disposables.push(mesh.geometry, mesh.material as THREE.Material);
    };
    backdrop(4.4, 1.5, 0xcfe4ec, 2.0, 2.35, -3.6);
    backdrop(4.4, 1.4, 0x9fbf87, 2.0, 0.7, -3.6);
    const shrub = (x: number, y: number, s: number, color: number) => {
      const geometry = new THREE.SphereGeometry(0.5, 16, 12);
      disposables.push(geometry);
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.scale.set(s, s * 0.7, 0.25);
      mesh.position.set(x, y, -3.45);
      scene.add(mesh);
    };
    shrub(1.0, 0.55, 0.7, 0x6f9a5e);
    shrub(2.1, 0.45, 0.9, 0x7fae6a);
    shrub(3.1, 0.6, 0.6, 0x649254);

    // --- Left wall run: base cabinets, countertop, wall cabinets ---
    box(0.62, 0.86, 3.0, oak, -3.34, 0.43, -1.0);
    box(0.58, 0.08, 2.96, std(0x8a6f52, 0.8), -3.34, 0.04, -1.0);
    for (let i = 0; i < 4; i += 1) {
      box(0.005, 0.7, 0.015, std(0x9a7c5c, 0.7), -3.02, 0.45, -2.2 + i * 0.75, false);
      box(0.03, 0.02, 0.28, blackMetal, -3.0, 0.78, -2.2 + i * 0.75, false);
    }
    // Marble wall countertop.
    box(0.68, 0.05, 3.1, marble, -3.33, 0.885, -1.0);
    box(0.36, 0.8, 1.7, oak, -3.47, 2.35, -1.65);
    box(0.3, 0.02, 1.6, new THREE.MeshBasicMaterial({ color: 0xffe6b8 }), -3.3, 1.94, -1.65, false);

    // Cooktop + hood.
    box(0.56, 0.015, 0.6, darkGlass, -3.33, 0.915, -1.5);
    for (const dz of [-0.18, 0.18]) {
      for (const dx of [-0.14, 0.14]) {
        cylinder(0.07, 0.07, 0.012, blackMetal, -3.33 + dx, 0.925, -1.5 + dz);
      }
    }
    box(0.6, 0.06, 0.7, steel, -3.5, 2.1, -1.5);
    box(0.4, 0.9, 0.4, steel, -3.5, 2.58, -1.5);

    // Oven tower at the back end of the run.
    box(0.66, 2.1, 0.66, oak, -3.34, 1.05, -2.85);
    for (const y of [1.15, 1.75]) {
      box(0.02, 0.5, 0.55, darkGlass, -3.0, y, -2.85);
      box(0.04, 0.03, 0.5, steel, -2.98, y + 0.22, -2.85, false);
    }

    // --- Central island with waterfall countertop ---
    box(2.5, 0.84, 1.05, oak, 0.25, 0.42, 0.15);
    for (let i = 0; i < 3; i += 1) {
      box(0.015, 0.7, 0.005, std(0x9a7c5c, 0.7), -0.55 + i * 0.8, 0.42, 0.68, false);
    }
    box(2.7, 0.06, 1.25, marble, 0.25, 0.87, 0.15);
    box(0.06, 0.9, 1.25, marble, -1.07, 0.45, 0.15);
    box(0.06, 0.9, 1.25, marble, 1.57, 0.45, 0.15);

    // Undermount sink + black gooseneck faucet.
    box(0.6, 0.02, 0.42, darkGlass, -0.15, 0.892, 0.15);
    cylinder(0.02, 0.025, 0.32, blackMetal, -0.15, 1.06, -0.12);
    cylinder(0.018, 0.018, 0.24, blackMetal, -0.15, 1.21, 0.0).rotation.x =
      Math.PI / 2;
    cylinder(0.016, 0.016, 0.1, blackMetal, -0.15, 1.16, 0.11);

    // Fruit bowl, like the reference photo.
    const bowlGeometry = new THREE.SphereGeometry(0.16, 24, 12);
    disposables.push(bowlGeometry);
    const bowl = new THREE.Mesh(bowlGeometry, oakDark);
    bowl.scale.set(1, 0.45, 1);
    bowl.position.set(0.7, 0.92, 0.35);
    bowl.castShadow = true;
    scene.add(bowl);
    const fruitColors = [0xe8912d, 0xf2c230, 0xc23b2e, 0xf2c230, 0x8fae4d];
    fruitColors.forEach((color, i) => {
      const geometry = new THREE.SphereGeometry(0.045, 12, 10);
      disposables.push(geometry);
      const fruit = new THREE.Mesh(
        geometry,
        std(color, 0.5, { metalness: 0 }),
      );
      fruit.position.set(0.62 + (i % 3) * 0.08, 0.97, 0.3 + Math.floor(i / 3) * 0.09);
      fruit.castShadow = true;
      scene.add(fruit);
    });

    // --- Stools along the island ---
    const makeStool = (x: number) => {
      box(0.42, 0.06, 0.42, seatMat, x, 0.62, 1.06);
      for (const dx of [-0.17, 0.17]) {
        for (const dz of [-0.17, 0.17]) {
          cylinder(0.015, 0.015, 0.6, blackMetal, x + dx, 0.31, 1.06 + dz);
        }
      }
      box(0.4, 0.42, 0.04, oak, x, 0.98, 1.28);
    };
    makeStool(-0.55);
    makeStool(0.25);
    makeStool(1.05);

    // --- Pendant lights over the island ---
    const pendantMat = new THREE.MeshStandardMaterial({
      color: 0xfff4dd,
      emissive: 0xffd9a0,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.92,
      roughness: 0.3,
    });
    disposables.push(pendantMat);
    for (const x of [-0.35, 0.85]) {
      cylinder(0.008, 0.008, 0.62, blackMetal, x, 2.74, 0.15);
      const globeGeometry = new THREE.SphereGeometry(0.16, 24, 18);
      disposables.push(globeGeometry);
      const globe = new THREE.Mesh(globeGeometry, pendantMat);
      globe.position.set(x, 2.27, 0.15);
      scene.add(globe);
      const glow = new THREE.PointLight(0xffd9a0, 3, 2.5, 2);
      glow.position.set(x, 2.2, 0.15);
      scene.add(glow);
    }

    // --- Dining table + chairs by the window ---
    box(1.5, 0.05, 0.95, oakDark, 2.2, 0.73, -1.9);
    for (const dx of [-0.68, 0.68]) {
      for (const dz of [-0.4, 0.4]) {
        box(0.06, 0.71, 0.06, oakDark, 2.2 + dx, 0.355, -1.9 + dz);
      }
    }
    const makeChair = (x: number, z: number, facing: number) => {
      const group = new THREE.Group();
      const seatGeometry = new THREE.BoxGeometry(0.45, 0.05, 0.45);
      const backGeometry = new THREE.BoxGeometry(0.45, 0.5, 0.05);
      const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.44, 10);
      disposables.push(seatGeometry, backGeometry, legGeometry);
      const seat = new THREE.Mesh(seatGeometry, seatMat);
      seat.position.y = 0.45;
      seat.castShadow = true;
      group.add(seat);
      const back = new THREE.Mesh(backGeometry, oakDark);
      back.position.set(0, 0.72, -0.2 * facing);
      back.castShadow = true;
      group.add(back);
      for (const dx of [-0.18, 0.18]) {
        for (const dz of [-0.18, 0.18]) {
          const leg = new THREE.Mesh(legGeometry, blackMetal);
          leg.position.set(dx, 0.22, dz);
          leg.castShadow = true;
          group.add(leg);
        }
      }
      group.position.set(x, 0, z);
      group.rotation.y = facing > 0 ? Math.PI : 0;
      scene.add(group);
    };
    makeChair(1.85, -1.25, 1);
    makeChair(2.55, -1.25, 1);
    makeChair(1.85, -2.55, -1);
    makeChair(2.55, -2.55, -1);

    // First texture load.
    const applyTexture = (url: string) => {
      const seq = ++loadSeqRef.current;
      new THREE.TextureLoader().load(
        url,
        (texture) => {
          if (seq !== loadSeqRef.current) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = 8;
          const previous = textureRef.current;
          textureRef.current = texture;
          if (marbleMaterialRef.current) {
            marbleMaterialRef.current.map = texture;
            marbleMaterialRef.current.needsUpdate = true;
          }
          previous?.dispose();
        },
        undefined,
        () => {
          // Keep the neutral stone colour if a texture fails to load.
        },
      );
    };
    applyTexture(textureUrl);

    const resize = () => {
      const width = mount.clientWidth;
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frameId = 0;
    let firstFrame = true;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      controls.dispose();
      loadSeqRef.current += 1;
      textureRef.current?.dispose();
      textureRef.current = null;
      marbleMaterialRef.current = null;
      for (const item of disposables) item.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // The scene is built once; texture and finish are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  // Live marble swap: reload the texture onto the shared stone material.
  useEffect(() => {
    const material = marbleMaterialRef.current;
    if (!material || !supported) return;
    const seq = ++loadSeqRef.current;
    new THREE.TextureLoader().load(
      textureUrl,
      (texture) => {
        if (seq !== loadSeqRef.current) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        const previous = textureRef.current;
        textureRef.current = texture;
        material.map = texture;
        material.needsUpdate = true;
        previous?.dispose();
      },
      undefined,
      () => {
        // Keep the current texture if the new one fails to load.
      },
    );
  }, [textureUrl, supported]);

  // Finish preview: polished is glossy, matte is honed.
  useEffect(() => {
    const material = marbleMaterialRef.current;
    if (!material) return;
    if (finish === "lustre") {
      material.roughness = 0.08;
      material.envMapIntensity = 1;
    } else {
      material.roughness = 0.5;
      material.envMapIntensity = 0.45;
    }
  }, [finish]);

  if (!supported || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#1c1a18] p-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={referenceImage}
          alt={referenceAlt}
          className="max-h-56 w-auto rounded-xl object-cover"
        />
        <p className="max-w-md text-sm leading-relaxed text-white/80">
          {unavailableLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full" />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#1c1a18]">
          <p className="animate-pulse text-sm text-white/80">{loadingLabel}</p>
        </div>
      ) : null}
    </div>
  );
}
