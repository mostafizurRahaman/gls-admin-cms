"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  Users,
  FileText,
  Star,
  LayoutDashboard,
  Bell,
  HelpCircle,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import IcoLogo from "@/assets/icons/ico-logo";

// Types
interface SubNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: SubNavItem[];
}

// Navigation configuration
const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    title: "Sliders",
    icon: <FileText className="w-4 h-4" />,
    subItems: [
      {
        title: "All slider",
        href: "/sliders",
      },
    ],
  },
  {
    title: "Categories",
    icon: <Users className="w-4 h-4" />,
    subItems: [
      {
        title: "Categories",
        href: "/categories",
        description: "Manage website categories",
      },
      {
        title: "Services",
        href: "/services",
        description: "Manage service listings",
      },
      {
        title: "Testimonials",
        href: "/testimonials",
        description: "Customer reviews and feedback",
      },
      {
        title: "Galleries",
        href: "/galleries",
        description: "Manage gallery images",
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    title: "Help",
    href: "/help",
    icon: <HelpCircle className="w-4 h-4" />,
  },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-background border-b border-border sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <IcoLogo className="h-[50px]" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.title)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.subItems ? (
                  <>
                    <button
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground cursor-pointer",
                        openDropdown === item.title &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item.title);
                      }}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {openDropdown === item.title && (
                      <div
                        className="absolute left-0 mt-2 min-w-72 rounded-lg shadow-xl bg-background border border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-2">
                          {item.subItems.map((subItem, index) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className={cn(
                                "block px-5 py-3 text-sm hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200",
                                index === 0 && "rounded-t-lg",
                                index === item.subItems!.length - 1 &&
                                  "rounded-b-lg"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                <div>
                                  <div className="font-medium text-foreground">
                                    {subItem.title}
                                  </div>
                                  {subItem.description && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {subItem.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right-side actions */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <div className="relative group">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === item.title && (
                      <div className="pl-4 space-y-2 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            onClick={closeMobileMenu}
                            className="block px-4 py-3 rounded-md text-base text-foreground hover:bg-accent transition-colors"
                          >
                            {subItem.title === "Testimonials" && (
                              <Star className="w-4 h-4 text-yellow-400 inline-block mr-2" />
                            )}
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex items-center space-x-2 px-3 py-2 rounded-md">
              <ThemeToggle />
              <span className="text-sm font-medium">Theme</span>
            </div>
            <Link
              href="/profile"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 px-3 py-2 text-base hover:bg-accent rounded-md"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/notifications"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 px-3 py-2 text-base hover:bg-accent rounded-md"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
