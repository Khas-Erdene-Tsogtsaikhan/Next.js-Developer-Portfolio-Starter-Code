import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

export default function AnimatedMetric({ label, prefix = '', signal, suffix = '', value }) {
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
      aria-label={`${prefix}${value.toLocaleString('en-US')}${suffix} ${label}. ${signal}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <strong aria-hidden="true">{prefix}<motion.span>{display}</motion.span>{suffix}</strong>
        <span>{label}</span>
        <small><i /> {signal}</small>
      </div>
      <svg viewBox="0 0 120 36" aria-hidden="true">
        <motion.path d="M2 29 C15 28 18 22 30 24 S48 30 58 18 78 23 88 12 103 15 118 5" initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: .8 }} transition={{ duration: 1.1, delay: .18, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
    </motion.div>
  )
}
