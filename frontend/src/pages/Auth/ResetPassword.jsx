import { useParams, useNavigate } from "react-router"
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { useResetPasswordMutation } from "../redux/api/usersSlice"

export default function ResetPassword() {
    const {resetToken} = useSelector((state => state.auth))
    const { token } = useParams()

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const [resetPassword, {isLoading}] = useResetPasswordMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
        const stringifiedPassword = JSON.stringify(password)
        const res = await resetPassword({ stringifiedPassword, token })
        toast.success('Password successfully reset')
        navigate('/login')
      } catch (err) {
        setLoading(false)
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
            <button disabled={loading} type='submit' className="mt-5 bg-zinc-800 text-white p-2 rounded disabled:opacity-70">
                {loading ? 'Resetting Password...' : 'Reset Password'}
  </button>
              
        </form>
    </div>
  )
}
