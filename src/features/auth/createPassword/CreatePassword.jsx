import React, { useState, useEffect } from 'react';
import { ConfirmSvg } from '../../../svgFiles/confirmSvg';
import Form from 'react-bootstrap/Form';
import Button from '../../../components/shared/buttons/button';
import './createPassword.css';
import LoginInfo from '../login/LoginInfo';
import { EyeSvg } from '../../../svgFiles/EyeSvg';
import { CloseEyeSvg } from '../../../svgFiles/CloseEyeSvg';
import { useSearchParams } from 'react-router';
import { jwtDecode } from '../../../helpers/AccessControlUtils';
import { useResetPasswordMutation } from '../../../app/authApi/authApi';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
const CreatePassword = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [decodedData, setDecodedData] = useState(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  console.log(decodedData, "decodedData")
  const [credentials, setCredentials] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCreated, setPasswordCreated] = useState(false);

  useEffect(() => {

    const decoded = jwtDecode(token);
    setDecodedData(decoded);


  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    console.log("api called")

    if (!credentials.password) {
      toast.dismiss();
      toast.error("Please enter your password.");
      return;
    }

    if (!credentials.confirmPassword) {
      toast.dismiss();
      toast.error("Please confirm your password.");
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match!");
      return;
    }

    if (!passwordRegex.test(credentials.password)) {
      toast.dismiss();
      toast.error(
        "Password must be at least 8 characters long, include one uppercase letter, and one special character."
      );
      return;
    }

    if (!decodedData?.email || !decodedData?.id) {
      alert("Invalid reset token.");
      return;
    }

    try {

      console.log("api called #2")

      await resetPassword({
        data: {
          email: decodedData.email,
          userId: decodedData.id,
          password: credentials.password,
        }
      }).unwrap();

      setPasswordCreated(true);
      navigate("/login");
    } catch (err) {
      console.error("Reset password error", err);
      alert(err?.data?.loggedError || err?.data?.message || "Failed to reset password");
    }
  };


  return (
    <div className='m-0 d-flex'>
      <div className='info_wrapper min-vh-100'>
        <LoginInfo title="Lock in your new password and get back to commanding the road." />
      </div>

      <div className='login_wrapper d-flex justify-content-center align-items-center min-vh-100 w-100'>
        {!passwordCreated ? (
          <div className='login_form'>
            <h1>Set a New Password</h1>
            <p className='pt-1'>
              <i>Create a new password. Ensure it differs from previous ones for security</i>
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 cmn_input">
                <div className='position-relative relative_input'>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <span
                    className='absolute_icon d-inline-block'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSvg /> : <CloseEyeSvg />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3 cmn_input">
                <div className='position-relative relative_input'>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <span
                    className='absolute_icon d-inline-block'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeSvg /> : <CloseEyeSvg />}
                  </span>
                </div>
              </Form.Group>

              <Button label={isLoading ? "Please wait..." : "Confirm"} size='medium' className="w-100" type="submit" />
            </Form>
          </div>
        ) : (
          <div className='password_confirmed'>
            <div className='confirm_image text-center'>
              {ConfirmSvg}
            </div>
            <h4>Your password has been successfully created.</h4>
            <h3>Continue to log in to your account.</h3>
            <Button label="Continue" size='medium' className="w-100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePassword;
