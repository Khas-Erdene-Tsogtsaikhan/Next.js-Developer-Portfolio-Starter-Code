import { motion, useReducedMotion, useTransform } from 'framer-motion'
import styles from '@/styles/StudioPortfolio.module.css'

export default function CinematicBackground({ scrollProgress }) {
  const reduceMotion = useReducedMotion()
  const gridY = useTransform(scrollProgress, [0, 1], ['0%', '-7%'])
  const lightY = useTransform(scrollProgress, [0, 1], ['0%', '12%'])
  const traceOpacity = useTransform(scrollProgress, [0, .18, .72, 1], [.13, .22, .16, .09])

  return (
    <>
      <motion.div className={styles.entryCurtain} aria-hidden="true" initial={reduceMotion ? false : { opacity: 1 }} animate={{ opacity: 0, transitionEnd: { display: 'none' } }} transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : .18, ease: [0.16, 1, 0.3, 1] }} />
      <div className={styles.environment} aria-hidden="true">
        <motion.div className={styles.environmentGrid} style={reduceMotion ? undefined : { y: gridY }} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.15, delay: .2, ease: [0.16, 1, 0.3, 1] }} />
        <motion.div className={`${styles.environmentLight} ${styles.environmentLightOne}`} style={reduceMotion ? undefined : { y: lightY }} />
        <motion.div className={`${styles.environmentLight} ${styles.environmentLightTwo}`} style={reduceMotion ? undefined : { y: gridY }} />
        <div className={styles.environmentNoise} />
        <motion.svg className={styles.environmentTrace} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={reduceMotion ? undefined : { opacity: traceOpacity }}>
          <motion.path d="M-80 640 H240 L318 562 H690 L760 492 H1510" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: .7, ease: [0.16, 1, 0.3, 1] }} />
          <motion.path d="M140 940 V760 L224 676 H540 L612 604 H1040 L1122 522 H1510" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, delay: .9, ease: [0.16, 1, 0.3, 1] }} />
        </motion.svg>
        <div className={styles.environmentVignette} />
      </div>
    </>
  )
}
