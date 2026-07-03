import { useEffect, useState } from 'react'
import styles from '@/styles/AIPortfolio.module.css'

export default function SceneLoader() {
  const [Scene, setScene] = useState(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.matchMedia('(max-width: 760px)').matches

    if (!reduced && !compact) {
      import('./NeuralScene').then((module) => setScene(() => module.default))
    }
  }, [])

  return (
    <div className={styles.sceneShell} aria-hidden="true">
      <div className={styles.sceneFallback}>
        <span /><span /><span />
        <i /><i /><i /><i />
      </div>
      {Scene ? <Scene /> : null}
    </div>
  )
}
