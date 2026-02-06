// Component Imports
import ForgetPassword from '../../components/auth/ForgetPassword'

export const metadata = {
  title: "SDM FORGET PASSWORD",
}; 

const ForgotPasswordV1Page = () => {
  return (
    <div className='flex flex-col justify-center items-center min-bs-[100vh] p-6 h-screen'>
      <ForgetPassword />
    </div>
  )
}

export default ForgotPasswordV1Page
