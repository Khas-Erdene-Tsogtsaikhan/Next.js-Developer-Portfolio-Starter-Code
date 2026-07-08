import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

// Tasteful cursor-attraction wrapper for primary CTAs.
// Respects reduced-motion and stays subtle so it reads premium, not gimmicky.
export default function Magnetic({ children, className, strength = 0.28 }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 })

  const handleMove = (event) => {
    if (reduceMotion || !ref.current) return
    const bounds = ref.current.getBoundingClientRect()
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength)
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduceMotion ? { display: 'inline-flex' } : { x: springX, y: springY, display: 'inline-flex' }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}
