import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { resumePortfolio } from '@/data/resumePortfolio'
import { ArrowUpRight } from '@/components/editorial/icons'
import styles from '@/styles/CaseStudy.module.css'

const engineeringDepth = {
  primitivebench: [
    'Structured the harness around dataset → task → adapter → scorer → result schema so data, vendor integrations, metrics, and reporting stay isolated and reproducible.',
    'Designed for statistical honesty: per-slice scoring, Wilson/bootstrap confidence intervals, McNemar-style separability checks, and tie bands instead of fake global winners.',
    'Separated public dev splits from private held-out golden answers with contamination controls, canary markers, and versioned methodology so the benchmark could act as a public trust anchor.',
    'Extended the product thesis beyond a website by exposing slice-level benchmark results through an MCP server, letting AI agents query which primitive fits a constrained workflow.',
    'Treated benchmark releases like software releases: versioned datasets, repeatable run manifests, provider-specific adapters, captured latency and cost telemetry, and CI-compatible artifacts make regressions auditable instead of anecdotal.',
  ],
  courselynx: [
    'Separated flexible LLM reasoning from trusted course data by routing student intent through tools, catalog retrieval, and schema-validated response objects.',
    'Built ingestion reliability around idempotency, duplicate prevention, validation logs, and tests so 16+ university catalogs could be maintained without silent data drift.',
    'Owned Chrome extension flows defensively: supported-domain checks, privacy-safe onboarding, content scripts, and backend calls that fail predictably instead of breaking the student experience.',
    'Measured agent quality at the interface boundary with structured-response validation and deterministic fallbacks, increasing valid assistant outputs while keeping retrieved course facts grounded in university data rather than model memory.',
  ],
  'pm-ai': [
    'Turned unstructured project briefs into database-backed state by forcing the multi-agent pipeline to emit roles, tasks, subtasks, and ownership as validated JSON.',
    'Split the workflow into planner and specialist-agent stages so one model pass did not have to solve parsing, prioritization, role assignment, and UI state generation all at once.',
    'Used retrieval context, FastAPI boundaries, Supabase persistence, and dashboard rendering to make the agent output actionable instead of just a chat transcript.',
    'Designed the handoff between agents and product state around JSON contracts, validation, and idempotent inserts so retries could not silently duplicate assignments or leave the dashboard in a partially generated state.',
  ],
  'neuron-book': [
    'Designed around active learning instead of summarization: the system needed to ask questions, track weak concepts, and visualize knowledge decay.',
    'Connected page-level PDF context to LangChain question generation, Sanity-backed concept memory, and a Neural Trace graph so learning state could persist across sessions.',
    'Used external enrichment for explanations while keeping the core loop tied to the uploaded document, preventing the product from becoming a generic chatbot.',
    'Modeled concepts, attempts, difficulty, and decay as persistent learning state, allowing retrieval practice and the Neural Trace visualization to evolve across sessions rather than resetting with every prompt.',
  ],
  'curio-ai': [
    'Built structured recommendation logic so an LLM-powered learning product could return dependable progress and content state rather than loose prose.',
    'Used LangGraph/function-calling patterns to retrieve real-time content beyond the static catalog while keeping response shape validated.',
    'Focused on the bridge between user state, ingestion, and agent output because personalization fails when any one of those layers is unreliable.',
    'Kept live retrieval modular through LangGraph nodes for search, normalization, ranking, and schema construction, making the agent workflow observable and easier to debug than one monolithic prompt chain.',
  ],
  nutriomn: [
    'Treated localization as a systems problem: language, food data, image recognition, onboarding, payments, and nutrition output all had to fit Mongolian users.',
    'Routed AI photo logging through Supabase Edge Functions and structured calorie/macro output so the mobile app received predictable data instead of raw model prose.',
    'Improved the vision loop with local food images, manual fallback search, USDA data, translation, and local database matching rather than depending on one model call.',
    'Built the multimodal boundary around a fine-tuned VLM and schema-validated nutrition objects, then reconciled uncertain predictions against local food records before committing calories and macros to user state.',
    'Owned the production surface around the model—Edge Function inference, authentication, subscriptions, analytics, TestFlight distribution, and local payment coordination—so recognition quality connected to a usable consumer product.',
  ],
  'vault-collection': [
    'Designed the product around collector behavior: ownership pride, asset value, rarity, and portfolio status mattered more than generic inventory CRUD.',
    'Created a dashboard language with valuation, category analytics, acquisition status, and premium visual cues so the product felt monetizable from the first screen.',
    'Used product taste as part of the engineering: the interface had to make physical assets feel trackable, prestigious, and financially legible.',
    'Structured the UI around normalized positions, cost basis, valuation deltas, document completeness, category exposure, and liquidity so a collector could move from portfolio overview to asset-level evidence without losing context.',
  ],
  'google-ads-transparency-monitor': [
    'Packaged a public-web monitoring workflow as an Apify actor so collection could run repeatedly instead of depending on manual browser research.',
    'Focused on converting messy ad-transparency surfaces into structured dataset outputs that can be reviewed, analyzed, or passed into downstream LLM workflows.',
    'Kept it intentionally low-scope: a utility data-infrastructure build that shows scraping and automation range without competing with the main product case studies.',
    'Designed the actor as a composable data primitive: explicit inputs, scheduled runs, structured datasets, and webhook-friendly outputs make the collected signals usable by analytics, alerting, or downstream LLM classification systems.',
  ],
}

