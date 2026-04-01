import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  prefix?: string;
  delay?: number;
}

export function StatCard({ title, value, change, icon: Icon, prefix = "", delay = 0 }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground min-w-0">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="text-[11px] sm:text-sm font-medium truncate">{title}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-3">
        <span className="text-lg sm:text-2xl font-bold text-foreground truncate">{prefix}{value}</span>
        <span className={`text-[10px] sm:text-xs ${isPositive ? "badge-success" : "badge-destructive"} whitespace-nowrap`}>
          {isPositive ? "↗" : "↘"} {Math.abs(change)}%
        </span>
      </div>
    </motion.div>
  );
}
