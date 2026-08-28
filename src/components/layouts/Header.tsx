import { Languages, LogOut, EllipsisVertical, CircleUser } from "lucide-react";
import logo from "@/assets/logo.png";
import { StreakWidget } from "./StreakWidget";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { useAuth, useLogoutMutation } from "@/hooks/useAuth";
import { DictionarySearch } from "../DictionarySearch";
import {
  BookOpen,
  ChartNoAxesColumn,
  FileText,
  Headphones,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  mainClassName: string;
  menuClassName: string;
}
export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    mainClassName: "hidden md:flex",
    menuClassName: "flex md:hidden",
  },
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: BookOpen,
    mainClassName: "hidden md:flex",
    menuClassName: "flex md:hidden",
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    icon: ChartNoAxesColumn,
    mainClassName: "hidden md:flex",
    menuClassName: "flex md:hidden",
  },
  {
    label: "Listening",
    href: "/listening",
    icon: Headphones,
    mainClassName: "hidden lg:flex",
    menuClassName: "flex lg:hidden",
  },
  {
    label: "Notes",
    href: "/notes",
    icon: FileText,
    mainClassName: "hidden xl:flex",
    menuClassName: "flex xl:hidden",
  },
];
export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogoutMutation();
  return (
    <header className="w-full min-h-15 md:min-h-18 border-b border-border">
      <div className="mx-auto flex h-full min-h-15 md:min-h-18 items-center justify-between px-4">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Logo" className="h-8 w-auto md:h-12" />
        </Link>
        <nav className="flex items-center lg:gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`${item.mainClassName} items-center gap-2 rounded-md px-3 lg:py-2 p-1 text-sm font-medium text-tertiary transition-colors hover:bg-muted hover:text-foreground`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                className="flex h-7 w-20 items-center justify-center rounded-md hover:bg-muted bg-yellow-50 text-yellow-700"
                aria-label="Search dictionary"
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:block text-[11px] ml-0.5">
                  {"Look up"}
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80">
              <div className="space-y-3">
                <DictionarySearch />
              </div>
            </PopoverContent>
          </Popover>

          <StreakWidget />

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm font-semibold">
              {user?.user_metadata?.display_name}
            </span>
          </div>
          <Menubar className="border-none shadow-none bg-transparent p-0">
            <MenubarMenu>
              <MenubarTrigger
                className="
        p-0
        rounded-md
        cursor-pointer
        hover:bg-muted
        focus:bg-muted
        data-[state=open]:bg-muted
      "
              >
                <div className="flex items-center gap-2 p-1">
                  <EllipsisVertical
                    size={20}
                    className="text-muted-foreground"
                  />
                </div>
              </MenubarTrigger>

              <MenubarContent
                align="end"
                sideOffset={8}
                className="min-w-56 bg-white text-black"
              >
                <MenubarGroup>
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <MenubarItem
                        key={item.href}
                        onClick={() => navigate(item.href)}
                        className={`${item.menuClassName} cursor-pointer items-center gap-2`}
                      >
                        <Icon size={16} className="text-muted-foreground" />
                        <span>{item.label}</span>
                      </MenubarItem>
                    );
                  })}
                </MenubarGroup>

                <MenubarSeparator />

                <MenubarGroup>
                  <MenubarItem
                    onClick={() => window.location.assign("/profile")}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <CircleUser size={16} className="text-muted-foreground" />

                    <span>Profile</span>
                  </MenubarItem>

                  <MenubarItem
                    onClick={() => logout.mutate()}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <LogOut size={16} className="text-muted-foreground" />

                    <span>Logout</span>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  );
}
