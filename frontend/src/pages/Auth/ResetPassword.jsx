import { useParams, useNavigate } from "react-router"
import { toast } from 'react-toastify'
import { useSelector } from "react-redux"
import { useEffect } from "react"

export default function ResetPassword() {
    const {resetToken} = useSelector((state => state.auth))
    const { token } = useParams()

    const navigate = useNavigate()
    
    useEffect(() => {
        if (!resetToken) {
            navigate('/forgotPassword')
            toast.error('You are unauthorized to change the password')
        }
    }, [token])



  return (
    <div>ResetPassword</div>
  )
}
