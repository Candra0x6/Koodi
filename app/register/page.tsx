import { RegisterForm } from "@/components/auth/register-form";

const RegisterPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <RegisterForm />
    </div>
  );
}
 
export default RegisterPage;
