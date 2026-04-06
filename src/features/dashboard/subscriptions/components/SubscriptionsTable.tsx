"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { 
  UniTable, 
  UniTableColumn,
  ActionCell,
  EditActionButton,
  DeleteActionButton
} from "@/components/shared/uni-table";
import { Subscription } from "../types/subscription.types";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EditSubscriptionDialog } from "./EditSubscriptionDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { truncateId } from "@/lib/utils";

export default function SubscriptionsTable() {
  const t = useTranslations("Subscriptions");
  const tDashboard = useTranslations("Dashboard");
  const { subscriptions, isLoading, deleteSubscription, isDeleting } = useSubscriptions();
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<Subscription | null>(null);
  const [subscriptionToEdit, setSubscriptionToEdit] = React.useState<Subscription | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      active: "outline", // Using outline for active to distinguish
      expired: "destructive",
      inactive: "secondary",
      cancelled: "secondary",
    };
    return (
      <Badge variant={variants[status] || "default"} className="rounded-lg capitalize">
        {t(`status_${status}`)}
      </Badge>
    );
  };

  const columns: UniTableColumn<Subscription>[] = [
    {
      id: "user_name",
      accessorKey: "user_name",
      header: t("user"),
      cell: (value, row) => (
        <span className="font-mono text-xs">
          {(value as string) || truncateId(row.user_id)}
        </span>
      ),
    },
    {
      id: "package_name",
      accessorKey: "package_name",
      header: t("package"),
      cell: (value, row) => (
        <span className="font-mono text-xs">
          {(value as string) || truncateId(row.package_id)}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("status"),
      cell: (value) => getStatusBadge(value as string),
    },
    {
      id: "tokens",
      header: t("tokens"),
      cell: (_, row) => (
        <span className="font-mono text-sm">
          {(row.tokens_used ?? 0).toLocaleString()} / {(row.tokens_limit ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      id: "start_date",
      accessorKey: "start_date",
      header: t("start_date"),
      cell: (value) => (
        <span className="text-xs">
          {value ? format(new Date(value as string), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      id: "end_date",
      accessorKey: "end_date",
      header: t("end_date"),
      cell: (value) => (
        <span className="text-xs">
          {value ? format(new Date(value as string), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      headerClassName: "justify-center",
      cell: (_: any, row: Subscription) => (
        <ActionCell>
          <EditActionButton 
            onClick={() => setSubscriptionToEdit(row)} 
          />
          <DeleteActionButton 
            onClick={() => setSubscriptionToDelete(row)} 
          />
        </ActionCell>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] border border-divider overflow-hidden shadow-sm p-8 flex justify-center">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[32px] border border-divider overflow-hidden shadow-sm">
        <UniTable 
          data={subscriptions} 
          columns={columns} 
        />
      </div>

      <EditSubscriptionDialog 
        subscriptionData={subscriptionToEdit}
        open={!!subscriptionToEdit}
        onOpenChange={(open) => !open && setSubscriptionToEdit(null)}
      />

      <ConfirmDialog 
        open={!!subscriptionToDelete}
        onOpenChange={(open) => !open && setSubscriptionToDelete(null)}
        title={t("delete_subscription")}
        description={t("delete_confirm")}
        onConfirm={async () => {
          if (subscriptionToDelete) {
            await deleteSubscription(subscriptionToDelete.subscription_id);
            setSubscriptionToDelete(null);
          }
        }}
        confirmLabel={tDashboard("delete")}
        cancelLabel={tDashboard("cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
