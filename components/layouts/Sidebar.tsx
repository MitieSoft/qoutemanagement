'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShoppingCart,
  Receipt,
  Settings,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Role } from '@/lib/types';

interface SidebarProps {
  userRole?: Role;
}

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.VIEWER],
  },
  {
    href: '/clients',
    label: 'Clients',
    icon: Users,
    roles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.VIEWER],
  },
  {
    href: '/products',
    label: 'Products',
    icon: Package,
    roles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.VIEWER],
  },
  {
    href: '/quotes',
    label: 'Quotes',
    icon: FileText,
    roles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.VIEWER],
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: ShoppingCart,
    roles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.VIEWER],
  },
  {
    href: '/invoices',
    label: 'Invoices',
    icon: Receipt,
    roles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.VIEWER],
  },
  {
    href: '/users',
    label: 'Users',
    icon: Users,
    roles: [Role.ADMIN],
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    roles: [Role.ADMIN],
  },
];

export default function Sidebar({ userRole = Role.ADMIN }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold">Quote Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

