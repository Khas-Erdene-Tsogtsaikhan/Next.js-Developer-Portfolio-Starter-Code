import { useState } from 'react'
import styles from '@/styles/Editorial.module.css'

// Feature image with a graceful mono fallback if the asset is missing,
// plus an optional glass badge overlay. `fit` maps to project.mediaFit so
// phone/screenshot/board shots are contained (shown fully), not cropped.
export default function FeatureMedia({ src, alt, label, badge, fit = 'cover' }) {
  const [failed, setFailed] = useState(!src)
  return (
    <div className={styles.featureMedia} data-fit={fit}>
      {badge ? <span className={styles.featureBadge}>{badge}</span> : null}
      {failed ? (
        <span className={styles.featureMediaFallback}>{label || alt}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  )
}
