import React, { useState } from 'react';
import { ConfirmSvg } from '../../../svgFiles/confirmSvg';
import Form from 'react-bootstrap/Form';
import Button from '../../../components/shared/buttons/button';
import LoginInfo from '../login/LoginInfo';
import { EyeSvg } from '../../../svgFiles/EyeSvg';
import { CloseEyeSvg } from '../../../svgFiles/CloseEyeSvg';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [credentials, setCredentials] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCreated, setPasswordCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match before confirming
    if (credentials.password && credentials.password === credentials.confirmPassword) {
      setPasswordCreated(true);
      // Perform API request or further steps here
    } else {
      toast.error("Passwords do not match!");
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
            <p className='pt-1'><i>Create a new password. Ensure it differs from previous ones for security</i></p>

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

              <Button label="Confirm" size='medium' className="w-100" type="submit" />
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

export default ResetPassword;
