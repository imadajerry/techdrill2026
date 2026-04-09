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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8586/api/auth/register",
        formData
      );

      console.log(res.data);
      alert("User registered successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} />
      <input name="email" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegisterForm;