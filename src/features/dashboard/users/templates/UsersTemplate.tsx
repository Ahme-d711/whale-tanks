"use client"

import React from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition } from "@/components/shared/PageTransition"
import UsersTable from '../components/UsersTable'
import { AddUserDialog } from '../components/AddUserDialog'
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

export default function UsersTemplate() {
  const t = useTranslations("Dashboard")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

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
            title={t("users_management")}
            description={t("subtitle")}
            actionButtons={[
              {
                label: t("add_user"),
                icon: Plus,
                variant: "default",
                onClick: () => setIsAddDialogOpen(true)
              }
            ]}
          />
        </motion.div>

        <motion.div variants={item}>
          <UsersTable />
        </motion.div>

        <AddUserDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </motion.div>
    </PageTransition>
  )
}
