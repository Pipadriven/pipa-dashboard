import { useState } from "react";
import logoImg from "../assets/logo-pipa.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
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
  Triangle,
} from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const mainItems = [
  { title: "Visão Geral", url: "/", icon: LayoutDashboard },
  { title: "Marketing", url: "/marketing", icon: Megaphone },
  { title: "Vendas", url: "/vendas", icon: HandCoins },
  { title: "PIPA", url: "/ia", icon: Bot },
];

const supportItems = [
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

  const renderItem = (item: typeof mainItems[0]) => (
    <Link
      key={item.title}
      to={item.url}
      onClick={onNavigate}
      className={`sidebar-item ${isActive(item.url) ? "sidebar-item-active" : ""}`}
    >
      <item.icon className="h-5 w-5 shrink-0" />
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
    </Link>
  );

  return (
    <motion.aside
      animate={{ width: isMobile ? 260 : isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col shrink-0 overflow-hidden bg-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <img src={logoImg} alt="PIPA" className="h-8 w-auto" />
            <span style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-lg text-sidebar-foreground">
              <span className="font-bold">PIPA</span><span className="italic font-medium">Driven</span>
            </span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Triangle className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <div className="space-y-0.5">{mainItems.map(renderItem)}</div>
        </div>

        <div>
          {!isCollapsed && (
            <p className="text-[11px] font-semibold uppercase tracking-wider px-3 mb-2 text-muted-foreground/50">
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
