import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

export default function AnimatedMetric({ label, prefix = '', suffix = '', value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.65 })
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(reduceMotion ? value : 0)
  const spring = useSpring(count, { stiffness: 72, damping: 24, mass: 0.7 })
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString('en-US'))

  useEffect(() => {
    if (inView) count.set(value)
  }, [count, inView, value])

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <strong>{prefix}<motion.span>{display}</motion.span>{suffix}</strong>
      <span>{label}</span>
    </motion.div>
  )
}
