import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import styles from '@/styles/StudioPortfolio.module.css'

export default function StudioProjectCard({ project, featured = false, index = 0 }) {
  const reduceMotion = useReducedMotion()

  const updateSpotlight = (event) => {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 32, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: .14 }}
      transition={{ duration: .8, delay: (index % 2) * .06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: .32, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={reduceMotion ? undefined : { scale: 0.985, transition: { duration: 0.12 } }}
      className={`${styles.projectWrap} ${featured ? styles.projectFeatured : ''}`}
      data-project={project.slug}
      onPointerMove={updateSpotlight}
    >
      <Link href={`/projects/${project.slug}`} className={styles.projectLink} aria-label={`Open ${project.title} case study`}>
        <Card className={styles.projectCard}>
          <div className={styles.projectMeta}>
            <span>{project.index}</span>
            <Badge variant="outline">{project.type}</Badge>
          </div>
          <div className={styles.projectMedia} data-fit={project.mediaFit || 'cover'}>
            <Image src={project.media} alt={project.mediaAlt} fill sizes={featured ? '(max-width: 720px) 100vw, 80vw' : '(max-width: 720px) 100vw, 50vw'} />
            <div className={styles.mediaCaption}><span>{project.role}</span><strong>{project.mediaLabel}</strong></div>
          </div>
          <div className={styles.projectBody}>
            <p className={styles.projectProof}>{project.proof}</p>
            <h3>{project.title}</h3>
            <p>{project.homeSummary || project.description}</p>
            <div className={styles.impactList}>{project.impactBullets.slice(0, 1).map((item) => <span key={item}><CheckCircle2 /> {item}</span>)}</div>
          </div>
          <div className={styles.projectFooter}>
            <ul>{project.stack.slice(0, 3).map((item) => <li key={item}><Badge variant="secondary">{item}</Badge></li>)}</ul>
            <span className={styles.caseStudyCta}>Open case study <ArrowUpRight /></span>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
