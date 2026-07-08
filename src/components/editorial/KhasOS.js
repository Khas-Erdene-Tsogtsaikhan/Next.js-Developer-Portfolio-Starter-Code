import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from '@/styles/KhasOSAgent.module.css'
import { answerKhasQuestion, KHAS_OS_PROMPTS } from '@/lib/khas-os'
import { ArrowUpRight } from './icons'

const GREETING = {
  role: 'assistant',
  text: "I'm KhasOS — a local agent that runs in your browser, grounded entirely on Khas's real work. Ask about a project, his LLMOps and eval infrastructure, the metrics, or whether he fits a role. This whole assistant is a demo that he ships products, not just talks about them.",
  sources: [],
  instant: true,
}

function Typewriter({ text, onTick }) {
  const reduceMotion = useReducedMotion()
  const [n, setN] = useState(reduceMotion ? text.length : 0)
  useEffect(() => {
    if (reduceMotion) return
    let i = 0
    const step = Math.max(1, Math.ceil(text.length / 90))
    const id = setInterval(() => {
      i += step
      setN(i)
      onTick && onTick()
      if (i >= text.length) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [text, reduceMotion, onTick])
  return <span>{text.slice(0, n)}</span>
}

export default function KhasOS() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const contextRef = useRef({ previousQuestion: null, previousSources: [] })
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => { scrollToEnd() }, [messages, thinking, scrollToEnd])

  // Cmd/Ctrl+K toggles, Esc closes.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const ask = useCallback((raw) => {
    const q = raw.trim()
    if (!q || thinking) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    const delay = reduceMotion ? 120 : 460 + Math.random() * 320
    setTimeout(() => {
      const res = answerKhasQuestion(q, contextRef.current)
      contextRef.current = { previousQuestion: q, previousSources: res.sources || [] }
      setMessages((m) => [...m, { role: 'assistant', text: res.text, sources: res.sources || [] }])
      setThinking(false)
    }, delay)
  }, [reduceMotion, thinking])

  return (
    <>
      {/* Command orb / AI-core trigger */}
      <motion.button
        type="button"
        className={styles.orb}
        aria-label={open ? 'Close KhasOS assistant' : 'Open KhasOS assistant'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className={styles.orbCore} data-open={open} aria-hidden="true">
          {!reduceMotion && (
            <>
              <span className={styles.orbRing} />
              <span className={`${styles.orbRing} ${styles.orbRing2}`} />
              <span className={styles.orbSat} />
            </>
          )}
        </span>
        <span className={styles.orbLabel}>{open ? 'Close' : 'Ask KhasOS'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            role="dialog"
            aria-label="KhasOS assistant"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className={styles.head}>
              <div className={styles.headId}>
                <span className={styles.headOrb} aria-hidden="true" />
                <div>
                  <strong>KhasOS</strong>
                  <small>Local agent · grounded on Khas&rsquo;s work</small>
                </div>
              </div>
              <div className={styles.headMeta}>
                <span className={styles.online}><i /> online</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close">✕</button>
              </div>
            </header>

            <div className={styles.log} ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? styles.rowUser : styles.rowBot}>
                  <div className={m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>
                    {m.role === 'assistant' && !m.instant
                      ? <Typewriter text={m.text} onTick={scrollToEnd} />
                      : m.text}
                    {m.sources && m.sources.length ? (
                      <div className={styles.sources}>
                        {m.sources.map((s) => (
                          <a key={s.href + s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={() => setOpen(false)}>
                            {s.label} <ArrowUpRight />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className={styles.rowBot}>
                  <div className={`${styles.bubbleBot} ${styles.thinking}`}>
                    <i /><i /><i />
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className={styles.prompts}>
                {KHAS_OS_PROMPTS.slice(0, 5).map((p) => (
                  <button type="button" key={p} onClick={() => ask(p)}>{p}</button>
                ))}
              </div>
            )}

            <form
              className={styles.inputBar}
              onSubmit={(e) => { e.preventDefault(); ask(input) }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Khas's work…"
                aria-label="Ask KhasOS"
              />
              <button type="submit" aria-label="Send" disabled={!input.trim() || thinking}>
                <ArrowUpRight />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
