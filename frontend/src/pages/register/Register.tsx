import { Link } from "react-router";
import Input from "../../components/ui/input/Input";
import style from './Register.module.css'
import Button from "../../components/ui/button/Button";

const Register = () => {
    return (
        <main className={style["register-page"]}>
            <div className={style["register-container"]}>
                <h2><img src="../logo_transparrent_white.svg"/> ReTicket</h2>
                <h4>Already have an account? <Link to="/login">Log in</Link></h4>

                <form action="?" method="post" className={style["register-form"]}>
                    <Input type="text" name="username" label="Username" theme="dark"/>

                    <Input type="email" name="email" label="Email" theme="dark"/>

                    <Input type="tel" name="telephone" label="Telephone number" theme="dark"/>
                    <Input type="password" name="password" label="Password" theme="dark"/>

                    <Input type="password" name="password_confirm" label="Confirm Password" theme="dark"/>

                    <div className={style["checkbox-container"]}>
                        <input type="checkbox" name="checkbox" id="checkbox" required />
                        <label htmlFor="checkbox" className={style["checkbox-label"]}
                        >I have read and I agree to the
                            <Link to="/terms">Terms and Conditions</Link> and
                            <Link to="/privacy">privacy policy</Link>.</label>
                    </div>
                    <Button type="submit" text="Register"/>
                </form>
            </div>
        </main>
    )
}
export default Register;