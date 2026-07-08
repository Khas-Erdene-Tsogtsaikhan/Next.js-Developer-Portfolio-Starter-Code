import { motion, useReducedMotion } from 'framer-motion'

export const bootItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: .82, ease: [0.16, 1, 0.3, 1] } },
}

export const bootHeadline = {
  hidden: {},
  visible: { transition: { staggerChildren: .12 } },
}

const bootSequence = {
  hidden: {},
  visible: { transition: { delayChildren: .34, staggerChildren: .105 } },
}

export default function HeroBootSequence({ children, className, style }) {
  const reduceMotion = useReducedMotion()
  return <motion.div className={className} style={style} variants={bootSequence} initial={reduceMotion ? false : 'hidden'} animate="visible">{children}</motion.div>
}
