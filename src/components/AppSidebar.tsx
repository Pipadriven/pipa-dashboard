import { useState } from "react";
import type { ComponentType } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { BrandMark } from "./BrandMark";
import { RedeIcon } from "./RedeIcon";
import {
  LayoutDashboard,
  Megaphone,
  HandCoins,
  Bot,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

interface NavItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  /** Módulo ainda em construção: navega, mas recua na hierarquia e leva selo. */
  preview?: boolean;
}

// Visão Geral e Rede de Parceiros estão no ar com dado real.
// Os outros três são módulos da PIPA ainda não ativados nesta conta: o selo
// os apresenta como novidade, e cada um abre a própria página de módulo.
const mainItems: NavItem[] = [
  { title: "Visão Geral", url: "/", icon: LayoutDashboard },
  { title: "Rede de Parceiros", url: "/rede", icon: RedeIcon },
  { title: "Marketing", url: "/marketing", icon: Megaphone, preview: true },
  { title: "Vendas", url: "/vendas", icon: HandCoins, preview: true },
  { title: "PIPA", url: "/ia", icon: Bot, preview: true },
];

const supportItems: NavItem[] = [
  { title: "Configurações", url: "/settings", icon: Settings },
  { title: "Ajuda", url: "/help", icon: HelpCircle },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  // Never collapse on mobile drawer
  const isCollapsed = isMobile ? false : collapsed;

  const handleLogout = async () => {
    await signOut();
    onNavigate?.();
    navigate('/login', { replace: true });
  };

  const isActive = (url: string) => location.pathname === url;

  const renderItem = (item: NavItem) => (
    <Link
      key={item.title}
      to={item.url}
      onClick={onNavigate}
      title={isCollapsed ? (item.preview ? `${item.title} — novo módulo` : item.title) : undefined}
      aria-label={item.preview ? `${item.title} — novo módulo da PIPA` : undefined}
      className={`sidebar-item ${isActive(item.url) ? "sidebar-item-active" : ""} ${
        item.preview ? "sidebar-item-preview" : ""
      }`}
    >
      <span className="relative shrink-0">
        <item.icon className="h-5 w-5" />
        {/* Recolhida não cabe o selo: um ponto laranja guarda a informação. */}
        {item.preview && isCollapsed && (
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </span>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
      {item.preview && !isCollapsed && (
        <span className="badge-preview ml-auto" aria-hidden="true">
          Novidade
        </span>
      )}
    </Link>
  );

  return (
    <motion.aside
      animate={{ width: isMobile ? 260 : isCollapsed ? 72 : 248 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col shrink-0 overflow-hidden bg-sidebar"
    >
      {/* Logo. Recolhida, marca e botão empilham: lado a lado em 72px o
          flex comprimia a largura da assinatura e ela saía distorcida. */}
      <div
        className={
          isCollapsed
            ? "flex flex-col items-center gap-2 px-2 pt-4 pb-2"
            : "flex items-center justify-between gap-2 px-4 h-16"
        }
      >
        {!isCollapsed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BrandMark size={32} tone="orange" />
          </motion.div>
        ) : (
          <BrandMark size={22} tone="orange" symbolOnly />
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!isCollapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors text-sidebar-foreground hover:text-white hover:bg-white/5"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          {!isCollapsed && (
            <p className="metric-label !text-[10px] !text-sidebar-foreground/60 px-3 mb-2">
              Operação
            </p>
          )}
          <div className="space-y-0.5">{mainItems.map(renderItem)}</div>
        </div>

        <div>
          {!isCollapsed && (
            <p className="metric-label !text-[10px] !text-sidebar-foreground/60 px-3 mb-2">
              Suporte
            </p>
          )}
          <div className="space-y-0.5">
            {supportItems.map(renderItem)}
            <button
              onClick={handleLogout}
              className="sidebar-item w-full text-left"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

    </motion.aside>
  );
}
