import { motion } from "motion/react"
import LogoComponent from '@/components/shared/LogoComponent'
type AuthHeaderProp = {
  cardTitle: string,
  cardBaio: string
}
export const AuthHeader = ({cardTitle, cardBaio}: AuthHeaderProp) => {
  return (
    <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12 z-10">
      <LogoComponent />
      <div>
        <h1 className="text-primary text-2xl md:text-[31px] font-medium tracking-tight">
          {cardTitle}
        </h1>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-secondary-foreground text-xs md:text-sm"
          >
            {cardBaio}
          </motion.p>
        </div>
    </div>
  )
}
