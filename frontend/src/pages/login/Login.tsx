import { Link } from "react-router";
import Input from "../../components/ui/input/Input";
import style from './Login.module.css'
import LoginButton from "../../components/ui/loginButton/loginButton";
import logo from '../../../../public/img/logo_transparrent_white.svg';

const Login = () => {
  return (
<main className={style["login-page"]}>
      <div className={style["login-container"]}>
        <h2><img src={logo} alt="ReTicket Logo" /> ReTicket</h2>
        <h4>Don't have an account? <Link to="/register">Register</Link></h4>

        <form action="?" method="post" className={style["login-form"]}>

          <Input type="email" name="email" label="Email" />

          <Input type="password" name="password" label="Password" />

          <LoginButton />
        </form>
      </div>
    </main>
  )
}

export default Login;