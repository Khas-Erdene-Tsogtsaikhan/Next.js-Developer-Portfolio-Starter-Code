import { motion, useReducedMotion } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'

// Animated section divider: two rules draw outward from a small pulsing core.
export default function SectionDivider({ label }) {
  const reduceMotion = useReducedMotion()
  const line = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  }
  return (
    <motion.div
      className={styles.divider}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'show'}
      viewport={{ once: true, amount: 0.8 }}
      aria-hidden="true"
    >
      <motion.span className={styles.dividerLine} variants={line} style={{ transformOrigin: '100% 50%' }} />
      <span className={styles.dividerCore}>
        <span className={styles.dividerDot} />
        {label ? <em>{label}</em> : null}
      </span>
      <motion.span className={styles.dividerLine} variants={line} style={{ transformOrigin: '0% 50%' }} />
    </motion.div>
  )
}
