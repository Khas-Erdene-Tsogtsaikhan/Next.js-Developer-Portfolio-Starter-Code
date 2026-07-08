import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'

/*
 * Premium animated backdrop for the warm-paper editorial theme:
 *  - slow-drifting warm aurora blobs (transform/opacity only)
 *  - a faint blueprint grid revealed by a cursor-following spotlight mask
 *  - paper grain + corner vignettes
 * Everything is GPU-cheap and fully disabled under prefers-reduced-motion.
 */
export default function CinematicBackground() {
  const ref = useRef(null)
  const frame = useRef(0)
  const reduceMotion = useReducedMotion()

  // Scroll-reactive parallax — the environment drifts as you scroll.
  const { scrollYProgress } = useScroll()
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 26, mass: 0.4 })
  const auroraY = useTransform(sp, [0, 1], ['0%', '-22%'])
  const auroraScale = useTransform(sp, [0, 1], [1, 1.25])
  const auroraRotate = useTransform(sp, [0, 1], [0, 12])
  const gridY = useTransform(sp, [0, 1], ['0%', '9%'])
  const hue = useTransform(sp, [0, 0.5, 1], [0.62, 0.5, 0.68])

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    const move = (e) => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`)
        el.style.setProperty('--my', `${e.clientY}px`)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [reduceMotion])

  const blob = (extra, anim) =>
    reduceMotion ? { className: `${styles.blob} ${extra}` } : {
      className: `${styles.blob} ${extra}`,
      animate: anim.animate,
      transition: anim.transition,
    }

  return (
    <div className={styles.bg} ref={ref} aria-hidden="true">
      <motion.div
        className={styles.bgAurora}
        style={reduceMotion ? undefined : { y: auroraY, scale: auroraScale, rotate: auroraRotate, opacity: hue }}
      >
        <motion.span {...blob(styles.blobA, {
          animate: { x: [0, 60, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.95, 1] },
          transition: { duration: 26, repeat: Infinity, ease: 'easeInOut' },
        })} />
        <motion.span {...blob(styles.blobB, {
          animate: { x: [0, -50, 40, 0], y: [0, 30, -35, 0], scale: [1, 0.9, 1.2, 1] },
          transition: { duration: 32, repeat: Infinity, ease: 'easeInOut' },
        })} />
        <motion.span {...blob(styles.blobC, {
          animate: { x: [0, 40, -45, 0], y: [0, 45, 20, 0], scale: [1, 1.1, 0.9, 1] },
          transition: { duration: 38, repeat: Infinity, ease: 'easeInOut' },
        })} />
      </motion.div>
      <motion.div className={styles.bgGrid} style={reduceMotion ? undefined : { y: gridY }} />
      {!reduceMotion ? <div className={styles.bgSpot} /> : null}
      <div className={styles.bgGrain} />
      <div className={styles.bgVignette} />
    </div>
  )
}
