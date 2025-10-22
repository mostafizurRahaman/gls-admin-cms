"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  Users,
  FileText,
  LayoutDashboard,
  Bell,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import IcoLogo from "@/assets/icons/ico-logo";

// Define navigation item types
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
      },
      {
        title: "Categories Addons",
        href: "/categories-addons",
      },
      {
        title: "Services",
        href: "/services",
      },
      {
        title: "Services Addons",
        href: "/services-addons",
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null); // Close any open dropdowns when toggling mobile menu
  };

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
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
              <div key={item.title} className="relative group">
                {item.subItems ? (
                  // Dropdown Menu
                  <div className="relative">
                    <button
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onMouseEnter={() => setOpenDropdown(item.title)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.title}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown Content */}
                    {openDropdown === item.title && (
                      <div
                        className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-background border border-border"
                        onMouseEnter={() => setOpenDropdown(item.title)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="py-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <div className="font-medium">{subItem.title}</div>
                              {subItem.description && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Single Link
                  <Link
                    href={item.href!}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions (Desktop) */}
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

              {/* User Dropdown */}
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
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
                  // Dropdown in Mobile
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Dropdown Content */}
                    {openDropdown === item.title && (
                      <div className="pl-4 space-y-1 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            onClick={closeMobileMenu}
                            className="block px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <div className="font-medium">{subItem.title}</div>
                            {subItem.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {subItem.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Single Link in Mobile
                  <Link
                    href={item.href!}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Actions */}
            <hr className="my-2 border-border" />
            <div className="flex items-center space-x-2 px-3 py-2 rounded-md">
              <ThemeToggle />
              <span className="text-sm font-medium">Theme</span>
            </div>
            <Link
              href="/profile"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/notifications"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
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
