import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../pages/redux/api/usersSlice.js"
import { logout } from "../pages/redux/features/auth/authSlice.js"

export default function Navigation() {
    const {userInfo} = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginApiCall] = useLoginMutation()
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

            {userInfo && userInfo.isAdmin (
                <>
                    Admin
                </>
            )}
        </div>
    </div>
  )
}
