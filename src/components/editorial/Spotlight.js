import { useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from '@/styles/Editorial.module.css'

/*
 * Pointer-aware warm spotlight — adapted from 21st.dev "Spotlight Cards" (claude-ai),
 * retinted from white-on-dark to vermillion-on-paper so it stays cohesive with the
 * editorial identity. Writes --spot-x/--spot-y CSS vars via rAF (no re-render).
 * The glow + border-glow are drawn in CSS (.spotGlow / .spotBorder).
 */
export default function Spotlight({ children, className = '', as: Tag = 'div', glow = 'card', ...rest }) {
  const ref = useRef(null)
  const frame = useRef(0)
  const reduceMotion = useReducedMotion()

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    if (frame.current) cancelAnimationFrame(frame.current)
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--spot-x', `${x}px`)
      el.style.setProperty('--spot-y', `${y}px`)
    })
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${styles.spot} ${styles[`spot_${glow}`] || ''} ${className}`}
      onMouseMove={reduceMotion ? undefined : handleMove}
      {...rest}
    >
      <span className={styles.spotGlow} aria-hidden="true" />
      <span className={styles.spotBorder} aria-hidden="true" />
      {children}
    </Tag>
  )
}
