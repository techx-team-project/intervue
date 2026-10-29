import { ADMIN_NAV_SECTIONS } from '@/constants/admin-nav';
import { ROUTES } from '@/constants/routes';
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

function allNavItems(): AdminNavItem[] {
  return ADMIN_NAV_SECTIONS.flatMap((section) => flattenItems(section.items));
}

// Nav hrefs nest (/admin/users is a prefix of /admin/users/admins), so a plain
// prefix test lights up both rows. Only the longest match counts as active.
function activeHref(pathname: string): string | undefined {
  return allNavItems()
    .map((item) => item.href)
    .filter((href): href is string => Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`)))
    .sort((left, right) => right.length - left.length)
    .at(0);
}

export function isNavItemActive(href: string | undefined, pathname: string): boolean {
  if (!href) return false;
  return activeHref(pathname) === href;
}

export function hasActiveDescendant(item: AdminNavItem, pathname: string): boolean {
  return flattenItems(item.children ?? []).some((child) => isNavItemActive(child.href, pathname));
}

export function isRouteAvailable(href?: string): boolean {
  if (!href) return false;
  const item = allNavItems().find((navItem) => navItem.href === href);
  return item ? !item.comingSoon : false;
}

export function itemPendingCount(item: AdminNavItem, counts: AdminQueueCounts): number {
  return flattenItems([item]).reduce((total, entry) => total + (entry.queue ? (counts[entry.queue] ?? 0) : 0), 0);
}

export function sectionPendingCount(section: AdminNavSection, counts: AdminQueueCounts): number {
  return section.items.reduce((total, item) => total + itemPendingCount(item, counts), 0);
}

// Routes below a nav entry have no nav item of their own, so their last crumb
// is read off the pathname instead. Keep the labels derivable from the URL
// alone — the page bar renders before any page data is available.
const DYNAMIC_LEAVES: { pattern: RegExp; label: (match: RegExpMatchArray) => string }[] = [
  { pattern: /^\/admin\/users\/admins\/create$/, label: () => 'Create admin' },
  { pattern: /^\/admin\/users\/(\d+)$/, label: (match) => `Account #${match[1]}` },
  { pattern: /^\/admin\/notifications\/([^/]+)$/, label: () => 'Notification details' },
];

function dynamicLeaf(pathname: string): AdminBreadcrumbEntry[] {
  for (const { pattern, label } of DYNAMIC_LEAVES) {
    const match = pathname.match(pattern);
    if (match) return [{ label: label(match) }];
  }
  return [];
}

export function buildAdminBreadcrumb(pathname: string, granted?: AdminPermission[]): AdminBreadcrumbEntry[] {
  const trail: AdminBreadcrumbEntry[] = [{ label: 'Admin', href: ROUTES.ADMIN_DASHBOARD }];

  for (const section of visibleSections(granted)) {
    for (const item of section.items) {
      if (isNavItemActive(item.href, pathname)) {
        if (section.id !== 'overview') trail.push({ label: section.title });
        trail.push({ label: item.label, href: item.href });
        return [...trail, ...dynamicLeaf(pathname)];
      }

      const child = (item.children ?? []).find((entry) => isNavItemActive(entry.href, pathname));
      if (child) {
        trail.push({ label: section.title }, { label: item.label }, { label: child.label, href: child.href });
        return [...trail, ...dynamicLeaf(pathname)];
      }
    }
  }

  return trail;
}
