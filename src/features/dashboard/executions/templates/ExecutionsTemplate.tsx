"use client"

import React from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition } from "@/components/shared/PageTransition"
import ExecutionsTable from '../components/ExecutionsTable'
import { useExecutions } from '../hooks/useExecutions'
import { motion } from "motion/react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ExecutionsTemplate() {
  const t = useTranslations("Executions")
  const { refetch, isLoading } = useExecutions()

  return (
    <PageTransition>
      <motion.div 
        className="space-y-6 pb-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <PageHeader 
            title={t("title")}
            description={t("executed_at")}
            actionButtons={[
              {
                label: "Refetch",
                icon: RefreshCcw,
                variant: "outline",
                onClick: () => refetch(),
                isLoading: isLoading
              }
            ]}
          />
        </motion.div>

        <motion.div variants={item}>
          <ExecutionsTable />
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
