import {
  Menu,
  Search,
  BookOpen,
  ChartNoAxesColumn,
  Headphones,
  FileText,
  LayoutDashboard,
  Languages,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DictionarySearch } from "../DictionarySearch";

const navItems = [
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: BookOpen,
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    icon: ChartNoAxesColumn,
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
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

export default function HeaderMobile() {
  return (
    <header className="w-full min-h-15 md:min-h-18 border-b border-border">
      <div className="flex h-full min-h-15 md:min-h-18 items-center px-4 gap-6">
        <nav className=" items-center gap-1 flex md:hidden justify-between flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-tertiary transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-6 w-6" />
                <span className="md:flex hidden">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-7 md:w-20 sm:w-10 w-6 items-center justify-center rounded-md hover:bg-muted bg-yellow-50 text-yellow-700"
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

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted md:hidden"
            aria-label="Open menu"
            onClick={() => {
              const event = new CustomEvent("toggle-menu");
              window.dispatchEvent(event);
            }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
