import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLogoutMutation } from "../pages/redux/api/usersSlice.js"
import { logout } from "../pages/redux/features/auth/authSlice.js"
import { toast } from 'react-toastify'

export default function Navigation() {
    const {userInfo} = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
            toast.success('User successfully logged out')
        } catch (error) {
            toast.error(`${error.message}`)
            console.error(error)
        }
    }
  return (
    <div>
        <div className="flex flex-row justify-center gap-10">
            <Link to='/' className="hover:underline">
                Home
            </Link>
            
            {userInfo ? (
                <>
                    <div className="text-indigo-700">{userInfo.username}</div>
                    <Link to='/profile' className="hover:underline">Profile</Link>
                    <button 
                        onClick={logoutHandler}
                        className="bg-zinc-800 text-white p-2"
                    >
                        Logout
                    </button>
                </>
                
            ) : (
                <>
                    <Link to='/register' className="hover:underline">
                        Register
                    </Link>
                    <Link to='/login' className="hover:underline">
                        Sign In
                    </Link>
                </>
            )}

            {userInfo && userInfo.isAdmin && (
                <>
                    Admin
                </>
            )}
        </div>
    </div>
  )
}
