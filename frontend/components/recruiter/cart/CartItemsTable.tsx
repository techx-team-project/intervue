'use client';

import type { RecruiterCartItem } from '@/types/recruiter-cart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemsTableProps {
  items: RecruiterCartItem[];
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-white text-[12px] font-bold tracking-wider text-slate-700 uppercase">
            <tr>
              <th scope="col" className="w-12 py-4 pr-2 pl-5">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="h-4.5 w-4.5 cursor-pointer rounded-sm border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
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

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${item.selected ? 'bg-emerald-50/20' : 'hover:bg-slate-50/50'}`}
                >
                  <td className="py-5 pr-2 pl-5 align-top">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={!!item.selected}
                        onChange={() => onToggleSelect(item.id)}
                        className="h-4.5 w-4.5 cursor-pointer rounded-sm border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                        aria-label={`Select ${item.name}`}
                      />
                    </label>
                  </td>

                  <td className="px-3 py-5 align-top">
                    <div className="max-w-md">
                      <h4 className="text-[14.5px] font-bold tracking-tight text-slate-900 uppercase">{item.name}</h4>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">{item.description}</p>
                    </div>
                  </td>

                  <td className="px-3 py-5 text-right align-top font-semibold whitespace-nowrap text-slate-800">
                    {item.unitPrice.toLocaleString('vi-VN')}
                  </td>

                  <td className="px-3 py-5 align-top whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center rounded-sm border border-slate-200 bg-white">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-5 text-right align-top font-bold whitespace-nowrap text-[#00b14f]">
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
      <div className="divide-y divide-slate-100 md:hidden">
        <div className="flex items-center justify-between bg-slate-50/80 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onToggleSelectAll}
              className="h-4.5 w-4.5 cursor-pointer rounded-sm border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
            />
            <span className="text-xs font-bold text-slate-700 uppercase">Select all services</span>
          </label>
        </div>

        {items.map((item) => {
          const itemTotal = item.unitPrice * item.quantity;
          return (
            <div key={item.id} className={`p-4 transition ${item.selected ? 'bg-emerald-50/20' : 'bg-white'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!item.selected}
                  onChange={() => onToggleSelect(item.id)}
                  className="mt-1 h-4.5 w-4.5 shrink-0 rounded-sm border-slate-300 text-[#00b14f] focus:ring-[#00b14f]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 uppercase">{item.name}</h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-1 line-clamp-3 text-xs text-slate-500">{item.description}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <div>
                      <p className="text-[11px] text-slate-400">Unit price</p>
                      <p className="text-xs font-semibold text-slate-700">
                        {item.unitPrice.toLocaleString('vi-VN')} VND
                      </p>
                    </div>

                    <div className="inline-flex items-center rounded-sm border border-slate-200 bg-white">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center bg-slate-100 text-slate-600 disabled:opacity-40"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-slate-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center bg-slate-100 text-slate-600"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Amount</p>
                      <p className="text-xs font-bold text-[#00b14f]">{itemTotal.toLocaleString('vi-VN')} VND</p>
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
