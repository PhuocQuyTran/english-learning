import { getUserInfo, saveUserInfo } from "@/lib/auth-storage";
import { useLogoutMutation, useAuth } from "@/hooks/useAuth";
import {
  ChartNoAxesColumn,
  ClipboardList,
  Home,
  LogOut,
  BellDot,
  CircleUser,
  MessageSquareMore,
  PanelLeft,
  Hand,
} from "lucide-react";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/api/axios";
import { authEndpoints } from "@/services/endpoints";
import Cookies from "universal-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import CommonDataContext from "@/contexts/CommonDataContext";

export default function Aside() {
  const logout = useLogoutMutation();
  const navigate = useNavigate();
  const { commonData } = useContext(CommonDataContext);
  const [user, setUser] = useState(commonData?.userInfo || getUserInfo());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (isCollapsed) {
      setShowLabels(false);
      return;
    }
    const timer = window.setTimeout(() => setShowLabels(true), 200);
    return () => window.clearTimeout(timer);
  }, [isCollapsed]);

  // Listen for global menu open event (dispatched from mobile header)
  useEffect(() => {
    const handleOpen = () => setIsMenuOpen((prev) => !prev);
    window.addEventListener("toggle-menu", handleOpen);
    return () => window.removeEventListener("toggle-menu", handleOpen);
  }, []);

  const handleLogout = async () => {
    try {
      const cookies = new Cookies();
      const refresh = cookies.get(REFRESH_TOKEN);
      const token = cookies.get(ACCESS_TOKEN);
      await api.post(
        authEndpoints.logout,
        { refresh },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout.mutate();
    }
  };

  const menuItems = [
    { label: "Dashboard", href: "/Dashboard", icon: <Home size={20} /> },
    {
      label: "Vocabulary",
      href: "/vocabulary",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Flashcards",
      href: "/flashcards",
      icon: <ChartNoAxesColumn size={20} />,
    },
    {
      label: "Listening & Shadowing",
      href: "/listening",
      icon: <BellDot size={20} />,
    },
    {
      label: "Notes",
      href: "/notes",
      icon: <CircleUser size={20} />,
    },
    {
      label: "Material's",
      href: "/materials",
      icon: <MessageSquareMore size={20} />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <LogOut size={20} />,
      onClick: handleLogout,
    },
  ];

  const MenuItems = menuItems.map((item) => {
    if (commonData?.userInfo) {
      return <Fragment key={item.label} />;
    }
    const isActive =
      item.href === "/"
        ? window.location.pathname === "/"
        : window.location.href.includes(item.href);
    return (
      <div
        key={item.label}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (item.onClick) {
            item.onClick();
            return;
          }
          navigate(item.href);
        }}
        className={`cursor-pointer flex items-center text-base gap-2 h-10 px-3 rounded-[6px] ${isActive ? "font-medium bg-white/20 text-primary-foreground" : "text-[#D1D5DB]"} hover:bg-white/30 hover:shadow ${!showLabels ? "justify-center" : ""}`}
        title={!showLabels ? item.label : ""}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center ${isActive ? "text-white" : "text-[#D1D5DB]"}`}
        >
          {item.icon}
        </span>
        {showLabels && (
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {item.label}
          </span>
        )}
      </div>
    );
  });

  useEffect(() => {
    if (commonData?.userInfo && commonData?.userInfo !== user) {
      setUser(commonData?.userInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonData?.userInfo]);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm z-11 md:hidden transition-all",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <aside
        className={cn(
          "flex flex-col bg-neutral py-5 px-2 h-screen top-0 md:h-[calc(100vh-72px)] z-20 fixed md:relative transition-all",
          isMenuOpen ? "left-0" : "-left-75 md:left-0",
          isCollapsed ? "md:w-20" : "w-75 md:w-64",
        )}
      >
        <nav className="flex w-full flex-1 flex-col gap-1 text-tertiary">
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden h-10 w-full items-center gap-2 rounded-[6px] px-3 text-base text-tertiary! hover:bg-white/30 hover:shadow transition-colors md:flex",
              showLabels ? "justify-end" : "justify-center",
            )}
            title={isCollapsed ? "Expand menu" : "Collapse menu"}
            aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          >
            <span className="flex h-5 w-5 items-center justify-center text-[#D1D5DB]">
              <PanelLeft size={20} />
            </span>
          </Button>
          {MenuItems}
        </nav>
      </aside>
    </>
  );
}
