"use client"

import React from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { PageHeader } from "@/components/shared/PageHeader"
import { PageTransition } from "@/components/shared/PageTransition"
import UsersTable from '../components/UsersTable'

export default function UsersTemplate() {
  const t = useTranslations("Dashboard")

  return (
    <PageTransition>
      <div className="space-y-6 pb-10">
        <PageHeader 
          title={t("users_management")}
          description={t("subtitle")}
          actionButtons={[
            {
              label: t("add_user"),
              icon: Plus,
              variant: "default",
              onClick: () => console.log("Add User clicked")
            }
          ]}
        />

        <UsersTable />
      </div>
    </PageTransition>
  )
}
