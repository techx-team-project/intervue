'use client';

import type { RecruiterCartItem } from '@/types/recruiter-cart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemsTableProps {
  items: RecruiterCartItem[];
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function CartItemsTable({
  items,
  isAllSelected,
  onToggleSelectAll,
  onToggleSelect,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsTableProps) {
  return (
    <div className="border-outline-variant overflow-hidden rounded-xl border bg-white shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-outline-variant text-body-sm text-on-surface border-b bg-white font-bold tracking-wider uppercase">
            <tr>
              <th scope="col" className="w-12 py-4 pr-2 pl-5">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="border-outline text-primary h-4.5 w-4.5 cursor-pointer rounded-sm focus:ring-[#00b14f]"
                    aria-label="Select all services"
                  />
                </label>
              </th>
              <th scope="col" className="px-3 py-4">
                SERVICE NAME
              </th>
              <th scope="col" className="px-3 py-4 text-right whitespace-nowrap">
                UNIT PRICE (VND)
              </th>
              <th scope="col" className="px-3 py-4 text-center whitespace-nowrap">
                QUANTITY
              </th>
              <th scope="col" className="px-3 py-4 text-right whitespace-nowrap">
                AMOUNT (VND)
              </th>
              <th scope="col" className="py-4 pr-5 pl-3 text-center whitespace-nowrap">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-outline-variant divide-y">
            {items.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              const isBannerLocked = Boolean(item.adSlotItem || (item.weeks && item.weeks.length > 0));
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${item.selected ? 'bg-emerald-50/20' : 'hover:bg-surface-container-low/50'}`}
                >
                  <td className="py-5 pr-2 pl-5 align-top">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={!!item.selected}
                        onChange={() => onToggleSelect(item.id)}
                        className="border-outline text-primary h-4.5 w-4.5 cursor-pointer rounded-sm focus:ring-[#00b14f]"
                        aria-label={`Select ${item.name}`}
                      />
                    </label>
                  </td>

                  <td className="px-3 py-5 align-top">
                    <div className="max-w-md">
                      <h4 className="text-body-md text-on-surface font-bold tracking-tight uppercase">{item.name}</h4>
                      <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">{item.description}</p>
                      {item.weeks && item.weeks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.weeks.map((week) => (
                            <span
                              key={week}
                              className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                            >
                              Tuần {week}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="text-on-surface px-3 py-5 text-right align-top font-semibold whitespace-nowrap">
                    {item.unitPrice.toLocaleString('vi-VN')}
                  </td>

                  <td className="px-3 py-5 align-top whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <div className="border-outline-variant inline-flex items-center rounded-sm border bg-white">
                        <button
                          type="button"
                          disabled={isBannerLocked || item.quantity <= 1}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high flex h-7 w-7 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-on-surface w-8 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={isBannerLocked}
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high flex h-7 w-7 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {isBannerLocked && (
                        <span className="text-on-surface-variant mt-1 text-[11px]">Cố định theo tuần đã chọn</span>
                      )}
                    </div>
                  </td>

                  <td className="text-primary px-3 py-5 text-right align-top font-bold whitespace-nowrap">
                    {itemTotal.toLocaleString('vi-VN')}
                  </td>

                  <td className="py-5 pr-5 pl-3 text-center align-top whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="cursor-pointer rounded-md p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                      title="Remove from cart"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="divide-outline-variant divide-y md:hidden">
        <div className="bg-surface-container-low/80 flex items-center justify-between px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onToggleSelectAll}
              className="border-outline text-primary h-4.5 w-4.5 cursor-pointer rounded-sm focus:ring-[#00b14f]"
            />
            <span className="text-on-surface text-xs font-bold uppercase">Select all services</span>
          </label>
        </div>

        {items.map((item) => {
          const itemTotal = item.unitPrice * item.quantity;
          const isBannerLocked = Boolean(item.adSlotItem || (item.weeks && item.weeks.length > 0));
          return (
            <div key={item.id} className={`p-4 transition ${item.selected ? 'bg-emerald-50/20' : 'bg-white'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!item.selected}
                  onChange={() => onToggleSelect(item.id)}
                  className="border-outline text-primary mt-1 h-4.5 w-4.5 shrink-0 rounded-sm focus:ring-[#00b14f]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-on-surface text-sm font-bold uppercase">{item.name}</h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-on-surface-variant mt-1 line-clamp-3 text-xs">{item.description}</p>
                  {item.weeks && item.weeks.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {item.weeks.map((week) => (
                        <span
                          key={week}
                          className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800"
                        >
                          Tuần {week}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="border-outline-variant mt-3 flex items-center justify-between border-t pt-2.5">
                    <div>
                      <p className="text-label-sm text-outline">Unit price</p>
                      <p className="text-on-surface text-xs font-semibold">
                        {item.unitPrice.toLocaleString('vi-VN')} VND
                      </p>
                    </div>

                    <div className="border-outline-variant inline-flex items-center rounded-sm border bg-white">
                      <button
                        type="button"
                        disabled={isBannerLocked || item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="bg-surface-container-high text-on-surface-variant flex h-6 w-6 items-center justify-center disabled:opacity-40"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-on-surface w-6 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isBannerLocked}
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="bg-surface-container-high text-on-surface-variant flex h-6 w-6 items-center justify-center disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-label-sm text-outline">Amount</p>
                      <p className="text-primary text-xs font-bold">{itemTotal.toLocaleString('vi-VN')} VND</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
