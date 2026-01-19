// Mock user database
const USERS_DB = new Map();

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials: any) => {
    await delay(1500); // Simulate network latency

    // Simulate random network error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Network connection failed. Please try again.");
    }

    if (credentials.email === "test@whale.com" && credentials.password === "password123") {
      return {
        user: {
          id: "1",
          name: "Whale Tester",
          email: credentials.email,
        },
        token: "mock-jwt-token-xyz-123",
      };
    }

    throw new Error("Invalid credentials. Hint: use test@whale.com / password123");
  },

  register: async (data: any) => {
    await delay(2000); // Simulate longer processing for registration

    if (Math.random() < 0.1) {
      throw new Error("Server is busy. Please try again later.");
    }

    if (data.email.includes("error")) {
        throw new Error("This email is already in use.");
    }

    return {
      message: "Account created successfully!",
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
      },
      token: "mock-jwt-token-new-user-456",
    };
  },
};
