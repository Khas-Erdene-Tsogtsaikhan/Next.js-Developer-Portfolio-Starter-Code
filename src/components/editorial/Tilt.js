import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/*
 * 3D pointer tilt — adapted from 21st.dev "Animated Feature Spotlight 3D" (ruixenui).
 * Springy rotateX/rotateY with a layered glare highlight. Disabled under reduced motion.
 */
export default function Tilt({ children, className = '', max = 8, glare = true, style }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const glareX = useTransform(sx, [-0.5, 0.5], ['20%', '80%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['20%', '80%'])
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 55%)`
  )

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (reduceMotion) {
    return <div className={className} style={style}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, perspective: 1000 }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}>
        {children}
        {glare ? (
          <motion.span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
              background: glareBg,
            }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  )
}
