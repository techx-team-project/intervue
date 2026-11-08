type FormErrorAlertProps = { message?: string };

export default function FormErrorAlert({ message }: FormErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="border-error/30 bg-error/10 text-error mb-4 rounded-lg border p-2.5 text-center text-xs font-medium"
    >
      {message}
    </div>
  );
}
