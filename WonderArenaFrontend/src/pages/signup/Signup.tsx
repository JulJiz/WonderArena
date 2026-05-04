import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../consts/api"

export const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSignup = async () => {
        await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        navigate("/login")
    }

    return (
        <section>
            <h1>🏟 WonderArena</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Registrarse</button>
            <p>Ya tienes cuenta? <a href="/login">Ingresar</a></p>
        </section>
    )
}
