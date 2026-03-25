"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SubscriptionsTable from "../components/SubscriptionsTable";
import { AddSubscriptionDialog } from "../components/AddSubscriptionDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";

export function SubscriptionsTemplate() {
  const t = useTranslations("Subscriptions");
  const tDashboard = useTranslations("Dashboard");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <PageTransition>
      <div className="flex flex-col gap-8 pb-10">
        <PageHeader 
          title={t("title")}
          description={tDashboard("subtitle")}
          actionButtons={[
            {
              label: t("add_subscription"),
              icon: Plus,
              onClick: () => setIsAddOpen(true)
            }
          ]}
        />

        <SubscriptionsTable />

        <AddSubscriptionDialog 
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
        />
      </div>
    </PageTransition>
  );
}
