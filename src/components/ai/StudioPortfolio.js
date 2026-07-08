import { useRef } from 'react'
import Head from 'next/head'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, Check, Code2, FileText, GitPullRequest, GraduationCap, MapPin, Users } from 'lucide-react'
import { resumePortfolio as data } from '@/data/resumePortfolio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import OperatorStory from './OperatorStory'
import AnimatedMetric from './AnimatedMetric'
import AnimatedSection from './AnimatedSection'
import CinematicBackground from './CinematicBackground'
import HeroBootSequence, { bootHeadline, bootItem } from './HeroBootSequence'
import KhasOSAssistant from './KhasOSAssistant'
import Magnetic from './Magnetic'
import PortfolioNavbar from './PortfolioNavbar'
import StudioArchitectureFlow from './StudioArchitectureFlow'
import StudioProjectCard from './StudioProjectCard'
import SystemHighlights from './SystemHighlights'
import styles from '@/styles/StudioPortfolio.module.css'

const metrics = [
  { value: 2500, suffix: '+', label: 'NutrioMN users', signal: 'Production adoption' },
  { value: 5, prefix: '$', suffix: 'K', label: 'PrimitiveBench MRR', signal: 'Enterprise revenue' },
  { value: 100, suffix: '+', label: 'GitHub stars', signal: 'Open-source pull' },
  { value: 40000, suffix: '+', label: 'students reached', signal: 'CourseLynx footprint' },
]

const specialization = [
  'Agent evaluation',
  'LLMOps',
  'RAG + tool calling',
  'Structured outputs',
  'CI/CD eval gates',
  'Agent tracing',
]

