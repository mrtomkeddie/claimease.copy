'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import { useUser } from '@/contexts/UserContext';
import { UserTier } from '@/lib/constants';
import { ArrowLeft, LogOut, User as UserIcon, FileText, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopMenu() {
  const { user, setUser, getRemainingClaims } = useUser();
  const pathname = usePathname();

  const handleLogout = () => {
    setUser(null);
  }

  const remainingClaims = getRemainingClaims();
  const isProTier = user?.tier === UserTier.PRO;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {pathname !== '/' && (
               <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Claim
                </Link>
              </Button>
            )}
             <Link href="/">
              <ClaimEaseLogo />
            </Link>
          </div>

          <nav className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
                {isProTier ? (
                  <>
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">Pro</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      Standard
                    </span>
                  </>
                )}
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}