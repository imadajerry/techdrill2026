const LoginForm = () => {
  return (
    <div>
        <h1>Register Page</h1>
        <form action="">
            <label htmlFor="fullname">Name:</label>
            <input type="text" id="fullname"/>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email"/>
            <label htmlFor="email">Password:</label>
            <input type="password" />
            <button>Submit</button>
        </form>
    </div>
  )
}

export default LoginForm