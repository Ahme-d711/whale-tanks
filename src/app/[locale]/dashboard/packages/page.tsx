import { Metadata } from "next";
import PackagesTemplate from "@/features/dashboard/packages/templates/PackagesTemplate";

export const metadata: Metadata = {
  title: "Packages Management | Whale Tanks",
  description: "Manage subscription packages and limits.",
};

export default function PackagesPage() {
  return <PackagesTemplate />;
}
