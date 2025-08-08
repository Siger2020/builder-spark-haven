import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user"); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        console.error(
          "Login failed:",
          response.status,
          response.statusText
        );
        setIsLoading(false);
        return false;
      }

      // Safe JSON parsing with error handling
      let data;
      try {
        const responseText = await response.text();
        if (responseText) {
          data = JSON.parse(responseText);
        } else {
          console.error("Empty response from server");
          setIsLoading(false);
          return false;
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        setIsLoading(false);
        return false;
      }

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", data);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.error(
          "Register response not ok:",
          response.status,
          response.statusText,
        );
        return { success: false, error: "خطأ في الاتصال بالخادم" };
      }

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "خطأ في الاتصال بالخادم" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
