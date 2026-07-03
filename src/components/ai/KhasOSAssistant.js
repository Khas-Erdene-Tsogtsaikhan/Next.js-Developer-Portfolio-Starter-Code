import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, Database, MessageSquare, Sparkles, X } from 'lucide-react'
import { answerKhasQuestion, KHAS_OS_PROMPTS } from '@/lib/khas-os'
import styles from '@/styles/KhasOS.module.css'

const greeting = {
  id: 'welcome',
  role: 'assistant',
  text: 'I’m KhasOS — a source-grounded portfolio agent trained on Khas’s projects, resume, technical work, and startup experience. Ask me for a recruiter summary, role fit, project proof, or AI systems breakdown.',
  sources: [{ label: 'Local knowledge base', href: '/#projects' }],
}

function ChatPanel({ onClose, showClose = false }) {
  const [messages, setMessages] = useState([greeting])
  const [input, setInput] = useState('')
  const [stage, setStage] = useState('idle')
  const [contextCount, setContextCount] = useState(0)
  const scrollRef = useRef(null)
  const timerRef = useRef([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, stage])

  useEffect(() => () => timerRef.current.forEach(clearTimeout), [])

  const ask = (question) => {
    const cleanQuestion = question.trim()
    if (!cleanQuestion || !['idle', 'error'].includes(stage)) return
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', text: cleanQuestion }])
    setInput('')
    setStage('routing')
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
    try {
      const previousQuestion = [...messages].reverse().find((message) => message.role === 'user')?.text
      const previousSources = [...messages].reverse().find((message) => message.role === 'assistant' && message.sources?.length)?.sources
      const answer = answerKhasQuestion(cleanQuestion, { previousQuestion, previousSources })
      setContextCount(answer.sources?.length || 0)
      const finish = () => {
        setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: 'assistant', ...answer }])
        setStage('idle')
      }
      if (reduceMotion) {
        finish()
        return
      }
      timerRef.current = [
        setTimeout(() => setStage('retrieving'), 170),
        setTimeout(() => setStage('composing'), 440),
        setTimeout(finish, 760),
      ]
    } catch {
      setStage('error')
    }
  }

  const submit = (event) => {
    event.preventDefault()
    ask(input)
  }

  return (
    <motion.section className={styles.panel} aria-label="KhasOS portfolio assistant" initial={reduceMotion ? false : { opacity: 0, y: 14, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
      <motion.header className={styles.header} initial={reduceMotion ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .42 }}>
        <div className={styles.identity}>
          <span className={styles.avatar}>K</span>
          <div><strong>KhasOS</strong><span>Local portfolio assistant</span></div>
        </div>
        <div className={styles.headerMeta}><i /> Local</div>
        {showClose ? <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close KhasOS"><X /></button> : null}
      </motion.header>

      <motion.div className={styles.assistantIntro} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .13, duration: .45 }}>
        <h2>Ask me about Khas.</h2>
        <p>Grounded in verified project data.</p>
      </motion.div>

      <div className={styles.messages} ref={scrollRef} aria-live="polite">
        {messages.map((message) => (
          <motion.article
            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
          >
            <div className={styles.messageLabel}>{message.role === 'user' ? 'You' : 'KhasOS'}</div>
            <p>{message.text}</p>
            {message.sources?.length ? <div className={styles.sources}>{message.sources.map((source) => <a href={source.href} onClick={showClose ? onClose : undefined} key={`${message.id}-${source.href}`}><Database /> {source.label}</a>)}</div> : null}
          </motion.article>
        ))}
        <AnimatePresence initial={false}>{!['idle', 'error'].includes(stage) ? <motion.div className={styles.loading} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}><span /><span /><span /> {stage === 'routing' ? 'Understanding your question' : stage === 'retrieving' ? `Reading ${contextCount || ''} relevant sources` : 'Writing a grounded answer'}</motion.div> : null}</AnimatePresence>
        {stage === 'error' ? <div className={styles.error}>KhasOS hit a local retrieval error. Try another prompt.</div> : null}
      </div>

      <div className={styles.promptArea}>
        <span>Suggested</span>
        <div className={styles.prompts} aria-label="Suggested prompts">
          {KHAS_OS_PROMPTS.map((prompt) => <motion.button type="button" onClick={() => ask(prompt)} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: .97 }} key={prompt}>{prompt}</motion.button>)}
        </div>
      </div>

      <form className={styles.composer} onSubmit={submit}>
        <label className={styles.srOnly} htmlFor={showClose ? 'khas-os-mobile-input' : 'khas-os-desktop-input'}>Ask KhasOS</label>
        <input id={showClose ? 'khas-os-mobile-input' : 'khas-os-desktop-input'} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Khas…" autoComplete="off" autoFocus={showClose} />
        <button type="submit" disabled={!input.trim() || !['idle', 'error'].includes(stage)} aria-label="Send question"><ArrowUp /></button>
      </form>
      <footer><Sparkles /> Local portfolio assistant grounded in verified project data</footer>
    </motion.section>
  )
}

export default function KhasOSAssistant({ mode = 'desktop' }) {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef(null)
  const wasOpenRef = useRef(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (mode !== 'mobile') return undefined
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode])

  useEffect(() => {
    if (mode !== 'mobile') return undefined
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open && wasOpenRef.current) launcherRef.current?.focus()
    wasOpenRef.current = open
    return () => { document.body.style.overflow = '' }
  }, [mode, open])

  if (mode === 'desktop') return <div className={styles.desktop}><ChatPanel /></div>

  return (
    <div className={styles.mobile}>
      <button className={styles.launcher} ref={launcherRef} type="button" onClick={() => setOpen(true)} aria-label="Open KhasOS portfolio assistant"><MessageSquare /><span><strong>Ask KhasOS</strong><small>Portfolio agent</small></span></button>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button className={styles.backdrop} type="button" aria-label="Close KhasOS" onClick={() => setOpen(false)} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className={styles.sheet} role="dialog" aria-modal="true" aria-label="KhasOS portfolio assistant" initial={reduceMotion ? false : { y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}><div className={styles.sheetHandle} /><ChatPanel showClose onClose={() => setOpen(false)} /></motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
