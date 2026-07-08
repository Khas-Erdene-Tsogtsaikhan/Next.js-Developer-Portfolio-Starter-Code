import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'

export default function Counter({ value, prefix = '', suffix = '', label, signal }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(reduceMotion ? value : 0)
  const spring = useSpring(count, { stiffness: 70, damping: 26, mass: 0.8 })
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString('en-US'))

  useEffect(() => {
    if (inView) count.set(value)
  }, [count, inView, value])

  return (
    <div
      ref={ref}
      className={styles.metric}
      aria-label={`${prefix}${value.toLocaleString('en-US')}${suffix} ${label}. ${signal}`}
    >
      <span className={styles.metricValue} aria-hidden="true">
        {prefix ? <span className={styles.aff}>{prefix}</span> : null}
        <motion.span>{display}</motion.span>
        {suffix ? <span className={styles.aff}>{suffix}</span> : null}
      </span>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricSignal}>{signal}</span>
    </div>
  )
}
