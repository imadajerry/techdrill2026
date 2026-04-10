import { useState } from "react";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: ""
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "password") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else if (!/\d/.test(value)) {
        setPasswordError("Password must contain at least one number");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordError) {
      alert("Please fix validation errors before submitting");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8586/api/register",
        formData
      );

      console.log(res.data);
      alert("User registered successfully!");
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError<{ message?: string }>(error)) {
        alert(error.response?.data?.message || "Error");
        return;
      }

      alert("Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} />
      <input name="email" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      {passwordError && (
        <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
          {passwordError}
        </p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegisterForm;