export default function CaseStudy({ project }) {
  const reduceMotion = useReducedMotion()
  const links = project.links || [
    project.externalUrl ? { label: project.externalLabel, href: project.externalUrl } : null,
    project.evidenceUrl ? { label: project.evidenceLabel, href: project.evidenceUrl } : null,
  ].filter(Boolean)
  const engineeringNotes = engineeringDepth[project.slug] || []
  const storySections = [
    ['01 / Problem', 'What needed to change', project.problem, ''],
    ['02 / What I built', 'The engineering response', project.built, ''],
    ['03 / Impact', 'The signal', project.impact, styles.impact],
    ['04 / What I learned', 'The durable insight', project.learned, ''],
  ]

  return (
    <div className={styles.page}>
      <Head>
        <title>{`${project.title} — Case Study`}</title>
        <meta name="description" content={project.description} />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <header className={styles.header}>
        <Link href="/#work">← Back to work</Link>
        <span>KHAS-ERDENE TSOGTSAIKHAN</span>
        <Link href="/#contact">Contact</Link>
      </header>
      <main>
        <section className={styles.hero}>
          <div><span>{project.index}</span><span>{project.type}</span></div>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          {links.length ? (
            <nav className={styles.linkShelf} aria-label={`${project.title} links`}>
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label} <ArrowUpRight />
                </a>
              ))}
            </nav>
          ) : null}
          <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className={styles.evidence}>
          <div className={styles.evidenceFrame} data-fit={project.mediaFit || 'cover'}>
            <Image src={project.media} alt={project.mediaAlt} fill sizes="(max-width: 900px) 100vw, 88vw" priority />
          </div>
          <div>
            <span>Proof artifact</span>
            <strong>{project.mediaLabel}</strong>
            <p>{project.role}</p>
          </div>
        </section>
        {project.gallery?.length ? (
          <section className={styles.gallery}>
            <div className={styles.galleryHeader}><span>More evidence</span><h2>Additional artifacts</h2></div>
            <div className={styles.galleryGrid}>
              {project.gallery.map((item) => (
                <figure key={item.src} data-fit={item.fit || 'cover'}>
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 48vw" />
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
        <section className={styles.story}>
          {storySections.map(([label, title, copy, className], index) => (
            <motion.article className={className} key={label} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .55, delay: (index % 2) * .08, ease: [0.22, 1, 0.36, 1] }}>
              <span>{label}</span><h2>{title}</h2><p>{copy}</p>
            </motion.article>
          ))}
        </section>
        {engineeringNotes.length ? (
          <section className={styles.engineering}>
            <div>
              <span>Engineering depth</span>
              <h2>How I engineered it</h2>
              <p>The constraints, reliability decisions, and system boundaries behind the visible product.</p>
            </div>
            <ol>
              {engineeringNotes.map((note, index) => (
                <motion.li key={note} initial={reduceMotion ? false : { opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .48, delay: index * .06 }}><small>0{index + 1}</small><p>{note}</p></motion.li>
              ))}
            </ol>
          </section>
        ) : null}
        <section className={styles.architecture}>
          <span>System architecture</span>
          <div>{project.architecture.map((node, index) => <motion.div key={node} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .42, delay: index * .07 }}><small>0{index + 1}</small><strong>{node}</strong>{index < project.architecture.length - 1 ? <i>→</i> : null}</motion.div>)}</div>
        </section>
      </main>
      <footer><Link href="/#work">Explore another project ↗</Link><span>Case study · live links inside</span></footer>
    </div>
  )
}

export function getStaticPaths() {
  return { paths: resumePortfolio.projects.map((project) => ({ params: { slug: project.slug } })), fallback: false }
}

export function getStaticProps({ params }) {
  return { props: { project: resumePortfolio.projects.find((item) => item.slug === params.slug) } }
}
