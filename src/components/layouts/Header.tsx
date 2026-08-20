import {
  Search,
  BookOpen,
  Headphones,
  FileText,
  LayoutDashboard,
  LogOut,
  EllipsisVertical,
  CircleUser,
  Languages,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { logout } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { DictionarySearch } from "../DictionarySearch";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: BookOpen,
  },
  {
    label: "Listening",
    href: "/listening",
    icon: Headphones,
  },
  {
    label: "Notes",
    href: "/notes",
    icon: FileText,
  },
];

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full min-h-15 md:min-h-18 border-b border-border">
      <div className="mx-auto flex h-full min-h-15 md:min-h-18 items-center justify-between px-4">
        <Link to="/" className="shrink-0">
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="h-8 w-auto md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-tertiary transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-7 w-20 items-center justify-center rounded-md hover:bg-muted bg-yellow-50 text-yellow-700"
                aria-label="Search dictionary"
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:block text-[11px] ml-0.5">
                  {"Look up"}
                </span>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-80">
              <div className="space-y-3">
                <DictionarySearch />
              </div>
            </PopoverContent>
          </Popover>

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
                    className="hidden sm:block text-muted-foreground"
                  />
                </div>
              </MenubarTrigger>

              <MenubarContent
                align="end"
                sideOffset={8}
                className="min-w-56 bg-white text-black md:block hidden"
              >
                <MenubarGroup>
                  <MenubarItem
                    onClick={() => window.location.assign("/profile")}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <CircleUser size={16} className="text-muted-foreground" />

                    <span>Profile</span>
                  </MenubarItem>

                  <MenubarItem
                    onClick={() => logout()}
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
