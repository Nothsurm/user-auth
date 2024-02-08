import { Outlet } from "react-router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function App() {
  return (
    <>
      <ToastContainer />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  )
}

