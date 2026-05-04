import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "../pages/login/Login"
import { Signup } from "../pages/signup/Signup"
import { Game } from "../pages/game/Game"

export const MainRouter = () => {

    return (
        <Routes>
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/game"   element={<Game />} />
            <Route path="*"       element={<Navigate to="/login" />} />
        </Routes>
    )
}
