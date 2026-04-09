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

  // ✅ Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8586/api/auth/login",
        formData
      );

      console.log(res.data);

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
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

        <button type="submit">Login</button>
      </form>

      <div>
        Don't have an account? <a href="/register">Register Here</a>
      </div>
    </div>
  );
};

export default LoginForm;