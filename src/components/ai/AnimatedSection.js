import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import styles from '@/styles/AIPortfolio.module.css'

export default function AnimatedSection({ children, className, id }) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const scanScale = useTransform(scrollYProgress, [0.05, 0.45, 0.95], [0, 1, 0.25])
  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 48 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <motion.div className={styles.sectionScan} style={reduceMotion ? undefined : { scaleX: scanScale }} aria-hidden="true" />
      {children}
    </motion.section>
  )
}
