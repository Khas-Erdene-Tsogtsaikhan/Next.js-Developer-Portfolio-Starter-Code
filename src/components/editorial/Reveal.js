import { motion, useReducedMotion } from 'framer-motion'

// Editorial reveal: subtle rise + blur clear, staggered when children opt in.
export function Reveal({ children, as = 'div', className, delay = 0, y = 26, amount = 0.25, once = true, ...rest }) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

// Container that staggers its Reveal-like children via variants.
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const riseItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export function StaggerGroup({ children, className, amount = 0.2, once = true, ...rest }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) {
    return <div className={className} {...rest}>{children}</div>
  }
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
