import SocialAuthButtons from './SocialAuthButtons';

export default function RecruiterSocialLogin() {
  return (
    <>
      <SocialAuthButtons portal="recruiter" mode="login" />
      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400 italic">Or sign in with email</span>
      </div>
    </>
  );
}
