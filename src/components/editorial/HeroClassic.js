import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'
import { Reveal, StaggerGroup, riseItem } from './Reveal'
import Magnetic from '@/components/ai/Magnetic'
import { ArrowDown, FileText } from './icons'

// Hero A — asymmetric editorial layout with a glass "signal" status panel.
export default function HeroClassic({ data }) {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroFade = useTransform(heroScroll, [0, 1], [1, 0.35])
  const heroLift = useTransform(heroScroll, [0, 1], [0, 60])

  return (
    <section className={styles.hero} id="home" ref={heroRef}>
      <motion.div className={styles.heroTop} style={reduceMotion ? undefined : { opacity: heroFade }}>
        <Reveal className={`${styles.heroAvail} ${styles.availShine}`} delay={0.05} y={0}>
          <span className={styles.pulse} /> Open to AI systems, LLMOps &amp; founding-engineer roles
        </Reveal>
        <Reveal className={styles.heroName} delay={0.1} y={0}>
          {data.name}
        </Reveal>
      </motion.div>

      <motion.div style={reduceMotion ? undefined : { y: heroLift, opacity: heroFade }}>
        <StaggerGroup>
          <h1 className={styles.heroHeadline}>
            <span className={styles.line}><motion.span variants={riseItem} style={{ display: 'inline-block' }}>AI products.</motion.span></span>
            <span className={styles.line}>
              <motion.span variants={riseItem} style={{ display: 'inline-block' }}>
                Built. <em className={styles.mark}>Scaled.</em>
              </motion.span>
            </span>
          </h1>
        </StaggerGroup>

        <div className={styles.heroLower}>
          <Reveal delay={0.15}>
            <p className={styles.heroIntro}>
              I build <strong>production AI products</strong> and the infrastructure that makes them
              reliable — from multimodal apps and recommendation agents to <strong>evaluation gates</strong>{' '}
              for high-stakes LLM systems.
            </p>
            <div className={styles.heroActions}>
              <Magnetic strength={0.22}>
                <a className={`${styles.btn} ${styles.btnPrimary}`} href="#work">Selected work <ArrowDown /></a>
              </Magnetic>
              <Magnetic strength={0.22}>
                <a className={`${styles.btn} ${styles.btnGhost}`} href="#contact"><FileText /> Get in touch</a>
              </Magnetic>
            </div>
            <div className={styles.heroTags}>
              {['PrimitiveBench co-founder', '3× hackathon wins', '2,500+ product users'].map((t) => (
                <span className={styles.tag} key={t}>{t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className={`${styles.heroMeta} ${styles.glass} ${styles.heroStatus}`}>
              <div className={styles.heroStatusRow}>
                <span>Signal</span>
                <div className={styles.heroStatusBars} aria-hidden="true">
                  {[0.5, 0.85, 0.35, 1, 0.6, 0.9, 0.45, 0.75].map((h, i) => (
                    <motion.i
                      key={i}
                      initial={reduceMotion ? false : { scaleY: 0.2 }}
                      animate={reduceMotion ? undefined : { scaleY: [0.25, h, 0.4, h * 0.8, 0.3] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
                      style={{ height: '100%' }}
                    />
                  ))}
                </div>
              </div>
              <div><span>Role</span><span>Technical founder · AI systems</span></div>
              <div><span>Based</span><span>Berkeley, California</span></div>
              <div><span>Studying</span><span>UC Berkeley EECS · {data.graduation}</span></div>
              <div><span>Now</span><span>PrimitiveBench &amp; NutrioMN</span></div>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}
