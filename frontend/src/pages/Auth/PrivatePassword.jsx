import { Navigate, Outlet } from "react-router"
import { useSelector } from "react-redux"

export default function PrivatePassword() {
    const {resetToken} = useSelector((state) => state.auth)
    return resetToken ? <Outlet /> : <Navigate to='/login' replace />
}
