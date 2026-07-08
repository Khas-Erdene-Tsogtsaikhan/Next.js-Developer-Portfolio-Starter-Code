import { motion, useReducedMotion } from 'framer-motion'
import styles from '@/styles/StudioPortfolio.module.css'

export default function AnimatedSection({ children, className = '', id }) {
  const reduceMotion = useReducedMotion()
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      <motion.div className={styles.sectionLine} initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className={styles.sectionScene} initial={reduceMotion ? false : { opacity: 0, y: 32, filter: 'blur(8px)' }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { transform: 'none' } }} viewport={{ once: true, amount: .08 }} transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </section>
  )
}
