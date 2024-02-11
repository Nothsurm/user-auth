import { useParams, useNavigate } from "react-router"
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { useResetPasswordMutation } from "../redux/api/usersSlice"
import { setCredentials } from "../redux/features/auth/authSlice"

export default function ResetPassword() {
    const {resetToken} = useSelector((state => state.auth))
    const { token } = useParams()

    const [password, setPassword] = useState('')

    const [resetPassword, {isLoading}] = useResetPasswordMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitHandler = async (e) => {
      e.preventDefault()
      try {
        const res = await resetPassword({ password: password, token})
        toast.success('Password successfully reset')
        navigate('/login')
        console.log(res);
      } catch (err) {
        console.error(err)
        toast.error('Something went wrong')
      }


    }

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <form onSubmit={submitHandler} className="flex flex-col">
            <h1 className="font-semibold text-xl mb-6">Reset Password</h1>
            <label htmlFor="email">Enter New Password:</label>
            <input 
                type="password" 
                id='password'
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg p-2 mt-2"
            />
            <button disabled={isLoading} type='submit' className="mt-5 bg-zinc-800 text-white p-2 rounded disabled:opacity-70">
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
  </button>
              
        </form>
    </div>
  )
}
