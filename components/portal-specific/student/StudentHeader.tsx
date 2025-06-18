"use client";

import Link from "next/link";
import { useAuthContext } from "@/lib/ctx-auth";
import { usePathname, useRouter } from "next/navigation";
import { User, Settings, BookA, Heart, LogOut, Menu } from "lucide-react";
import { useAppContext } from "@/lib/ctx-app";
import { Button } from "@/components/design-system/primitives/Button";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Updated Student Portal Header using Design System
 * Demonstrates consistent styling and portal theming
 *
 * @component
 */
export const StudentHeader = () => {
  const { is_mobile } = useAppContext();
  const authroutes = ["/login", "/register", "/otp"];
  const pathname = usePathname();

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-border"
      )}
      data-portal="student"
    >
      <div className={cn(
        "flex h-16 items-center justify-between",
        is_mobile ? "px-4" : "px-6 lg:px-8"
      )}>
        <HeaderBrand />
        
        <div className="flex items-center space-x-4">
          {!authroutes.some((route) => pathname.startsWith(route)) ? (
            <>
              {!is_mobile && <HeaderNavigation />}
              <StudentProfileMenu />
              {is_mobile && <MobileMenuButton />}
            </>
          ) : (
            <AuthActions />
          )}
        </div>
      </div>
    </header>
  );
};

const HeaderBrand = () => {
  const { is_mobile } = useAppContext();
  
  return (
    <Link href="/student" className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-sm font-bold text-primary-foreground">BI</span>
      </div>
      <h1 className={cn(
        "font-bold text-foreground",
        is_mobile ? "text-lg" : "text-xl"
      )}>
        BetterInternship
      </h1>
    </Link>
  );
};

const HeaderNavigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/student/search", label: "Search Jobs", icon: null },
    { href: "/student/applications", label: "Applications", icon: BookA },
    { href: "/student/saved", label: "Saved", icon: Heart },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Button
            key={item.href}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            portal="student"
            asChild
          >
            <Link href={item.href} className="flex items-center space-x-2">
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

const StudentProfileMenu = () => {
  const { user, is_authenticated, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/student");
  };

  const getInitials = () => {
    if (!user?.full_name) return "U";
    const names = user.full_name.split(" ");
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
    }
    return names[0].charAt(0);
  };

  if (!is_authenticated()) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/student/login">Sign In</Link>
        </Button>
        <Button size="sm" portal="student" asChild>
          <Link href="/student/register">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full"
          portal="student"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.avatar_url} 
              alt={user?.full_name || 'User'} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56" 
        align="end" 
        forceMount
        data-portal="student"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/student/profile" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/student/applications" className="flex items-center">
            <BookA className="mr-2 h-4 w-4" />
            <span>My Applications</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/student/saved" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>Saved Jobs</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AuthActions = () => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/student/login">Sign In</Link>
      </Button>
      <Button size="sm" portal="student" asChild>
        <Link href="/student/register">Get Started</Link>
      </Button>
    </div>
  );
};

const MobileMenuButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle mobile menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default StudentHeader;
