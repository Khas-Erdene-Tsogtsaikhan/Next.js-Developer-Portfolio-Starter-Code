import styles from '@/styles/AIPortfolio.module.css'
import { motion, useReducedMotion } from 'framer-motion'

export default function ArchitectureFlow() {
  const reduceMotion = useReducedMotion()
  const nodes = ['User intent', 'Agent router', 'Tool layer', 'Eval gate', 'Observable result']
  return (
    <div className={styles.architecture}>
      <div className={styles.archHeader}><span>LIVE SYSTEM MAP</span><span className={styles.liveDot}>NOMINAL</span></div>
      <div className={styles.flow}>
        {nodes.map((node, index) => (
          <motion.div className={styles.flowItem} key={node} initial={reduceMotion ? false : { opacity: 0, y: 34, scale: .94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .5, delay: index * .08 }}>
            <div className={styles.flowNode}><span>0{index + 1}</span><strong>{node}</strong></div>
            {index < nodes.length - 1 ? <div className={styles.connector}><i /></div> : null}
          </motion.div>
        ))}
      </div>
      <div className={styles.terminal}><span>$ trace.run</span><span>5 stages</span><span>guardrails: active</span><span>latency: 842ms</span></div>
    </div>
  )
}
