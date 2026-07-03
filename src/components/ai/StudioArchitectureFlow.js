import { motion, useReducedMotion } from 'framer-motion'
import { Activity, BrainCircuit, Database, Gauge, GitBranch, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import styles from '@/styles/StudioPortfolio.module.css'

const nodes = [
  { title: 'User input', detail: 'intent + context', icon: BrainCircuit },
  { title: 'Router', detail: 'policy + model', icon: GitBranch },
  { title: 'Tool calls', detail: 'typed contracts', icon: Wrench },
  { title: 'Memory', detail: 'retrieval + state', icon: Database },
  { title: 'Eval gate', detail: 'quality + safety', icon: Gauge },
  { title: 'Observability', detail: 'traces + outcomes', icon: Activity },
]

export default function StudioArchitectureFlow() {
  const reduceMotion = useReducedMotion()
  return (
    <Card className={styles.architectureCard}>
      <div className={styles.architectureHeader}><div><Badge variant="outline">Reference architecture</Badge><h3>A production agent loop</h3></div><span><i /> Observable by default</span></div>
      <div className={styles.architectureFlow}>
        {nodes.map(({ title, detail, icon: Icon }, index) => <motion.div className={styles.architectureNode} key={title} initial={reduceMotion ? false : { opacity: 0, y: 24, scale: .96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .5, delay: index * .08, ease: [0.22, 1, 0.36, 1] }}><div><span>0{index + 1}</span><Icon /></div><strong>{title}</strong><small>{detail}</small>{index < nodes.length - 1 ? <div className={styles.architectureConnector}><motion.i initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: .45, delay: .18 + index * .08 }} /></div> : null}</motion.div>)}
      </div>
      <div className={styles.architectureFooter}><span>Failure boundaries at every stage</span><span>Schema-validated interfaces</span><span>Deployment gated by evals</span></div>
    </Card>
  )
}
