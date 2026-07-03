import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import styles from '@/styles/AIPortfolio.module.css'

export default function ProjectCard({ project }) {
  const cardRef = useRef(null)
  const wrapRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] })
  const scrollY = useTransform(scrollYProgress, [0, 0.48, 1], [76, 0, -34])
  const scrollScale = useTransform(scrollYProgress, [0, 0.48, 1], [0.94, 1, 0.985])
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.48, 1], [7, 0, -2])

  const handlePointer = (event) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--px', `${x * 100}%`)
    card.style.setProperty('--py', `${y * 100}%`)
    card.style.setProperty('--ry', `${(x - 0.5) * 5}deg`)
    card.style.setProperty('--rx', `${(0.5 - y) * 5}deg`)
  }

  const reset = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--ry', '0deg')
    card.style.setProperty('--rx', '0deg')
  }

  return (
    <motion.div ref={wrapRef} className={`${styles.projectCardWrap} ${styles[project.size]}`} style={reduceMotion ? undefined : { y: scrollY, scale: scrollScale, rotateX: scrollRotateX }}>
      <motion.article
        ref={cardRef}
        className={styles.projectCard}
        data-accent={project.accent}
        onPointerMove={handlePointer}
        onPointerLeave={reset}
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55 }}
      >
        <div className={styles.cardGlow} />
        <div className={styles.projectTop}><span>{project.index}</span><span>{project.type}</span><span>↗</span></div>
        <div className={styles.projectGlyph} aria-hidden="true"><i /><i /><i /><b>{project.index}</b></div>
        <div className={styles.projectText}>
          <h3>{project.title}</h3><p>{project.description}</p>
          <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          <Link className={styles.projectLink} href={`/projects/${project.slug}`}>View case study <span aria-hidden="true">↗</span></Link>
        </div>
      </motion.article>
    </motion.div>
  )
}
