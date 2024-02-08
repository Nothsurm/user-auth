import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials } from "../redux/features/auth/authSlice"
import { toast } from 'react-toastify'
import { useRegisterMutation } from "../redux/api/usersSlice"

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}]= useRegisterMutation()
    const {userInfo} = useSelector((state) => state.auth)

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

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        } else {
            try {
                const res = await register({username, email, password}).unwrap()
                dispatch(setCredentials({...res}))
                navigate(redirect)
                toast.success('User Successfully registered')
            } catch (err) {
                console.log(err);
                toast.error(err.data.message)
            }
        }

    }
  return (
    <div className="flex justify-center mt-10">
        <div className="flex flex-col gap-6">
            <h1 className="font-bold text-xl">Register</h1>
            <form onSubmit={submitHandler}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col">
                    <label htmlFor='name'>
                        Name:
                    </label>
                    <input 
                        type="text" 
                        id='name'
                        placeholder="Enter name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded-lg p-2"
                    />
                    </div>
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
                    <div className="flex flex-col">
                    <label htmlFor='confirm-password'>
                        Confirm Password:
                    </label>
                    <input 
                        type="password" 
                        id='confirm-password'
                        placeholder="******"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border rounded-lg p-2"
                    />
                    </div>
                </div>
                <button disabled={isLoading} type='submit' className="mt-5 bg-zinc-800 text-white p-2 rounded">
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <div className="mt-4">
                Already have an account? {" "}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="hover:underline text-teal-500">
                    Login
                </Link>
            </div>
        </div>
    </div>
  )
}
