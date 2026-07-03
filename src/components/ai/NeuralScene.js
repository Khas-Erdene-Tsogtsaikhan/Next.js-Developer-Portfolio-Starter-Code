import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function NeuralScene() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, 5.6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const coreGeometry = new THREE.IcosahedronGeometry(1.12, 5)
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4e7cff,
      emissive: 0x102a73,
      emissiveIntensity: 1.8,
      metalness: 0.55,
      roughness: 0.18,
      transmission: 0.2,
      transparent: true,
      opacity: 0.94,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    group.add(core)

    const cage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.37, 2),
      new THREE.MeshBasicMaterial({ color: 0x77e8ff, wireframe: true, transparent: true, opacity: 0.22 })
    )
    group.add(cage)

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x9f7cff, transparent: true, opacity: 0.42 })
    const rings = [1.68, 2.05, 2.42].map((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 180), ringMaterial.clone())
      ring.rotation.x = Math.PI * (0.2 + index * 0.18)
      ring.rotation.y = Math.PI * (0.1 + index * 0.24)
      group.add(ring)
      return ring
    })

    const nodeGeometry = new THREE.SphereGeometry(0.045, 10, 10)
    const nodes = []
    for (let index = 0; index < 22; index += 1) {
      const angle = index * 2.39996
      const y = 1 - (index / 21) * 2
      const radius = Math.sqrt(1 - y * y)
      const node = new THREE.Mesh(
        nodeGeometry,
        new THREE.MeshBasicMaterial({ color: index % 3 === 0 ? 0xc08cff : 0x62edff })
      )
      node.position.set(Math.cos(angle) * radius * 1.7, y * 1.7, Math.sin(angle) * radius * 1.7)
      group.add(node)
      nodes.push(node)
    }

    const linePositions = []
    nodes.forEach((node, index) => {
      const next = nodes[(index + 5) % nodes.length]
      linePositions.push(node.position.x, node.position.y, node.position.z, next.position.x, next.position.y, next.position.z)
    })
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x6cecff, transparent: true, opacity: 0.18 })))

    const particlePositions = new Float32Array(750 * 3)
    for (let index = 0; index < 750; index += 1) {
      const distance = 3 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      particlePositions[index * 3] = distance * Math.sin(phi) * Math.cos(theta)
      particlePositions[index * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta)
      particlePositions[index * 3 + 2] = distance * Math.cos(phi)
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x8dc8ff, size: 0.018, transparent: true, opacity: 0.55 })
    )
    scene.add(particles)

    scene.add(new THREE.AmbientLight(0x5b68ff, 1.6))
    const cyanLight = new THREE.PointLight(0x5cecff, 18, 12)
    cyanLight.position.set(3, 2, 4)
    scene.add(cyanLight)
    const violetLight = new THREE.PointLight(0xa855f7, 15, 10)
    violetLight.position.set(-3, -2, 3)
    scene.add(violetLight)

    let pointerX = 0
    let pointerY = 0
    let frame = 0
    let active = true
    const clock = new THREE.Clock()

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect()
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.9
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.7
    }
    const resize = () => {
      const width = host.clientWidth || 1
      const height = host.clientHeight || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting }, { threshold: 0.02 })
    observer.observe(host)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    host.addEventListener('pointermove', onPointerMove, { passive: true })
    resize()

    const render = () => {
      frame = requestAnimationFrame(render)
      if (!active) return
      const time = clock.getElapsedTime()
      group.rotation.y += (pointerX - group.rotation.y) * 0.035
      group.rotation.x += (-pointerY - group.rotation.x) * 0.035
      core.rotation.y = time * 0.12
      core.rotation.z = time * 0.07
      cage.rotation.y = -time * 0.09
      rings.forEach((ring, index) => { ring.rotation.z = time * (0.06 + index * 0.025) })
      particles.rotation.y = time * 0.008
      const pulse = 1 + Math.sin(time * 1.2) * 0.025
      core.scale.setScalar(pulse)
      renderer.render(scene, camera)
    }
    render()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      coreGeometry.dispose()
      coreMaterial.dispose()
      lineGeometry.dispose()
      particleGeometry.dispose()
      nodeGeometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
}
