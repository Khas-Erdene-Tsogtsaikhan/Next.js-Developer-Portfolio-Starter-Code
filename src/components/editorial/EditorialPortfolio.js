import Head from 'next/head'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { resumePortfolio as data } from '@/data/resumePortfolio'
import styles from '@/styles/Editorial.module.css'
import EditorialNav from './EditorialNav'
import FeatureMedia from './FeatureMedia'
import Counter from './Counter'
import CinematicBackground from './CinematicBackground'
import Spotlight from './Spotlight'
import Tilt from './Tilt'
import HeroClassic from './HeroClassic'
import KhasOS from './KhasOS'
import SectionDivider from './SectionDivider'
import { Reveal, StaggerGroup, riseItem } from './Reveal'
import Magnetic from '@/components/ai/Magnetic'
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail } from './icons'

const metrics = [
  { value: 2500, suffix: '+', label: 'NutrioMN users', signal: 'Production adoption' },
  { value: 5, prefix: '$', suffix: 'K', label: 'PrimitiveBench MRR', signal: 'Enterprise revenue' },
  { value: 100, suffix: '+', label: 'GitHub stars', signal: 'Open-source pull' },
  { value: 40000, suffix: '+', label: 'students reached', signal: 'CourseLynx footprint' },
]

const focus = ['Agent evaluation', 'LLMOps', 'RAG + tool calling', 'Structured outputs', 'Multimodal AI', 'CI/CD eval gates', 'Production systems']

// Curated stat trios for the featured blocks (grounded in verified data).
const featuredStats = {
  primitivebench: [
    { b: '100+', s: 'GitHub stars' },
    { b: '$5K', s: 'MRR' },
    { b: 'CalCompute', s: 'Benchmark partner' },
  ],
  nutriomn: [
    { b: '2,500+', s: 'Users' },
    { b: '400', s: 'Labeled images' },
    { b: 'Angel', s: 'Funded grant' },
  ],
}

function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>
}

