import { ArrowUpRight, BrainCircuit, Handshake, Megaphone, Rocket, Store, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import styles from '@/styles/StudioPortfolio.module.css'

const evidence = [
  { icon: Rocket, label: 'Ship', value: 'Products, not prototypes', note: 'Built production apps, benchmark infrastructure, Chrome-extension workflows, and hackathon systems with public artifacts.' },
  { icon: BrainCircuit, label: 'Specialize', value: 'AI agents + LLMOps', note: 'My strongest lane is eval harnesses, structured outputs, RAG/tool-calling reliability, and observable agent workflows.' },
  { icon: Trophy, label: 'Compete', value: '3x wins / 7 hackathons', note: 'Repeatedly shipped under pressure across Cal Hacks, DeveloperWeek-style builds, and applied AI product challenges.' },
  { icon: Megaphone, label: 'Pitch', value: '50+ founders & investors', note: 'I can translate technical work into a business case, product story, and funding narrative.' },
  { icon: Handshake, label: 'Partner', value: 'CalCompute', note: 'PrimitiveBench moved from startup evaluation reports toward public-sector AI infrastructure and benchmark trust.' },
  { icon: Store, label: 'Operate', value: '3 businesses before tech', note: 'The commercial instinct came before the code: I look for users, distribution, pricing, and leverage early.' },
]

export default function OperatorStory() {
  return (
    <div className={styles.operatorLayout}>
      <div className={styles.operatorStatement}>
        <Badge variant="outline">Berkeley ↔ Ulaanbaatar</Badge>
        <h2>I don&apos;t just engineer features. <em>I operate.</em></h2>
        <p>I thrive in zero-to-one environments: find the painful problem, ship the smallest credible product, get it in front of users, and turn what works into distribution or revenue.</p>
        <div className={styles.operatorPrinciples}><span>01 · Own the outcome</span><span>02 · Ship to learn</span><span>03 · Find the business model</span></div>
        <a href="#projects">See the evidence <ArrowUpRight /></a>
      </div>
      <div className={styles.operatorLedger}>
        <div className={styles.ledgerHeader}><span>OPERATING LEDGER</span><span>2025—NOW</span></div>
        {evidence.map(({ icon: Icon, label, value }) => <article key={label}><Icon /><div><span>{label}</span><strong>{value}</strong></div></article>)}
      </div>
    </div>
  )
}
