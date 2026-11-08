'use client';

import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import { Button } from '@/components/ui/Button';
import type { JobPostFormData } from '@/schemas/job.schema';
import { getErrorMessage } from '@/utils/error';
import { buildDemoJobValues } from '@/utils/recruiter-job-demo';
import { Building2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

export default function JobDemoTools() {
  const { reset } = useFormContext<JobPostFormData>();
  const [filling, setFilling] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const fillForm = async () => {
    setFilling(true);
    try {
      reset(await buildDemoJobValues());
      toast.success('Demo job filled in. Review it and continue.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setFilling(false);
    }
  };

  const prepareCompany = async () => {
    setPreparing(true);
    try {
      await recruiterCompanyApi.prepareDemo();
      toast.success('Demo company is ready: linked, verified and allowed to publish.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPreparing(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 px-3.5 py-2.5">
      <span className="mr-auto text-xs font-bold tracking-wide text-amber-800 uppercase">Demo tools</span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        isLoading={filling}
        leftIcon={<Wand2 className="h-4 w-4" />}
        onClick={fillForm}
      >
        Fill demo job
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        isLoading={preparing}
        leftIcon={<Building2 className="h-4 w-4" />}
        onClick={prepareCompany}
      >
        Prepare demo company
      </Button>
    </div>
  );
}