export default function StudioPortfolio() {
  const heroRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 })
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const copyY = useTransform(heroProgress, [0, 1], [0, 48])
  const copyOpacity = useTransform(heroProgress, [0, .72, 1], [1, .9, .35])
  const visualY = useTransform(heroProgress, [0, 1], [0, -38])
  const visualScale = useTransform(heroProgress, [0, 1], [1, .97])
  const tickerX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const flagshipProjects = data.projects.filter((project) => ['primitivebench', 'nutriomn'].includes(project.slug))
  const agentProjects = data.projects.filter((project) => ['courselynx', 'pm-ai', 'neuron-book', 'curio-ai'].includes(project.slug))
  const operatorProjects = data.projects.filter((project) => project.slug === 'vault-collection')
  const devToolProjects = data.projects.filter((project) => ['google-ads-transparency-monitor'].includes(project.slug))

  return (
    <>
      <Head>
        <title>{data.name} — {data.role}</title>
        <meta name="description" content={data.intro} />
        <meta name="theme-color" content="#080a0f" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className={`${styles.shell} dark`}>
        <CinematicBackground scrollProgress={scrollYProgress} />
        <motion.div className={styles.progress} style={{ scaleX: progress }} />

        <PortfolioNavbar data={data} />

        <main>
          <section className={styles.hero} id="home" ref={heroRef}>
            <div className={styles.heroGrid} aria-hidden="true" />
            <HeroBootSequence className={styles.heroCopy} style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}>
              <motion.div variants={bootItem}><Badge variant="outline" className={styles.availability}><span /> Open to AI agents, LLMOps & startup engineering roles</Badge></motion.div>
              <motion.p className={styles.heroName} variants={bootItem}>{data.name}</motion.p>
              <motion.h1 variants={bootHeadline} aria-label="AI agents and LLMOps founder-engineer">
                <span className={styles.heroLine}><motion.span variants={bootItem}>AI agents &amp; LLMOps</motion.span></span>
                <span className={`${styles.heroLine} ${styles.heroAccentLine}`}><motion.span variants={bootItem}>founder-engineer.</motion.span></span>
              </motion.h1>
              <motion.p variants={bootItem}>I build reliable agentic AI systems: eval harnesses, RAG pipelines, structured outputs, tool-call workflows, and production products that survive outside the demo.</motion.p>
              <motion.div className={styles.specializationStrip} variants={bootItem}>{specialization.map((item) => <Badge variant="secondary" key={item}>{item}</Badge>)}</motion.div>
              <motion.div className={styles.credibilityChips} variants={bootItem}><Badge variant="secondary">PrimitiveBench co-founder</Badge><Badge variant="secondary">3x hackathon wins</Badge><Badge variant="secondary">2,500+ product users</Badge></motion.div>
              <motion.div className={styles.heroActions} variants={bootItem}>
                <Magnetic><Button asChild size="lg"><a href="#projects">See selected work <ArrowDown /></a></Button></Magnetic>
                <Magnetic><Button asChild size="lg" variant="outline"><a href="#resume"><FileText /> Career snapshot</a></Button></Magnetic>
              </motion.div>
              <motion.div className={styles.heroFacts} variants={bootItem}>
                <span><MapPin /> Berkeley, CA</span><span><GraduationCap /> UC Berkeley EECS · Fall 2027</span>
              </motion.div>
            </HeroBootSequence>

            <motion.div className={styles.heroVisual} style={reduceMotion ? undefined : { y: visualY, scale: visualScale }} initial={reduceMotion ? false : { opacity: 0, filter: 'blur(14px)', scale: .985 }} animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }} transition={{ duration: 1, delay: 1.18, ease: [0.16, 1, 0.3, 1] }}>
              <KhasOSAssistant />
            </motion.div>
            <KhasOSAssistant mode="mobile" />
          </section>

          <section className={styles.metrics} aria-label="Selected outcomes">
            {metrics.map((metric) => <AnimatedMetric {...metric} key={metric.label} />)}
          </section>

          <section className={styles.ticker} aria-label="Technical focus"><motion.div style={reduceMotion ? undefined : { x: tickerX }}><span>BERKELEY ENGINEERING</span><i /><span>AI / LLMOPS</span><i /><span>AGENTIC SYSTEMS</span><i /><span>PRODUCTION APPS</span><i /><span>OPEN SOURCE + STARTUPS</span><i /><span>BERKELEY ENGINEERING</span></motion.div></section>

          <AnimatedSection id="projects">
            <div className={styles.sectionHeading}><span>01 / SELECTED WORK</span><div><h2>AI systems with public proof.</h2><p>Evaluation infrastructure, multimodal products, retrieval agents, and production systems with real users or adoption.</p></div></div>
            <div className={styles.projectSubsection}>
              <div className={styles.projectSubhead}><span>FLAGSHIP AI SYSTEMS</span><p>Evaluation infrastructure beside a funded, fine-tuned multimodal product.</p></div>
              <div className={`${styles.projectGrid} ${styles.leadGrid}`}>{flagshipProjects.map((project, index) => <StudioProjectCard project={project} featured={false} index={index} key={project.slug} />)}</div>
            </div>

            <div className={styles.projectSubsection}>
              <div className={styles.projectSubhead}><span>AGENT SYSTEMS LAB</span><p>Retrieval, orchestration, structured outputs, and product-facing agent workflows.</p></div>
              <div className={`${styles.projectGrid} ${styles.agentGrid}`}>{agentProjects.map((project, index) => <StudioProjectCard project={project} index={index} key={project.slug} />)}</div>
            </div>

            <div className={styles.projectSubsection}>
              <div className={styles.projectSubhead}><span>FOUNDER / PRODUCT PROOF</span><p>Product taste, monetization, and zero-to-one execution.</p></div>
              <div className={`${styles.projectGrid} ${styles.operatorGrid}`}>{operatorProjects.map((project, index) => <StudioProjectCard project={project} index={index} key={project.slug} />)}</div>
            </div>

            <div className={styles.projectSubsection}>
              <div className={styles.projectSubhead}><span>DEV TOOLING / DATA INFRA</span><p>Focused automation and data-pipeline work.</p></div>
              <div className={`${styles.projectGrid} ${styles.utilityGrid}`}>{devToolProjects.map((project, index) => <StudioProjectCard project={project} index={index} key={project.slug} />)}</div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="operator" className={styles.operatorSection}>
            <OperatorStory />
          </AnimatedSection>

          <AnimatedSection id="systems" className={styles.surfaceSection}>
            <div className={styles.sectionHeading}><span>02 / AI SYSTEMS</span><div><h2>Technical depth, made legible.</h2><p>Core patterns for measurable, debuggable agentic systems.</p></div></div>
            <SystemHighlights />
            <StudioArchitectureFlow />
          </AnimatedSection>

          <AnimatedSection id="experience" className={styles.surfaceSection}>
            <div className={styles.sectionHeading}><span>03 / EXPERIENCE</span><div><h2>Founder speed, engineering discipline.</h2><p>Production ownership inside small teams and real constraints.</p></div></div>
            <div className={styles.experienceLayout}>
              <div className={styles.timeline}>{data.experience.map((item, index) => <motion.article key={`${item.company}-${item.period}`} initial={reduceMotion ? false : { opacity: 0, y: 32, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .35 }} transition={{ duration: .8, delay: index * .06, ease: [0.16, 1, 0.3, 1] }}><div><span>{item.period}</span><i /></div><div><small>0{index + 1}</small><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.detail}</p><div className={styles.experienceTags}>{item.tech.map((tech) => <Badge variant="secondary" key={tech}>{tech}</Badge>)}</div></div></motion.article>)}</div>
              <Card className={styles.resumeCard} id="resume"><FileText /><Badge variant="outline">Resume snapshot</Badge><h3>Built for zero-to-one.</h3><p>Berkeley EECS, AI systems and LLMOps specialization, founder experience, open-source infrastructure, and ownership from build through distribution.</p><Button asChild variant="outline"><a href={`mailto:${data.email}`}>Request full resume</a></Button></Card>
            </div>
          </AnimatedSection>

          <AnimatedSection id="skills">
            <div className={styles.sectionHeading}><span>04 / TECHNICAL STACK</span><div><h2>A practical technical range.</h2><p>Tools for connecting model quality, system reliability, and product delivery.</p></div></div>
            <div className={styles.skillGrid}>{data.skills.map((group) => <Card key={group.group} className={styles.skillCard}><CardHeader><CardTitle>{group.group}</CardTitle></CardHeader><CardContent>{group.items.map((item) => <span key={item}><Check /> {item}</span>)}</CardContent></Card>)}</div>
          </AnimatedSection>

          <AnimatedSection id="contact" className={styles.contact}>
            <Badge variant="outline">Open to ambitious AI work</Badge>
            <h2>Building something that needs to work outside the demo?</h2>
            <p>{data.availability}. Email me directly or verify the work through LinkedIn, GitHub, and the case studies.</p>
            <div><Magnetic><Button asChild size="lg"><a href={`mailto:${data.email}`}>Email Khas <ArrowDown /></a></Button></Magnetic><Button asChild variant="outline" size="lg"><a href={data.linkedin} target="_blank" rel="noreferrer"><Users /> LinkedIn</a></Button>{data.github ? <Button asChild variant="outline" size="lg"><a href={data.github} target="_blank" rel="noreferrer"><GitPullRequest /> GitHub</a></Button> : null}<Button asChild variant="outline" size="lg"><a href="https://www.primitivebench.com/" target="_blank" rel="noreferrer"><Code2 /> PrimitiveBench</a></Button></div>
          </AnimatedSection>

        </main>

        <Separator />
        <footer className={styles.footer}><span>{data.name}</span><span>Berkeley, California</span><span>© {new Date().getFullYear()}</span></footer>
      </div>
    </>
  )
}
