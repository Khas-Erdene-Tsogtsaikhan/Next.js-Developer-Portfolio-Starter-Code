import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, FileText, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import styles from '@/styles/StudioPortfolio.module.css'

const links = [
  ['Projects', '#projects'],
  ['AI Systems', '#systems'],
  ['Experience', '#experience'],
  ['Resume', '#resume'],
  ['Contact', '#contact'],
]

export default function PortfolioNavbar({ data }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState('#home')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  useEffect(() => {
    const sections = ['home', ...links.map(([, href]) => href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveHref(`#${visible.target.id}`)
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: [0, .15, .35, .6] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <motion.header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`} style={{ x: '-50%' }} initial={reduceMotion ? false : { opacity: 0, y: -14, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .8, delay: .58, ease: [0.16, 1, 0.3, 1] }}>
      <a className={styles.brand} href="#home" onClick={() => setOpen(false)}><span>{data.initials}</span><strong>{data.name}</strong></a>
      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a className={activeHref === href ? styles.navLinkActive : ''} href={href} aria-current={activeHref === href ? 'page' : undefined} key={href}>
            {activeHref === href ? <motion.span className={styles.navActiveCapsule} layoutId="nav-active" transition={{ type: 'spring', stiffness: 380, damping: 34 }} aria-hidden="true" /> : null}
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className={styles.navActions}>
        <Button asChild variant="outline" size="sm" className={styles.resumeNavButton}><a href="#resume"><FileText /> Resume</a></Button>
        <Button asChild size="sm" className={styles.contactNavButton}><a href="#contact">Let&apos;s talk <ArrowUpRight /></a></Button>
        <Button variant="outline" size="icon" className={styles.menuButton} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav className={styles.mobileNav} aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .2 }}>
            {links.map(([label, href], index) => <a className={activeHref === href ? styles.navLinkActive : ''} href={href} aria-current={activeHref === href ? 'page' : undefined} key={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}<ArrowUpRight /></a>)}
            <Button asChild><a href={`mailto:${data.email}`} onClick={() => setOpen(false)}><ArrowUpRight /> Email Khas</a></Button>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
