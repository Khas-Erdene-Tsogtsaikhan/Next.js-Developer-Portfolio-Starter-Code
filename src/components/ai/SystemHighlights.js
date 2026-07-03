import { Braces, Database, GitBranch, Radar, Route, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import styles from '@/styles/StudioPortfolio.module.css'

const highlights = [
  { icon: GitBranch, title: 'LLM tool calling', copy: 'Typed tools, explicit contracts, retries, and deterministic fallbacks around agent decisions.' },
  { icon: Route, title: 'Semantic routing', copy: 'Intent classification and embedding-based routing that sends each request to the right workflow.' },
  { icon: ShieldCheck, title: 'RAG evaluation', copy: 'Golden datasets for grounding, citation quality, retrieval relevance, and prompt-injection resistance.' },
  { icon: Radar, title: 'Agent observability', copy: 'Traceable tool calls, intermediate state, latency, failures, and outcome-level evaluation.' },
  { icon: Database, title: 'Product data systems', copy: 'Supabase and Firebase backends for auth, memory, subscriptions, analytics, and growth loops.' },
  { icon: Braces, title: 'Structured outputs', copy: 'JSON Schema validation that turns flexible model reasoning into dependable product behavior.' },
]

export default function SystemHighlights() {
  return <div className={styles.highlightGrid}>{highlights.map(({ icon: Icon, title }, index) => <Card className={styles.highlightCard} key={title}><CardHeader><span>0{index + 1}</span><Icon /><CardTitle>{title}</CardTitle></CardHeader></Card>)}</div>
}
