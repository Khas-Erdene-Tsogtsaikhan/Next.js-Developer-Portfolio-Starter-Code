import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'
import { Mail } from './icons'
import Magnetic from '@/components/ai/Magnetic'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#systems', label: 'Systems' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function EditorialNav({ data }) {
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="#home" className={styles.brand} aria-label={`${data.name} — home`}>
        <span>{data.initials}</span>
        Khas-Erdene
      </a>

      <div className={styles.navLinks}>
        {links.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </div>

      <div className={styles.navCta}>
        <Magnetic strength={0.2}>
          <a className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`} href={`mailto:${data.email}`}>
            <Mail /> Get in touch
          </a>
        </Magnetic>
      </div>
    </motion.nav>
  )
}
