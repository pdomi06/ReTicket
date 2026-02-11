import { Link } from "react-router";
import Input from "../../components/ui/input/Input";
import style from './Login.module.css'

const Login = () => {
  return (
<main className={style["login-page"]}>
      <div className={style["login-container"]}>
        <h2><img src="../logo_transparrent_white.svg" alt="" /> ReTicket</h2>
        <h4>Don't have an account? <Link to="/register">Register</Link></h4>

        <form action="?" method="post" className={style["login-form"]}>
          <Input type="text" name="username" label="Username" />

          <Input type="email" name="email" label="Email" />

          <Input type="tel" name="telephone" label="Telephone number" />

          <Input type="password" name="password" label="Password" />

          <Input type="password" name="password_confirm" label="Confirm Password" />

          <button type="submit">Login</button>
        </form>
      </div>
    </main>
  )
}

export default Login;