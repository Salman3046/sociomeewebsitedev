import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

export default function Signup() {
  const [userData, setUserData] = useState({ code: "", mobile: "" });
  const [otpBody,setOtpBody]=useState({
      mobile : '',
      type : "resetPassword",
      isEmail : false
  })
  const errorRef = useRef(null);
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneFormat = /^[6-9]\d{9}$/;
    if (!userData.mobile) { errorRef.current.classList.remove('d-none'); setError('Please Enter Phone Number !') }
    else if (userData.mobile.length > 10 || userData.mobile.length < 10 || !userData.mobile.toString().match(phoneFormat)) { errorRef.current.classList.remove('d-none'); setError('Please Enter Valid Phone Number ! ') }
    else {
      otpBody.mobile = `${userData.code} ${userData.mobile}`;
      axios.post('https://apiserver.msgmee.com/public/sendOtp', otpBody)
        .then((res) => {
          if (res.data.data?.successResult) {
            navigate("/ForgotPasswordOtp", { state: otpBody })
          }
          else {
            errorRef.current.classList.remove('d-none'); setError(res.data.data?.errorResult==='Not a User' ? 'This phone number is not registered' : res.data.data?.errorResult)
          }
        })
        .catch((err) => {
          console.log(err)

        })
    }
  }

  useEffect(() => {
    axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=c1016d597c494a02aa190877148a5688')
      .then(res => {
        setUserData({ ...userData, code: res.data.calling_code });
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <section className="login-section">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-12 m-auto">
              <div className="login-header-section">
                <div className="logo-sec">
                  <NavLink to="/">
                    <img src="assets/images/logo.png" alt="logo" className="img-fluid" />
                  </NavLink>
                </div>
              </div>
              <div className="login-form">
                <div>
                  <div className="login-title">
                    <h2>Forgot Password</h2>
                  </div>
                  {/* <div className="login-discription">
                            <h4>Please SignUp to your account.</h4>
                        </div> */}
                  <div className="form-sec">
                    <div>
                      <form className="theme-form">
                        <div className="form-group">
                          <label>Enter your Mobile Number</label>
                          <div className="input-block">
                            <input type="number" className="form-control" placeholder="Enter Mobile Number" onChange={(e) => { setUserData({ ...userData, mobile: e.target.value }); errorRef.current.classList.add('d-none') }} onKeyPress={(e) => { e.target.value.length >= 10 && e.preventDefault(); }} />
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B9B9C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon iw-20 ih-20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          </div>
                          <p className="error-input-msg text-center d-none" ref={errorRef}>{error}</p>
                        </div>
                        <p className="notimsg-blk">When you will click on continue,  you will receive a verification code on the mobile number that you have entered.</p>
                        <div className="btn-section">
                          <button className="btn btn-solid btn-lg" onClick={handleSubmit} disabled={userData.mobile.length !== 10 ? true : false}>Send OTP</button>
                        </div>
                      </form>
                      <div className="connect-with">
                        <div className="no-account-blk"><p>Don't have an account? <NavLink to="/SignUP">Create New Account</NavLink></p></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 