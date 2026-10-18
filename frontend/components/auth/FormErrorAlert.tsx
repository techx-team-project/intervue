type FormErrorAlertProps = { message?: string };

export default function FormErrorAlert({ message }: FormErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-center text-xs font-medium text-rose-600"
    >
      {message}
    </div>
  );
}
