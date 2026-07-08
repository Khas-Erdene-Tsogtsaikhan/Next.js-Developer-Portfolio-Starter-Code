import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'
import { Reveal, StaggerGroup, riseItem } from './Reveal'
import Magnetic from '@/components/ai/Magnetic'
import { ArrowDown, ArrowUpRight } from './icons'

const rotating = ['PrimitiveBench', 'NutrioMN', 'agent evals', 'RAG pipelines']
const badges = [
  { v: '2,500+', l: 'users' },
  { v: '$5K', l: 'MRR' },
  { v: '100+', l: 'GitHub stars' },
  { v: '40k+', l: 'students' },
]

// Hero B — centered, cinematic "poster" layout with a rotating focus line
// and a row of animated metric badges. Reconstructed from the 21st AI brief.
export default function HeroAlt({ data }) {
  const reduceMotion = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setI((v) => (v + 1) % rotating.length), 2200)
    return () => clearInterval(id)
  }, [reduceMotion])

  return (
    <section className={styles.heroAlt} id="home">
      <StaggerGroup className={styles.heroAltInner} amount={0.1}>
        <motion.div className={`${styles.heroAltAvail} ${styles.glass} ${styles.availShine}`} variants={riseItem}>
          <span className={styles.pulse} /> Open to AI systems, LLMOps &amp; founding-engineer roles
        </motion.div>

        <motion.p className={styles.heroAltKicker} variants={riseItem}>
          {data.name} · AI Systems Engineer
        </motion.p>

        <motion.h1 className={styles.heroAltHeadline} variants={riseItem}>
          AI products.<br />Built. <em className={styles.mark}>Scaled.</em>
        </motion.h1>

        <motion.div className={styles.heroAltRotate} variants={riseItem}>
          <span>Currently building</span>
          <span className={styles.heroAltRotateWord} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.b
                key={rotating[i]}
                initial={reduceMotion ? false : { y: '0.7em', opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={reduceMotion ? undefined : { y: '-0.7em', opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {rotating[i]}
              </motion.b>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p className={styles.heroAltIntro} variants={riseItem}>
          Production AI products and the infrastructure that makes them reliable — multimodal apps,
          recommendation agents, and evaluation gates for high-stakes LLM systems.
        </motion.p>

        <motion.div className={styles.heroAltActions} variants={riseItem}>
          <Magnetic strength={0.22}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="#work">Selected work <ArrowDown /></a>
          </Magnetic>
          <Magnetic strength={0.22}>
            <a className={`${styles.btn} ${styles.btnGhost}`} href={`mailto:${data.email}`}>Get in touch <ArrowUpRight /></a>
          </Magnetic>
        </motion.div>

        <motion.div className={styles.heroAltBadges} variants={riseItem}>
          {badges.map((b) => (
            <div className={`${styles.heroAltBadge} ${styles.glass}`} key={b.l}>
              <b>{b.v}</b>
              <span>{b.l}</span>
            </div>
          ))}
        </motion.div>
      </StaggerGroup>

      <Reveal className={styles.heroAltCue} delay={0.6} y={0}>
        <span>Scroll</span>
        <motion.i
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </Reveal>
    </section>
  )
}
