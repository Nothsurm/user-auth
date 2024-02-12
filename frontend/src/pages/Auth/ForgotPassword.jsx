import { useState } from "react"
import { useForgotPasswordMutation } from "../redux/api/usersSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { getPasswordResetToken } from "../redux/features/auth/authSlice.js"

export default function ForgotPassword() {
    const [email, setEmail] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [forgotPassword, {isLoading}] = useForgotPasswordMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await forgotPassword({email}).unwrap()
            dispatch(getPasswordResetToken({...res}))
            toast.success(`An email has been sent, please check your inbox`)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
            console.error(err)
        }
    }
  return (
    <div className='min-h-screen flex justify-center items-center'>
        <form onSubmit={submitHandler} className="flex flex-col">
            <h1 className="font-semibold text-xl mb-6">Reset Password</h1>
            <label htmlFor="email">Enter Existing Email:</label>
            <input 
                type="email" 
                id='email'
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-2 mt-2"
            />
            <button disabled={isLoading} type='submit' className="mt-5 bg-zinc-800 text-white p-2 rounded disabled:opacity-70">
                {isLoading ? 'Sending Email...' : 'Send Email'}
            </button>
        </form>
    </div>
  )
}
