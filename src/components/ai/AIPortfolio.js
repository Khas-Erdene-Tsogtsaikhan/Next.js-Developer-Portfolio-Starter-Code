import { useEffect, useRef } from 'react'
import Head from 'next/head'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { resumePortfolio as data } from '@/data/resumePortfolio'
import AnimatedSection from './AnimatedSection'
import ArchitectureFlow from './ArchitectureFlow'
import ProjectCard from './ProjectCard'
import SceneLoader from './SceneLoader'
import styles from '@/styles/AIPortfolio.module.css'

const Arrow = () => <span aria-hidden="true">↗</span>

export default function AIPortfolio() {
  const shellRef = useRef(null)
  const heroRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.25 })
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, 170])
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.72, 1], [1, 0.72, 0])
  const heroVisualY = useTransform(heroProgress, [0, 1], [0, -140])
  const heroVisualRotate = useTransform(heroProgress, [0, 1], [0, 12])
  const heroGridY = useTransform(heroProgress, [0, 1], [0, 110])
  const railX = useTransform(scrollYProgress, [0, 1], ['0%', '-34%'])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell || reduceMotion) return undefined
    const updateSpotlight = (event) => {
      shell.style.setProperty('--cursor-x', `${event.clientX}px`)
      shell.style.setProperty('--cursor-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', updateSpotlight, { passive: true })
    return () => window.removeEventListener('pointermove', updateSpotlight)
  }, [reduceMotion])

  return (
    <>
      <Head>
        <title>{`${data.name} — ${data.role}`}</title>
        <meta name="description" content={data.intro} />
        <meta name="theme-color" content="#05060a" />
      </Head>

      <div className={styles.shell} ref={shellRef}>
        <motion.div className={styles.scrollProgress} style={{ scaleX: progress }} />
        <div className={styles.cursorGlow} aria-hidden="true" />
        <div className={styles.noise} aria-hidden="true" />

        <header className={styles.navbar}>
          <a className={styles.brand} href="#home" aria-label="Back to home">
            <span className={styles.brandMark}>{data.initials}</span>
            <span><strong>{data.name}</strong><small>FOUNDER · AI SYSTEMS ENGINEER</small></span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#home">Home</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#resume">Resume</a><a href="#contact">Contact</a>
          </nav>
          <a className={styles.navCta} href="#contact">Contact <Arrow /></a>
        </header>

        <main>
          <section className={styles.hero} id="home" ref={heroRef}>
            <motion.div className={styles.heroGrid} style={reduceMotion ? undefined : { y: heroGridY }} aria-hidden="true" />
            <motion.div className={styles.heroCopy} style={reduceMotion ? undefined : { y: heroCopyY, opacity: heroCopyOpacity }}>
              <motion.div className={styles.eyebrow} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
                <span className={styles.statusPulse} /> {data.eyebrow}
              </motion.div>
              <h1 aria-label={data.role}>
                <motion.span initial={reduceMotion ? false : { opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .08, ease: [0.2, .8, .2, 1] }}>{data.hero[0]}</motion.span>
                <motion.span className={styles.outlineText} initial={reduceMotion ? false : { opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .16, ease: [0.2, .8, .2, 1] }}>{data.hero[1]}</motion.span>
                <motion.span initial={reduceMotion ? false : { opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .24, ease: [0.2, .8, .2, 1] }}>{data.hero[2]}</motion.span>
              </h1>
              <motion.p initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .42 }}>{data.intro}</motion.p>
              <motion.div className={styles.heroActions} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .5 }}>
                <a className={styles.primaryCta} href="#projects">View projects <Arrow /></a>
                <a className={styles.secondaryCta} href="#resume">View resume</a>
              </motion.div>
              <div className={styles.heroTelemetry}>
                <span><i /> BUILDER MODE: ACTIVE</span><span>{data.location.toUpperCase()}</span><span>EECS · 2027</span>
              </div>
            </motion.div>

            <motion.div className={styles.heroVisual} style={reduceMotion ? undefined : { y: heroVisualY, rotate: heroVisualRotate }} initial={reduceMotion ? false : { opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .25 }}>
              <SceneLoader />
              <div className={`${styles.hudLabel} ${styles.hudTop}`}><span>NEURAL CORE</span><strong>ACTIVE</strong></div>
              <div className={`${styles.hudLabel} ${styles.hudLeft}`}><span>REASONING</span><strong>97.4%</strong></div>
              <div className={`${styles.hudLabel} ${styles.hudBottom}`}><span>TRACE ID</span><strong>AX-2049</strong></div>
              <div className={styles.orbitCopy}>MOVE CURSOR TO INSPECT</div>
            </motion.div>

            <div className={styles.scrollCue}><span>SCROLL TO EXPLORE</span><i /></div>
          </section>

          <section className={styles.signalRail} aria-label="Core expertise">
            <motion.div className={styles.signalTrack} style={reduceMotion ? undefined : { x: railX }}>
              {[0, 1].map((copy) => <div key={copy}><span>TECHNICAL FOUNDER</span><i /><span>PRODUCTION AI</span><i /><span>EVALUATION INFRASTRUCTURE</span><i /><span>MULTIMODAL AI</span><i /><span>AGENTIC PRODUCTS</span><i /></div>)}
            </motion.div>
          </section>

          <AnimatedSection className={styles.projectsSection} id="projects">
            <div className={styles.sectionIntro}>
              <div><span className={styles.sectionIndex}>01</span><span>FEATURED BUILDS</span></div>
              <h2>Products that reached <em>real people.</em></h2>
              <p>Selected work spanning open-source infrastructure, multimodal consumer AI, and recommendation systems at scale.</p>
            </div>
            <div className={styles.projectGrid}>{data.projects.map((project) => <ProjectCard project={project} key={project.title} />)}</div>
          </AnimatedSection>

          <AnimatedSection className={styles.systemsSection} id="systems">
            <div className={styles.sectionIntro}>
              <div><span className={styles.sectionIndex}>02</span><span>SYSTEM DESIGN</span></div>
              <h2>From research idea to <em>working product.</em></h2>
              <p>My range covers the full loop: model behavior, backend systems, product interfaces, reliability, users, and business outcomes.</p>
            </div>
            <ArchitectureFlow />
            <div className={styles.systemCards}>
              {data.systems.map((system) => <article key={system.number}><span>{system.number}</span><div className={styles.systemIcon}><i /><i /><i /></div><h3>{system.title}</h3><p>{system.copy}</p></article>)}
            </div>
          </AnimatedSection>

          <AnimatedSection className={styles.skillsSection} id="skills">
            <div className={styles.sectionIntro}>
              <div><span className={styles.sectionIndex}>03</span><span>CAPABILITY MATRIX</span></div>
              <h2>Technical depth, <em>product judgment.</em></h2>
            </div>
            <div className={styles.skillGrid}>
              {data.skills.map((group, index) => (
                <article key={group.group}>
                  <div><span>0{index + 1}</span><b>{group.group}</b></div>
                  <ul>{group.items.map((item) => <li key={item}><span>{item}</span><i /></li>)}</ul>
                </article>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className={styles.experienceSection} id="experience">
            <div className={styles.sectionIntro}>
              <div><span className={styles.sectionIndex}>04</span><span>EXPERIENCE</span></div>
              <h2>Founder velocity, <em>engineering rigor.</em></h2>
            </div>
            <div className={styles.experienceLayout}>
              <div className={styles.timeline}>
                {data.experience.map((item, index) => (
                  <article key={`${item.period}-${item.company}`}><span>{item.period}</span><i><b /></i><div><small>0{index + 1}</small><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.detail}</p></div></article>
                ))}
              </div>
              <aside className={styles.resumeCard} id="resume">
                <div className={styles.resumeScan} /><span>RESUME.PDF</span><strong>THE FULL<br />SIGNAL.</strong><p>Roles, education, verified impact, and the deeper technical record.</p>
                <span className={styles.resumePending}>Final résumé link will be added once verified contact details are ready.</span>
              </aside>
            </div>
          </AnimatedSection>

          <AnimatedSection className={styles.contactSection} id="contact">
            <div className={styles.contactOrb} aria-hidden="true"><i /><i /><i /></div>
            <span>BERKELEY EECS · TECHNICAL FOUNDER · AI ENGINEER</span>
            <h2>Let&apos;s build something<br /><em>people actually use.</em></h2>
            <div className={styles.contactActions}>
              <button type="button" disabled>Contact me · pending</button>
              <button type="button" disabled>GitHub · pending</button>
              <button type="button" disabled>Resume · pending</button>
            </div>
            <p>{data.location} · {data.availability}</p>
          </AnimatedSection>
        </main>

        <footer className={styles.footer}><span>{data.initials} / FOUNDER + ENGINEER</span><span>UC BERKELEY EECS · EXPECTED 2027</span><span>© {new Date().getFullYear()}</span></footer>
      </div>
    </>
  )
}
