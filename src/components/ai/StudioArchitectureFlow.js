import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Activity, BrainCircuit, Database, Gauge, GitBranch, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import styles from '@/styles/StudioPortfolio.module.css'

const nodes = [
  { title: 'User input', detail: 'Intent, constraints, and conversation context enter through a typed request boundary.', signal: 'Typed request', proof: 'KhasOS · PM.ai', icon: BrainCircuit },
  { title: 'Semantic router', detail: 'Policy and intent classification choose the correct workflow, model, or retrieval path.', signal: 'Route selected', proof: 'CourseLynx · Curio', icon: GitBranch },
  { title: 'Tool calls', detail: 'Schema-bound tools turn model decisions into inspectable product actions with retries.', signal: 'Contract valid', proof: 'LangGraph · JSON Schema', icon: Wrench },
  { title: 'Memory / RAG', detail: 'Vector retrieval and persisted state ground the response in relevant, attributable context.', signal: 'Context grounded', proof: 'NeuronBook · Chroma', icon: Database },
  { title: 'Eval gate', detail: 'Golden datasets, scoring rules, and safety checks decide whether a release can proceed.', signal: 'Gate passed', proof: 'PrimitiveBench', icon: Gauge },
  { title: 'Observability', detail: 'Traces connect tool calls, latency, failures, and user outcomes for debugging in production.', signal: 'Trace complete', proof: 'OpenTelemetry · CI/CD', icon: Activity },
]

export default function StudioArchitectureFlow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const activeNode = nodes[activeIndex]

  return (
    <Card className={styles.architectureCard}>
      <div className={styles.architectureHeader}>
        <div><Badge variant="outline">Reference architecture</Badge><h3>A production agent trace</h3><p>Follow one request from intent to an observable outcome.</p></div>
        <span><i /> System healthy</span>
      </div>

      <div className={styles.architectureStage}>
        <div className={styles.architectureRail} aria-hidden="true">
          <motion.i initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .5 }} transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }} />
          <motion.b animate={reduceMotion ? undefined : { left: `${(activeIndex / (nodes.length - 1)) * 100}%` }} transition={{ duration: .48, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <div className={styles.architectureFlow}>
          {nodes.map(({ title, signal, icon: Icon }, index) => (
            <motion.button
              type="button"
              className={`${styles.architectureNode} ${activeIndex === index ? styles.architectureNodeActive : ''}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .45 }}
              transition={{ duration: .72, delay: index * .085, ease: [0.16, 1, 0.3, 1] }}
            >
              <div><span>0{index + 1}</span><Icon /></div>
              <strong>{title}</strong>
              <small><i /> {signal}</small>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div className={styles.architectureInspector} key={activeNode.title} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, ease: [0.16, 1, 0.3, 1] }}>
        <div><span>ACTIVE NODE · 0{activeIndex + 1}</span><strong>{activeNode.title}</strong></div>
        <p>{activeNode.detail}</p>
        <small>{activeNode.proof}</small>
      </motion.div>
    </Card>
  )
}
