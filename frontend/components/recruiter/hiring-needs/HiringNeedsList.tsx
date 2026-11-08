import Button from '@/components/ui/Button';
import type { HiringNeed } from '@/types/recruiter-hiring-need';
import { describeHiringNeed } from '@/utils/hiring-need';
import { ClipboardList, Plus } from 'lucide-react';
import HiringNeedActions from './HiringNeedActions';

type HiringNeedsListProps = {
  needs: HiringNeed[];
  onAdd: () => void;
  onEdit: (need: HiringNeed) => void;
  onDelete: (need: HiringNeed) => void;
};

export default function HiringNeedsList({ needs, onAdd, onEdit, onDelete }: HiringNeedsListProps) {
  if (needs.length === 0) {
    return (
      <div className="border-outline flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-12 text-center">
        <ClipboardList className="text-outline h-10 w-10" />
        <h2 className="text-on-surface mt-3 text-base font-bold">No hiring needs yet</h2>
        <p className="text-on-surface-variant mt-1 max-w-md text-sm">
          Add the roles you plan to hire for so InterVue can match candidates to each one.
        </p>
        <Button className="mt-5" leftIcon={<Plus className="h-4 w-4" />} onClick={onAdd}>
          Add hiring need
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border-outline-variant hidden rounded-2xl border bg-white shadow-xs lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Hiring needs</caption>
            <thead className="border-outline-variant text-on-surface-variant border-b text-xs font-semibold uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Role
                </th>
                <th scope="col" className="px-5 py-3">
                  Level
                </th>
                <th scope="col" className="px-5 py-3">
                  Hires
                </th>
                <th scope="col" className="px-5 py-3">
                  Hire by
                </th>
                <th scope="col" className="px-5 py-3">
                  Budget
                </th>
                <th scope="col" className="px-5 py-3">
                  Budget source
                </th>
                <th scope="col" className="px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {needs.map((need) => {
                const details = describeHiringNeed(need);
                const label = `${details.role} (${details.level})`;
                return (
                  <tr key={need.id} className="text-on-surface">
                    <th scope="row" className="text-on-surface px-5 py-4 font-semibold">
                      {details.role}
                    </th>
                    <td className="px-5 py-4">{details.level}</td>
                    <td className="px-5 py-4">{need.headcount}</td>
                    <td className="px-5 py-4">{details.hireBy}</td>
                    <td className="px-5 py-4">{details.budget}</td>
                    <td className="px-5 py-4">{details.budgetSource}</td>
                    <td className="px-5 py-4">
                      <HiringNeedActions need={need} label={label} onEdit={onEdit} onDelete={onDelete} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="space-y-3 lg:hidden">
        {needs.map((need) => {
          const details = describeHiringNeed(need);
          const label = `${details.role} (${details.level})`;
          return (
            <li key={need.id} className="border-outline-variant rounded-2xl border bg-white p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-on-surface text-sm font-bold">{details.role}</h2>
                  <p className="text-on-surface-variant mt-0.5 text-xs">
                    {details.level} · {need.headcount} {need.headcount === 1 ? 'hire' : 'hires'}
                  </p>
                </div>
                <HiringNeedActions need={need} label={label} onEdit={onEdit} onDelete={onDelete} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <dt className="text-on-surface-variant">Hire by</dt>
                  <dd className="text-on-surface font-medium">{details.hireBy}</dd>
                </div>
                <div>
                  <dt className="text-on-surface-variant">Budget source</dt>
                  <dd className="text-on-surface font-medium">{details.budgetSource}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-on-surface-variant">Budget</dt>
                  <dd className="text-on-surface font-medium">{details.budget}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </>
  );
}
