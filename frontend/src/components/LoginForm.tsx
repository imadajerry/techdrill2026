import { useState } from "react";
import axios from "axios";

// ✅ Define type
interface LoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });
  const [passwordError, setPasswordError] = useState("");

  // ✅ Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "password") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else {
        setPasswordError("");
      }
    }
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordError) {
      alert("Please fix validation errors before submitting");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8586/api/auth/login",
        formData
      );

      console.log(res.data);

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
    } catch (error: unknown) {  
      console.error(error);
      if (axios.isAxiosError<{ message?: string }>(error)) {
        alert(error.response?.data?.message || "Login failed");
        return;
      }

      alert("Login failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {passwordError && (
          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
            {passwordError}
          </p>
        )}

        <button type="submit">Login</button>
      </form>

      <div>
        Don't have an account? <a href="/register">Register Here</a>
      </div>
    </div>
  );
};

export default LoginForm;
