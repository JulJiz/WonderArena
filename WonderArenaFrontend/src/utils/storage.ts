interface Tokens {
    accessToken: string
}

export const saveTokens = (tokens: Tokens): void => {
    localStorage.setItem("TOKENS", JSON.stringify(tokens))
}

export const getTokens = (): Partial<Tokens> => {
    const result = localStorage.getItem("TOKENS")
    return result ? JSON.parse(result) : {}
}
