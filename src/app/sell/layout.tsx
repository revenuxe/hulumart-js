import type { Metadata } from "next";
import styles from "./sell.module.css";

export const metadata: Metadata = {
  title: "Sell Used Electronics, Vehicles, Appliances & Furniture | Hulumart",
  description: "Sell used mobiles, laptops, cars, bikes, scooters, appliances and furniture to Hulumart. Submit your item details for a quick review.",
  keywords: ["sell used mobile phone online India", "sell old laptop for cash", "sell second hand furniture", "sell used car bike scooter", "sell used appliances", "sell used electronics Bengaluru", "Hulumart sell used items"],
  alternates: { canonical: "/sell" },
};

export default function SellLayout({ children }: { children: React.ReactNode }) { return <div className={styles.page}>{children}</div>; }
