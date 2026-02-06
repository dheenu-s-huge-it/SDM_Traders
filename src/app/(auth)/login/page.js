// Component Imports
import LoginV1 from '../../components/auth/Login'

export const metadata = {
  title: "SDM LOGIN",
}; 

const LoginV1Page = () => {
  return (
    <div className='flex flex-col justify-center items-center min-bs-[100vh] p-6  h-screen'>
      <LoginV1 />
    </div>
  )
}

export default LoginV1Page
