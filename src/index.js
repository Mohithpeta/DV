import React from 'react'
import Navbar from "./components/HomePage/Navbar"
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom"
import Navbar from './components/HomePage/Navbar'


const App = () => {
  return (
    <div>
      
    </div>
  )
}

const router = createBrowserRouter([
    {
        path: "/",
        element:<Navbar />,
    }
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)

export default App
