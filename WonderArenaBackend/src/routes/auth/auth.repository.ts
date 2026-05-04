import { SupabaseClient } from "../../clients/AuthClient"

const createUser = async ({ email, password }: { email: string, password: string }) => {
    const { data, error } = await SupabaseClient.auth.signUp({ email, password })
    if (error) console.log(error)
    return {
        id: data.user?.id,
        accessToken: data.session?.access_token
    }
}

const loginUser = async ({ email, password }: { email: string, password: string }) => {
    const { data, error } = await SupabaseClient.auth.signInWithPassword({ email, password })
    if (error || !data.session?.access_token) {
        throw new Error(error?.message ?? "Invalid credentials :((")
    }

    return {
        accessToken: data.session.access_token
    }
}


export default { createUser, loginUser }
