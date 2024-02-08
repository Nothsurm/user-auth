import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './pages/redux/store.js'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>

        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
<Provider store={store}>
    <RouterProvider router={router} />
</Provider>
)
