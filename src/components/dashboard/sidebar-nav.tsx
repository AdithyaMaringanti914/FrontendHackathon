'use client';

import {
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  Salad,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Logo } from '../icons/logo';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '../ui/sidebar';
import Link from 'next/link';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/meal-analysis',
    label: 'Meal Analysis',
    icon: Salad,
  },
  {
    href: '/dashboard/health-report',
    label: 'Health Report',
    icon: HeartPulse,
  },
  {
    href: '/dashboard/plan',
    label: 'My Plan',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/yoga',
    label: 'Yoga',
    icon: Wallet,
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: ShieldCheck,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">PoshanAI</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <Link href={link.href}>
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
