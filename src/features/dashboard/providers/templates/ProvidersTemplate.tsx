"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProvidersTable from "../components/ProvidersTable";
import { AddProviderDialog } from "../components/AddProviderDialog";

export function ProvidersTemplate() {
  const t = useTranslations("AIProviders");
  const tDashboard = useTranslations("Dashboard");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-content-primary">
            {t("title")}
          </h1>
          <p className="text-content-tertiary mt-2 text-lg font-medium">
            {tDashboard("subtitle")}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="rounded-2xl h-14 px-8 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-white"
        >
          <Plus className="w-5 h-5 mr-2 stroke-3" />
          {t("add_provider")}
        </Button>
      </div>

      <ProvidersTable />

      <AddProviderDialog 
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />
    </div>
  );
}
