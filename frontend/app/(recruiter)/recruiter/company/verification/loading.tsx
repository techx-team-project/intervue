import Spinner from '@/components/common/Spinner';

export default function CompanyVerificationLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
