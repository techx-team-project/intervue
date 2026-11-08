'use client';

import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/utils/error';
import type { TaxLookupResource } from '@/types/recruiter-company';
import { Building2, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const TAX_CODE_PATTERN = /^\d{10}(-?\d{3})?$/;

interface TaxCodeLinkPanelProps {
  onLink: (taxCode: string) => Promise<unknown>;
}

export default function TaxCodeLinkPanel({ onLink }: TaxCodeLinkPanelProps) {
  const [taxCode, setTaxCode] = useState('');
  const [result, setResult] = useState<TaxLookupResource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const handleChange = (value: string) => {
    setTaxCode(value);
    setResult(null);
    setError(null);
  };

  const handleLookup = async () => {
    const value = taxCode.trim();
    if (!TAX_CODE_PATTERN.test(value)) {
      setError('Mã số thuế gồm 10 số, có thể kèm 3 số chi nhánh (ví dụ 0101234567-001).');
      return;
    }
    setIsLooking(true);
    setError(null);
    try {
      setResult(await recruiterCompanyApi.lookupTax(value));
    } catch (err) {
      setResult(null);
      setError(getErrorMessage(err));
    } finally {
      setIsLooking(false);
    }
  };

  const handleLink = async () => {
    setIsLinking(true);
    try {
      await onLink(taxCode.trim());
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="border-outline-variant space-y-4 rounded-lg border bg-white p-5 shadow-2xs">
      <div>
        <h3 className="text-on-surface text-base font-bold">Liên kết công ty bằng mã số thuế</h3>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          Tên và địa chỉ pháp lý được lấy từ cơ quan thuế. Bạn chỉ cần nhập mã số thuế.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            value={taxCode}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleLookup();
              }
            }}
            placeholder="Ví dụ 0101234567"
            aria-label="Mã số thuế"
            inputMode="numeric"
            error={error ?? undefined}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          isLoading={isLooking}
          onClick={handleLookup}
          leftIcon={<Search className="h-4 w-4" />}
        >
          Tra cứu
        </Button>
      </div>

      {result && (
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-on-surface text-sm font-bold">{result.name}</p>
              <p className="text-on-surface-variant mt-0.5 font-mono text-xs">MST: {result.taxCode}</p>
              {result.address && <p className="text-on-surface-variant mt-1 text-xs">{result.address}</p>}
              {result.existingOnPlatform && (
                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Công ty đã có trên InterVue, bạn sẽ được thêm vào cùng công ty.
                </p>
              )}
            </div>
          </div>
          <Button type="button" isLoading={isLinking} onClick={handleLink}>
            Liên kết công ty này
          </Button>
        </div>
      )}
    </div>
  );
}
