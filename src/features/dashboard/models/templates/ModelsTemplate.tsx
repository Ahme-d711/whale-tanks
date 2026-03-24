"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ModelsTable from "../components/ModelsTable";
import { AddModelDialog } from "../components/AddModelDialog";

export function ModelsTemplate() {
  const t = useTranslations("AIModels");
  const tDashboard = useTranslations("Dashboard");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-content-primary">
            {t("title")}
          </h1>
          <p className="text-content-tertiary mt-1 text-lg">
            {tDashboard("subtitle")}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl h-12 px-6 text-base font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("add_model")}
        </Button>
      </div>

      <ModelsTable />

      <AddModelDialog 
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />
    </div>
  );
}
