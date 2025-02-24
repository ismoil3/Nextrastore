export interface Auth {
    error: string;
    loading: boolean;
    setError: (error: Auth["error"]) => void;
    setLoading: (loading: Auth["loading"]) => void;
    logIn: (objUser: { password: string, userName: "string" }) => Promise<void>,
    registration: (newUser: { userName: string, phoneNumber: string, email: string, password: string, confirmPassword: string }) => Promise<void>,
}