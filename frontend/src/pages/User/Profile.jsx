import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { setCredentials } from "../redux/features/auth/authSlice"
import { useProfileMutation, useDeleteProfileMutation } from "../redux/api/usersSlice"
import { useNavigate } from "react-router"
import { logout } from "../redux/features/auth/authSlice"

export default function Profile() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showModal, setShowModal] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {userInfo} = useSelector((state) => state.auth)

    const [updateProfile, {isLoading: updateLoading}] = useProfileMutation()
    const [deleteProfile, {isLoading: deleteLoading}] = useDeleteProfileMutation()

    useEffect(() => {
        setUsername(userInfo.username)
        setEmail(userInfo.email)
    }, [userInfo.email, userInfo.username])

    const submitHandler = async (e) => {
        e.preventDefault()

        if (username === '') {
            toast.error('You require a username')
            return;
        }
        if (email === '') {
            toast.error('You require an email')
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        } else {
            try {
                const res = await updateProfile({
                    _id: username._id,
                    username,
                    email,
                    password
                }).unwrap()
                dispatch(setCredentials({...res}))
                toast.success('Profile updated successfully')
            } catch (err) {
                toast.error(ejjjrr?.data?.message || err.error)
            }
        }
    }

    const deleteUser = async (id) => {
        //setShowModal(false)
        try {
            await deleteProfile(id)
            dispatch(logout())
            toast.success('You have been successfully deleted')
            navigate('/register')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
  return (
    <div className="flex justify-center mt-10">
        <div className="flex flex-col gap-6">
            <h1 className="font-bold text-xl">Update Profile</h1>
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
                <div className="flex justify-between">
                    <button disabled={updateLoading} type='submit' className="mt-5 bg-zinc-800 text-white p-2 rounded">
                        {updateLoading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
            <button 
                disabled={deleteLoading} 
                className="mt-5 bg-red-800 text-white p-2 rounded" 
                onClick={() => 
                    deleteUser(userInfo._id)
                }
            >
                {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
            {/*{
                showModal && (
                    <>
                            <h1>Are you sure you want to delete your account?</h1>
                            <button onClick={() => deleteUser(userInfo._id)}>Delete</button>
                            <button onClick={setShowModal(false)}>Cancel</button>
                    </>
                )
            }*/}
        </div>
    </div>
  )
}
