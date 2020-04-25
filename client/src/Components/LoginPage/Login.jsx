import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateTextFields } from 'materialize-css';
import { useSpring, animated } from 'react-spring';
import './Login.css';
import { signInAction, signUpAction } from '../../Actions/loginAction';

function Login({ signInAction, signUpAction, userSignedUp }) {

    /*
        Detect System's Theme and set app's theme.

        This can be changed later from home screen
    */

    if (window.localStorage.getItem('data-theme')) {
        if (window.localStorage.getItem('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            window.localStorage.setItem('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            window.localStorage.setItem('data-theme', 'light');
        }
    }

    /* 
        Note: Set Theme from system only if the theme is not set by user.
        This usefull after user logs out. The selected theme persists.
    */
    useEffect(() => {
        if (!window.localStorage.getItem('data-theme')) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // System Dark Mode
                document.documentElement.setAttribute('data-theme', 'dark');
                window.localStorage.setItem('data-theme', 'dark');
            } else {
                // System Light Mode
                document.documentElement.setAttribute('data-theme', 'light');
                window.localStorage.setItem('data-theme', 'light');
            }
        }
    }, [])

    // toggle Sign In/ Sign Up form
    const [showSignUp, toggleSignUp] = useState(false);

    // Sign In Form - Hooks
    const [signInEmail, onSignInEmailChange] = useState("");
    const [signInPassword, onSignInPasswordChange] = useState("");

    const onSignInFormSubmit = e => {
        e.preventDefault();

        document.getElementById("sign-in-submit-button").innerHTML = `<div class="preloader-wrapper small active">
                                                                        <div class="spinner-layer spinner-white-only">
                                                                        <div class="circle-clipper left">
                                                                            <div class="circle"></div>
                                                                        </div><div class="gap-patch">
                                                                            <div class="circle"></div>
                                                                        </div><div class="circle-clipper right">
                                                                            <div class="circle"></div>
                                                                        </div>
                                                                        </div>
                                                                      </div>`;

        signInAction({ email: signInEmail, password: signInPassword });
    }

    // Sign Up Form - Hooks
    const [signUpFullname, onSignUpFullnameChange] = useState("");
    const [signUpEmail, onSignUpEmailChange] = useState("");
    const [signUpPassword, onSignUpPasswordChange] = useState("");

    const onSignUpFormSubmit = e => {
        e.preventDefault();

        document.getElementById("sign-up-submit-button").innerHTML = `<div class="preloader-wrapper small active">
                                                                        <div class="spinner-layer spinner-white-only">
                                                                        <div class="circle-clipper left">
                                                                            <div class="circle"></div>
                                                                        </div><div class="gap-patch">
                                                                            <div class="circle"></div>
                                                                        </div><div class="circle-clipper right">
                                                                            <div class="circle"></div>
                                                                        </div>
                                                                        </div>
                                                                      </div>`;

        signUpAction({ fullname: signUpFullname, email: signUpEmail, password: signUpPassword });
    }

    const SignInProps = useSpring({
        opacity: showSignUp ? 0 : 1,
        transform: showSignUp ? 'scale3d(0.95, 0.95, 1)' : 'scale3d(1, 1, 1)'
    })

    const SignUpProps = useSpring({
        from: {
            transform: showSignUp ? "translateY(100%)" : "translateY(100%)",
            opacity: showSignUp ? 0 : 0
        },
        to: {
            transform: showSignUp ? "translateY(0)" : "translateY(100%)",
            opacity: showSignUp ? 1 : 0
        },
        config: { mass: 1, friction: 64, tension: 500 }
    })

    const handleSignUpToggle = () => {
        if (showSignUp === true) {
            // Close Sign Up Form

            onSignUpFullnameChange("");
            document.getElementById('sign-up-fullname').className = "validate sub-text";

            onSignUpEmailChange("");
            document.getElementById('sign-up-email').className = "validate sub-text";

            onSignUpPasswordChange("");
            document.getElementById('sign-up-password').className = "validate sub-text";

            toggleSignUp(false);

            updateTextFields();
        } else {

            // Open Sign Up Form

            onSignInEmailChange("");
            document.getElementById('sign-in-email').className = "validate sub-text";

            onSignInPasswordChange("");
            document.getElementById('sign-in-password').className = "validate sub-text";

            toggleSignUp(true);

            updateTextFields();
        }
    }

    useEffect(() => {
        if (userSignedUp) {
            onSignInEmailChange(signUpEmail);
            toggleSignUp(false)
        }
    }, [signUpEmail, userSignedUp]);

    const [showPassword, togglePasswordVisiblity] = useState(false);

    return (
        <div className="login-wrapper">
            <div className="row no-margin h-100">
                <div className="col m8 s12 h-100 hide-on-med-and-down">
                    <div className="logo-wrapper valign-wrapper h-100">
                        <p className="logo main-text">CHAT</p>
                        <p className="logo-tagline sub-text">Tag line for this application</p>
                    </div>
                </div>
                <div className="col m4 s12 h-100 valign-wrapper">
                    <div className="row no-margin valign-wrapper login-form-wrapper w-100 z-depth-1 surface-1">

                        <animated.form id="sign-in-form" className="col s12" onSubmit={onSignInFormSubmit} style={SignInProps}>

                            <div className="row no-margin hide-on-med-and-up">
                                <div className="input-field col s12 center-align">
                                    <p className="logo main-text">CHAT</p>
                                    <p className="logo-tagline sub-text">Tag line for this application</p>
                                </div>
                            </div>
                            <div className="row no-margin">
                                <div className="input-field col s12">
                                    <input id="sign-in-email" type="email" className="validate sub-text" autoComplete="off" autoCorrect="off" value={signInEmail} onChange={e => onSignInEmailChange(e.target.value)} />
                                    <span id="sign-in-email-helper-text" className="helper-text" data-error="" data-success=""></span>
                                    <label htmlFor="sign-in-email">Email</label>
                                </div>
                            </div>
                            <div className="row no-margin">
                                <div className="input-field col s12" style={{ position: "relative" }}>
                                    <input id="sign-in-password" type={showPassword ? "text" : "password"} className="validate sub-text" autoComplete="off" autoCorrect="off" value={signInPassword} onChange={e => onSignInPasswordChange(e.target.value)} />
                                    <span id="sign-in-password-helper-text" className="helper-text" data-error="" data-success=""></span>
                                    <label htmlFor="sign-in-password">Password</label>
                                    <button type="button" className="btn-flat password-visiblity-toggle" onClick={() => togglePasswordVisiblity(!showPassword)}><span className="material-icons sub-text">{showPassword ? "visibility" : "visibility_off"}</span></button>
                                </div>
                            </div>
                            <div className="row no-margin">
                                <div className="input-field col s12 center-align">
                                    <button type="submit" id="sign-in-submit-button" className="btn waves-effect waves-light surface-2 main-text button-text" form="sign-in-form">Sign In</button>
                                </div>
                            </div>
                            <div className="row no-margin">
                                <div className="input-field col s12 center-align">
                                    <button className="btn-flat sub-text button-text" disabled>Dont have an account?</button>
                                    <button type="button" className="btn-flat waves-effect waves-light main-text button-text" onClick={handleSignUpToggle}>Sign Up</button>
                                </div>
                            </div>
                            <div className="row no-margin">
                                <div className="input-field col s12 center-align">
                                    <button id="sign-in-form-helper-text" type="button" className="btn-flat button-text red-text center-align">Network Error</button>
                                </div>
                            </div>
                        </animated.form>

                        <animated.div id="sign-up-sheet" className="surface-1" style={SignUpProps}>
                            <div className="h-100 valign-wrapper">
                                <form id="sign-up-form" className="col s12" onSubmit={onSignUpFormSubmit}>

                                    <div className="row no-margin hide-on-med-and-up">
                                        <div className="input-field col s12 center-align">
                                            <p className="logo main-text">CHAT</p>
                                            <p className="logo-tagline sub-text">Tag line for this application</p>
                                        </div>
                                    </div>
                                    <div className="row no-margin">
                                        <div className="input-field col s12">
                                            <input id="sign-up-fullname" type="text" className="validate sub-text" autoComplete="off" autoCorrect="off" value={signUpFullname} onChange={e => onSignUpFullnameChange(e.target.value)} />
                                            <span id="sign-up-fullname-helper-text" className="helper-text" data-error="" data-success=""></span>
                                            <label htmlFor="sign-up-fullname">Full Name</label>
                                        </div>
                                    </div>
                                    <div className="row no-margin">
                                        <div className="input-field col s12">
                                            <input id="sign-up-email" type="email" className="validate sub-text" autoComplete="off" autoCorrect="off" value={signUpEmail} onChange={e => onSignUpEmailChange(e.target.value)} />
                                            <span id="sign-up-email-helper-text" className="helper-text" data-error="" data-success=""></span>
                                            <label htmlFor="sign-up-email">Email</label>
                                        </div>
                                    </div>
                                    <div className="row no-margin">
                                        <div className="input-field col s12" style={{ position: 'relative' }}>
                                            <input id="sign-up-password" type={showPassword ? "text" : "password"} className="validate sub-text" autoComplete="off" autoCorrect="off" value={signUpPassword} onChange={e => onSignUpPasswordChange(e.target.value)} />
                                            <span id="sign-up-password-helper-text" className="helper-text" data-error="" data-success=""></span>
                                            <label htmlFor="sign-up-password">Password</label>
                                            <button type="button" className="btn-flat password-visiblity-toggle" onClick={() => togglePasswordVisiblity(!showPassword)}><span className="material-icons sub-text">{showPassword ? "visibility" : "visibility_off"}</span></button>
                                        </div>
                                    </div>
                                    <div className="row no-margin">
                                        <div className="input-field col s12 center-align">
                                            <button id="sign-up-submit-button" type="submit" className="btn waves-effect waves-light surface-2 main-text button-text" form="sign-up-form">Sign Up</button>
                                        </div>
                                    </div>
                                    <div className="row no-margin">
                                        <div className="input-field col s12 center-align">
                                            <button className="btn-flat sub-text button-text" disabled>Already have an account?</button>
                                            <button type="button" className="btn-flat main-text button-text" onClick={handleSignUpToggle}>Sign In</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </animated.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    userSignedUp: state.userSignedUp
})

const mapDispatchToProps = {
    signInAction, signUpAction
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
