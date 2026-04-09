const LoginForm = () => {
  return (
    <div>
        <form action="">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email"/>
            <label htmlFor="email">Password:</label>
            <input type="password" />
            <button>Login</button>
        </form>
        <div>Don't have an account? <a href="/register">Register Here</a></div>
    </div>
  )
}

export default LoginForm