export default function EditorialPortfolio() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 })
  const tickerX = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])

  const featured = ['primitivebench', 'nutriomn']
    .map((slug) => data.projects.find((p) => p.slug === slug))
    .filter(Boolean)

  const indexProjects = data.projects.filter((p) => !featured.includes(p))

  return (
    <>
      <Head>
        <title>{`${data.name} — ${data.role}`}</title>
        <meta name="description" content={data.intro} />
        <meta name="theme-color" content="#f7f4ee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className={styles.shell}>
        <CinematicBackground />
        <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />

        <EditorialNav data={data} />

        <main>
          {/* ---------------- HERO ---------------- */}
          <HeroClassic data={data} />

          {/* ---------------- TICKER ---------------- */}
          <section className={styles.ticker} aria-label="Focus areas">
            <motion.div className={styles.tickerTrack} style={reduceMotion ? undefined : { x: tickerX }}>
              {[...focus, ...focus].map((item, i) => (
                <span key={`${item}-${i}`}>{item}<i style={{ marginLeft: '2.5rem' }} /></span>
              ))}
            </motion.div>
          </section>

          {/* ---------------- METRICS ---------------- */}
          <section className={styles.section} aria-label="Selected outcomes">
            <div className={styles.sectionHead}>
              <span className={styles.index}>00 / Proof</span>
              <h2>Outcomes, not adjectives.</h2>
            </div>
            <div className={styles.metrics}>
              {metrics.map((m) => <Counter key={m.label} {...m} />)}
            </div>
          </section>

          {/* ---------------- SELECTED WORK ---------------- */}
          <section className={styles.section} id="work">
            <div className={styles.sectionHead}>
              <span className={styles.index}>01 / Selected work</span>
              <h2>AI systems with public proof.</h2>
              <p>Evaluation infrastructure, multimodal products, retrieval agents, and production systems with real users and adoption.</p>
            </div>

            <div className={styles.featured}>
              {featured.map((project, i) => (
                <Reveal key={project.slug} className={`${styles.feature} ${i % 2 === 1 ? styles.featureReverse : ''}`} amount={0.2}>
                  <Tilt className={styles.featureMediaWrap} max={7}>
                    <FeatureMedia
                      src={project.thumb || project.media}
                      alt={project.mediaAlt}
                      label={project.mediaLabel}
                      fit={project.thumbFit || project.mediaFit || 'cover'}
                      badge={(featuredStats[project.slug] || [])[0] ? `${featuredStats[project.slug][0].b} ${featuredStats[project.slug][0].s}` : undefined}
                    />
                  </Tilt>
                  <div className={styles.featureBody}>
                    <span className={styles.featureNo}>{project.index}</span>
                    <span className={styles.featureType}>{project.type}</span>
                    <h3>{project.title}</h3>
                    <p>{project.homeSummary || project.description}</p>
                    <div className={styles.featureMeta}>
                      {(featuredStats[project.slug] || []).map((stat) => (
                        <div className={styles.featureStat} key={stat.s}>
                          <b>{stat.b}</b>
                          <span>{stat.s}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.featureStack}>
                      {project.stack.slice(0, 5).map((s) => <Tag key={s}>{s}</Tag>)}
                    </div>
                    <div className={styles.featureLinks}>
                      <Link className={styles.featureLink} href={`/projects/${project.slug}`}>
                        Read case study <ArrowRight />
                      </Link>
                      {project.externalUrl ? (
                        <a className={styles.featureLinkGhost} href={project.externalUrl} target="_blank" rel="noreferrer">
                          {project.externalLabel || 'Visit'} <ArrowUpRight />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <SectionDivider label="More work" />
            <div className={styles.workIndex}>
              {indexProjects.map((project) => (
                <Spotlight
                  as={Link}
                  glow="row"
                  key={project.slug}
                  className={styles.workRow}
                  href={`/projects/${project.slug}`}
                >
                  <span className={styles.workNo}>{project.index}</span>
                  <div className={styles.workThumb} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.media} alt="" loading="lazy" />
                  </div>
                  <div className={styles.workMain}>
                    <h4>{project.title}</h4>
                    <p>{project.homeSummary || project.description}</p>
                    <div className={styles.workStack}>
                      {project.stack.slice(0, 4).map((s) => <Tag key={s}>{s}</Tag>)}
                    </div>
                  </div>
                  <div className={styles.workAside}>
                    <span className={styles.workProof}>{project.proof}</span>
                    <span className={styles.workArrow}><ArrowUpRight /></span>
                  </div>
                </Spotlight>
              ))}
            </div>
          </section>

          {/* ---------------- ABOUT / PHILOSOPHY ---------------- */}
          <section className={styles.section} id="about">
            <div className={styles.about}>
              <Reveal>
                <span className={styles.index} style={{ display: 'block', marginBottom: '1.4rem' }}>02 / Philosophy</span>
                <p className={styles.aboutLead}>
                  I care about the version of AI that survives{' '}
                  <span className={styles.mark}>outside the demo</span> — where real users, real money, and real failure modes are on the line.
                </p>
              </Reveal>
              <Reveal className={styles.aboutBody} delay={0.12}>
                <p>
                  As a technical founder I&apos;ve shipped a <strong>Mongolian-first multimodal nutrition app</strong> to 2,500+ users,
                  co-founded <strong>PrimitiveBench</strong> — a vendor-neutral evaluation layer for AI infrastructure now partnered with CalCompute — and
                  built recommendation and retrieval systems serving students across 16+ universities.
                </p>
                <p>
                  The throughline is discipline around the model: <strong>structured outputs</strong>, golden datasets, agent traces,
                  deterministic fallbacks, and CI eval gates. Flexible reasoning becomes a reliable product only when its output is
                  measurable, debuggable, and safe downstream.
                </p>
                <p>
                  I move at founder speed but build with engineering restraint — because taste, distribution, and reliability
                  are all part of systems design.
                </p>
              </Reveal>
            </div>
          </section>

          {/* ---------------- SYSTEMS ---------------- */}
          <section className={styles.section} id="systems">
            <div className={styles.sectionHead}>
              <span className={styles.index}>03 / Capabilities</span>
              <h2>Technical depth, made legible.</h2>
              <p>Core patterns behind measurable, debuggable agentic systems.</p>
            </div>
            <StaggerGroup className={styles.systemsGrid}>
              {data.systems.map((s) => (
                <Spotlight as={motion.div} className={styles.systemCard} key={s.number} variants={riseItem}>
                  <span className={styles.systemNo}>{s.number}</span>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </Spotlight>
              ))}
            </StaggerGroup>
          </section>

          {/* ---------------- EXPERIENCE ---------------- */}
          <section className={styles.section} id="experience">
            <div className={styles.sectionHead}>
              <span className={styles.index}>04 / Experience</span>
              <h2>Founder speed, engineering discipline.</h2>
              <p>Production ownership inside small teams and real constraints.</p>
            </div>
            <div className={styles.timeline}>
              {data.experience.map((item, i) => (
                <Reveal className={styles.expRow} key={`${item.company}-${item.period}`} delay={i * 0.04} amount={0.3}>
                  <span className={styles.expPeriod}><b>{String(i + 1).padStart(2, '0')}</b> {item.period}</span>
                  <div className={styles.expMain}>
                    <h3>{item.role}</h3>
                    <div className={styles.expCompany}>{item.company}</div>
                    <p>{item.detail}</p>
                    <div className={styles.expTags}>
                      {item.tech.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------------- SKILLS ---------------- */}
          <section className={styles.section} aria-label="Technical stack">
            <div className={styles.sectionHead}>
              <span className={styles.index}>05 / Stack</span>
              <h2>A practical technical range.</h2>
              <p>Tools for connecting model quality, system reliability, and product delivery.</p>
            </div>
            <StaggerGroup className={styles.skillsGrid}>
              {data.skills.map((group) => (
                <Spotlight as={motion.div} className={styles.skillCard} key={group.group} variants={riseItem}>
                  <h4>{group.group}</h4>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </Spotlight>
              ))}
            </StaggerGroup>
          </section>

          {/* ---------------- CONTACT ---------------- */}
          <section className={styles.contact} id="contact">
            <Reveal className={styles.eyebrow} y={0}>Open to <b>ambitious AI work</b></Reveal>
            <Reveal as="h2" className={styles.contactHead} delay={0.05}>
              Building something that needs to work <span className={styles.mark}>outside the demo?</span>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{data.availability}. Email me directly, or verify the work through LinkedIn, GitHub, and PrimitiveBench.</p>
            </Reveal>
            <Reveal className={styles.contactActions} delay={0.15} y={0}>
              <Magnetic strength={0.22}>
                <a className={`${styles.btn} ${styles.btnPrimary}`} href={`mailto:${data.email}`}><Mail /> Email Khas</a>
              </Magnetic>
              <a className={`${styles.btn} ${styles.btnGhost}`} href={data.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
              {data.github ? (
                <a className={`${styles.btn} ${styles.btnGhost}`} href={data.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
              ) : null}
              <a className={`${styles.btn} ${styles.btnGhost}`} href="https://www.primitivebench.com/" target="_blank" rel="noreferrer">PrimitiveBench <ArrowUpRight /></a>
            </Reveal>
          </section>
        </main>

        <footer className={styles.footer}>
          <span>{data.name}</span>
          <span>Berkeley · California</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>

        <KhasOS />
      </div>
    </>
  )
}
