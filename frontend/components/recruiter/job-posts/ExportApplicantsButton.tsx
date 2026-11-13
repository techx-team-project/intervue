'use client';

import { recruiterApplicationApi } from '@/apiRequest/recruiter-application';
import { Button } from '@/components/ui/Button';
import { REVIEW_STATUS_META } from '@/constants/application-review';
import { downloadCsv, toCsv } from '@/utils/csv';
import { getErrorMessage } from '@/utils/error';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

interface ExportApplicantsButtonProps {
  jobId: number;
  jobTitle: string;
}

export default function ExportApplicantsButton({ jobId, jobTitle }: ExportApplicantsButtonProps) {
  const [busy, setBusy] = useState(false);

  const exportCsv = async () => {
    setBusy(true);
    try {
      const rows: Array<Array<string | number | null | undefined>> = [];
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const result = await recruiterApplicationApi.search({ jobId, page, size: PAGE_SIZE });
        result.items.forEach((item) =>
          rows.push([
            item.candidateName,
            item.candidateEmail,
            REVIEW_STATUS_META[item.status].label,
            item.submittedAt ?? '',
          ]),
        );
        if (page + 1 >= result.totalPages) break;
      }
      if (rows.length === 0) {
        toast.info('This job has no applications to export yet.');
        return;
      }
      const slug =
        jobTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'job';
      downloadCsv(`applicants-${slug}.csv`, toCsv(['Candidate', 'Email', 'Status', 'Submitted at'], rows));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      isLoading={busy}
      leftIcon={<Download className="h-4 w-4" />}
      onClick={exportCsv}
    >
      Export applicants (CSV)
    </Button>
  );
}
