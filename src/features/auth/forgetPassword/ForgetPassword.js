import React, { useState } from 'react';
import LoginInfo from '../login/LoginInfo';
import Form from 'react-bootstrap/Form';
import Button from '../../../components/shared/buttons/button';
import { toast } from 'react-toastify';
import {useForgotPasswordMutation} from "../authApi";
import {Link, useNavigate} from "react-router-dom";

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            debugger;
            await forgotPassword({ email }).unwrap();
            toast.success("A password reset email has been sent to your email address.");
            setEmail('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Forgot Password Error:", error);
            if (error.status === 400 || error.status === 404) {
                toast.error(error.data.message || "Invalid Email or User not found.");
            } else if (error.data && error.data.message) {
                toast.error(error.data.message);
            }
            else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    };

    return (
           <div className='m-0 d-flex '>
            <div className='info_wrapper min-vh-100 '>
                <LoginInfo  title="Manage every pickup, drop-off, and driver—from one powerful dashboard."/>
            </div>
            <div className='login_wrapper d-flex justify-content-center align-items-center min-vh-100 w-100'>
                    <div className='login_form'>
                      <h1>Forgot Password</h1>
                    <p className='pt-1'><i>Please enter your email to reset the password</i></p>
                        <Form onSubmit={handleSubmit}> {/* Add the form and onSubmit handler */}
                            <Form.Group className="mb-4 cmn_input">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button label="Send" size='medium' className="w-100" type="submit" isLoading={isLoading} /> {/* Submit button */}
                         <span className='d-block text-center mt-4 already_logged'>Already have an account? <Link to='/' className='text-decoration-underline'>Login</Link></span>  
                        </Form>
                    </div>
                </div>
        
           
        </div>
    );
};

export default ForgetPassword;