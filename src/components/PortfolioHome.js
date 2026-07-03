import Head from 'next/head'
import { portfolio } from '@/data/portfolio'
import styles from '@/styles/Portfolio.module.css'

const Arrow = () => <span aria-hidden="true">↗</span>

export default function PortfolioHome() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <Head>
        <title>{portfolio.name} — {portfolio.role}</title>
        <meta name="description" content={portfolio.summary} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.siteShell}>
        <header className={styles.header}>
          <a className={styles.wordmark} href="#top" aria-label="Back to top">{portfolio.initials}<span>.</span></a>
          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="#work">Work</a><a href="#experience">Experience</a><a href="#about">About</a>
          </nav>
          <a className={styles.contactLink} href={`mailto:${portfolio.email}`}>Let&apos;s talk <Arrow /></a>
        </header>

        <main id="top">
          <section className={styles.hero}>
            <div className={styles.heroMeta}><span className={styles.statusDot} />{portfolio.availability}</div>
            <h1>{portfolio.headline.lineOne}<span>{portfolio.headline.lineTwo}</span></h1>
            <div className={styles.heroFooter}>
              <p>{portfolio.summary}</p>
              <a className={styles.primaryButton} href="#work">Explore my work <Arrow /></a>
            </div>
            <div className={styles.heroStamp} aria-hidden="true"><span>PORTFOLIO</span><strong>{portfolio.initials}</strong><span>{currentYear}</span></div>
          </section>

          <section className={styles.signalBar} aria-label="Professional highlights">
            {portfolio.highlights.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          </section>

          <section className={styles.section} id="work">
            <div className={styles.sectionHeading}><p>01 / Selected work</p><h2>Proof, not promises.</h2><span>Projects will be replaced with the strongest evidence from your résumé.</span></div>
            <div className={styles.projectGrid}>
              {portfolio.projects.map((project, index) => (
                <article className={styles.projectCard} key={project.title}>
                  <div className={styles.projectVisual} data-tone={project.tone}>
                    <span>0{index + 1}</span>
                    <div className={styles.projectWindow}><div className={styles.windowBar}><i /><i /><i /></div><strong>{project.mark}</strong></div>
                  </div>
                  <div className={styles.projectCopy}><div><p>{project.category}</p><h3>{project.title}</h3></div><p>{project.description}</p></div>
                  <ul className={styles.tagList} aria-label={`${project.title} skills`}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.experienceSection}`} id="experience">
            <div className={styles.sectionHeading}><p>02 / Experience</p><h2>Where I&apos;ve made an impact.</h2></div>
            <div className={styles.timeline}>
              {portfolio.experience.map((item) => (
                <article key={`${item.company}-${item.role}`}><span>{item.period}</span><div><h3>{item.role}</h3><p>{item.company} · {item.location}</p></div><p>{item.impact}</p></article>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.aboutSection}`} id="about">
            <div className={styles.aboutIntro}><p>03 / About</p><h2>{portfolio.aboutHeading}</h2></div>
            <div className={styles.aboutBody}><p>{portfolio.about}</p><div className={styles.capabilities}><h3>Core capabilities</h3><ul>{portfolio.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div></div>
          </section>

          <section className={styles.contactSection}>
            <p>Have a role, project, or interesting problem?</p>
            <h2>Let&apos;s make something <em>worth remembering.</em></h2>
            <a href={`mailto:${portfolio.email}`}>{portfolio.email} <Arrow /></a>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>© {currentYear} {portfolio.name}</p><p>Built with care. Ready for your résumé.</p>
          <div>{portfolio.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}</a>)}</div>
        </footer>
      </div>
    </>
  )
}
