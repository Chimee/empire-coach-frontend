import { useState } from 'react';
import { Form } from 'react-bootstrap';
import LoginInfo from './LoginInfo';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/shared/buttons/button';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { clearRedirectPath } from '../../../app/globalSlice';
import { toast } from 'react-hot-toast';
import { useLoginUserMutation } from "../authApi";
import { EyeSvg } from '../../../svgFiles/EyeSvg';
import { CloseEyeSvg } from '../../../svgFiles/CloseEyeSvg';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const redirectPath = useSelector((state) => state.global.redirectPath);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = credentials;

        if (!email || !password) {
            toast.dismiss();
            toast.error("Please enter both email and password.");
            return;
        }

        try {
            const result = await loginUser(credentials).unwrap();
            console.log(result, "result");

            if (result) {
                const token = result?.data;
                localStorage.setItem("authToken", token);
                dispatch(clearRedirectPath());
                navigate(redirectPath);
            } else {
                toast.dismiss();
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Login error", error);
            toast.error(error?.data?.message || "An error occurred during login.");
        }
    };


    return (
        <div className='m-0 d-flex '>
            <div className='info_wrapper min-vh-100 '>
                <LoginInfo title="Manage every pickup, drop-off, and driver—from one powerful dashboard." />
            </div>
            <div className='login_wrapper d-flex justify-content-center align-items-center min-vh-100 w-100'>
                <div className='login_form'>

                    <h1>Let’s get those wheels <br /> turning.</h1>
                    <p className='pt-1'><i>Log in to manage job requests, assign drivers, and <br /> keep everything moving</i></p>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 cmn_input">

                            <Form.Control
                                type="email"
                                placeholder="example@gmail.com"
                                name="email"  // Changed to "email" to match state
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 cmn_input ">
                            <div className='position-relative relative_input'>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />

                                <span className='absolute_icon d-inline-block' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSvg /> :
                                        <CloseEyeSvg />}
                                </span>
                            </div>
                        </Form.Group>
                        <div className='d-flex justify-content-between mb-4'>
                            <Form.Check
                                label="Remember me"
                                name="rememberMe"
                                type={'checkbox'}
                                id='remember'
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className='rem_pass'
                            />
                            <Link className='highlight forgetPass' to="/forgot-password">
                                Forgot Password?
                            </Link>
                        </div>
                        <Button
                            label={isLoading ? "Logging in..." : "Login"}
                            size='medium'
                            className="w-100"
                            type="submit"

                        />
                        <Link className='highlight d-block text-center mt-4'>Terms and Conditions.</Link>
                    </Form>
                </div>
            </div>


        </div>
    );
};

export default Login;