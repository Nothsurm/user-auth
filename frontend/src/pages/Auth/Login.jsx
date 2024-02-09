import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials } from "../redux/features/auth/authSlice"
import { toast } from 'react-toastify'
import { useLoginMutation } from "../redux/api/usersSlice"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, {isLoading}] = useLoginMutation()

  const {userInfo} = useSelector((state => state.auth))

  const {search} = useLocation()
  const searchParameter = new URLSearchParams(search)
  const redirect = searchParameter.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({...res}))
      navigate(redirect)
      toast.success(`User successfully logged in`)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
      console.error(err)
    }
  }

  return (
    <div className="flex justify-center mt-10">
        <div className="flex flex-col gap-6">
            <h1 className="font-bold text-xl">Sign In</h1>
            <form onSubmit={submitHandler}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col">
                    <label htmlFor='email'>
                        Email:
                    </label>
                    <input 
                        type="email" 
                        id='email'
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg p-2"
                    />
                    </div>
                    <div className="flex flex-col">
                    <label htmlFor='password'>
                        Password:
                    </label>
                    <input 
                        type="password" 
                        id='password'
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-lg p-2"
                    />
                    </div>
                </div>
                <button disabled={isLoading} type='submit' className="mt-5 bg-zinc-800 text-white p-2 rounded">
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            <div className="mt-4">
                Don't have an account? {" "}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="hover:underline text-teal-500">
                    Register
                </Link>
            </div>
        </div>
    </div>
  )
}
