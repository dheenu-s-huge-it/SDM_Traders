// Component Imports
import ChangePassword from "../../components/auth/ChangePassword";

export const metadata = {
  title: "SDM CHANGE PASSWORD",
}; 

const ResetPasswordV1Page = () => {

  return (
    <div className="flex flex-col justify-center items-center min-bs-[100dvh] p-6  h-screen">
      <ChangePassword />
    </div>
  );
};

export default ResetPasswordV1Page;
