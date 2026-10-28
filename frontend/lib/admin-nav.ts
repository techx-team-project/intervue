import { ADMIN_NAV_SECTIONS } from '@/constants/admin-nav';
import type {
  AdminBreadcrumbEntry,
  AdminNavItem,
  AdminNavSection,
  AdminPermission,
  AdminQueueCounts,
} from '@/types/admin';

// Sub-permissions are modelled but not enforced yet: F-01 item 5 (does an admin
// hold narrower roles?) is still open, so an undefined grant list allows everything.
function canAccess(item: AdminNavItem, granted?: AdminPermission[]): boolean {
  if (!granted || !item.permission) return true;
  return granted.includes(item.permission);
}

function filterItems(items: AdminNavItem[], granted?: AdminPermission[]): AdminNavItem[] {
  return items
    .map((item) => ({ ...item, children: item.children ? filterItems(item.children, granted) : undefined }))
    .filter((item) => canAccess(item, granted) && (item.href || (item.children && item.children.length > 0)));
}

export function visibleSections(granted?: AdminPermission[]): AdminNavSection[] {
  return ADMIN_NAV_SECTIONS.map((section) => ({
    ...section,
    items: filterItems(section.items, granted),
  })).filter((section) => section.items.length > 0);
}

export function flattenItems(items: AdminNavItem[]): AdminNavItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenItems(item.children) : [])]);
}

export function isNavItemActive(href: string | undefined, pathname: string): boolean {
  if (!href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function hasActiveDescendant(item: AdminNavItem, pathname: string): boolean {
  return flattenItems(item.children ?? []).some((child) => isNavItemActive(child.href, pathname));
}

export function isRouteAvailable(href?: string): boolean {
  if (!href) return false;
  const item = ADMIN_NAV_SECTIONS.flatMap((section) => flattenItems(section.items)).find(
    (navItem) => navItem.href === href,
  );
  return item ? !item.comingSoon : false;
}

export function itemPendingCount(item: AdminNavItem, counts: AdminQueueCounts): number {
  return flattenItems([item]).reduce((total, entry) => total + (entry.queue ? (counts[entry.queue] ?? 0) : 0), 0);
}

export function sectionPendingCount(section: AdminNavSection, counts: AdminQueueCounts): number {
  return section.items.reduce((total, item) => total + itemPendingCount(item, counts), 0);
}

export function buildAdminBreadcrumb(pathname: string, granted?: AdminPermission[]): AdminBreadcrumbEntry[] {
  const trail: AdminBreadcrumbEntry[] = [{ label: 'Admin' }];

  for (const section of visibleSections(granted)) {
    for (const item of section.items) {
      if (isNavItemActive(item.href, pathname)) {
        if (section.id !== 'overview') trail.push({ label: section.title });
        trail.push({ label: item.label });
        return trail;
      }

      const child = (item.children ?? []).find((entry) => isNavItemActive(entry.href, pathname));
      if (child) {
        trail.push({ label: section.title }, { label: item.label }, { label: child.label });
        return trail;
      }
    }
  }

  return trail;
}
