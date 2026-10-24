import Spinner from '@/components/common/Spinner';

export default function RecruiterApplicationsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
