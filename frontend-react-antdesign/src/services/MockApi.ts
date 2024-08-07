
export const getUserLogin = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        const user = localStorage.getItem("user");

        if (!user) {
            return resolve({
                status: 404,
                data: null,
                error: 1,
                message: "No user found in local storage"
            });
        }

        try {
            const { email: storedEmail, password: storedPassword } = JSON.parse(user);
            const success = storedEmail === email && storedPassword === password;

            resolve({
                status: success ? 200 : 401,
                data: success ? { token: "your-login-token" } : null,
                error: success ? 0 : 1,
                message: success ? "Login successful" : "Invalid email or password"
            });
        } catch {
            reject({
                status: 500,
                data: null,
                error: 1,
                message: "Error parsing user data"
            });
        }
    });
}

export const registerUser = (name: string, phone: string, email: string, password: string) => {
    return new Promise((resolve, reject) => {
        const user = localStorage.getItem("user");

        if (user) {
            return resolve({
                status: 409,
                data: null,
                error: 1,
                message: "User already exists"
            });
        }

        try {
            const userData = { name, phone, email, password };
            localStorage.setItem("user", JSON.stringify(userData));

            resolve({
                status: 201,
                data: { email },
                error: 0,
                message: "User registered successfully"
            });
        } catch {
            reject({
                status: 500,
                data: null,
                error: 1,
                message: "Error saving user data"
            });
        }
    });
}