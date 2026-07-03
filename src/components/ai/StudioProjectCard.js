import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import styles from '@/styles/StudioPortfolio.module.css'

export default function StudioProjectCard({ project, featured = project.featured, index = 0 }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 0.45, 1], [54, 0, -22])
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.97, 1, 0.99])

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y, scale }}
      initial={reduceMotion ? false : { opacity: 0, filter: 'blur(9px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: .14 }}
      transition={{ duration: .48, delay: (index % 2) * .1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -6, rotateX: 0.65, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={reduceMotion ? undefined : { scale: 0.985, transition: { duration: 0.12 } }}
      className={`${styles.projectWrap} ${featured ? styles.projectFeatured : ''}`}
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
