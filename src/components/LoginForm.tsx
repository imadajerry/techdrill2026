const LoginForm = () => {
  return (
    <div>
        <h1>Login Page</h1>
        <form action="">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email"/>
            <label htmlFor="email">Password:</label>
            <input type="password" />
            <button>Login</button>
        </form>
        <div>Dont have an account? <a href="/register">Register Here</a></div>
    </div>
  )
}

export default LoginForm