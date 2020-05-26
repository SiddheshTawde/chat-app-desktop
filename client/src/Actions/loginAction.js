import axios from 'axios';
import { updateTextFields } from 'materialize-css';
import { SIGN_IN, SIGN_UP } from '../Actions/actionTypes';

const fadeOutTime = 6000;

export const signInAction = ({ email, password }, history) => disptach => {
    // if input are empty
    if (email === "" || password === "") {
        document.getElementById("sign-in-submit-button").innerHTML = "Sign In";
        if (email === "") {
            document.getElementById('sign-in-email-helper-text').setAttribute("data-error", "Cannot be empty")
            document.getElementById('sign-in-email').classList.add('invalid');
        }

        if (password === "") {
            document.getElementById('sign-in-password-helper-text').setAttribute("data-error", "Cannot be empty")
            document.getElementById('sign-in-password').classList.add('invalid');
        }
    } else if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email) === false) {
        document.getElementById("sign-in-submit-button").innerHTML = "Sign In";
        document.getElementById('sign-in-email-helper-text').setAttribute("data-error", "Invalid email address")
        document.getElementById('sign-in-email').classList.add('invalid');
    } else {
        axios.post('/signin', { email, password })
            .then(res => {
                if (res.data.serverResponse === 'success') {
                    document.getElementById("sign-in-submit-button").innerHTML = "Sign In";

                    disptach({
                        type: SIGN_IN
                    })
                    localStorage.setItem("sessionID", res.data.sessionID)
                    // history.push('/')
                } else {
                    document.getElementById("sign-in-submit-button").innerHTML = "Sign In"
                    if (res.data.serverResponse === 'Empty Inputs') {
                        if (email === "") {
                            document.getElementById('sign-in-email-helper-text').setAttribute("data-error", "Cannot be empty")
                            document.getElementById('sign-in-email').classList.add('invalid');
                        }

                        if (password === "") {
                            document.getElementById('sign-in-password-helper-text').setAttribute("data-error", "Cannot be empty")
                            document.getElementById('sign-in-password').classList.add('invalid');
                        }
                    } else if (res.data.serverResponse === 'Invalid Email') {

                        document.getElementById('sign-in-email-helper-text').setAttribute("data-error", "Invalid email address")
                        document.getElementById('sign-in-email').classList.add('invalid');

                    } else if (res.data.serverResponse === 'User does not exist') {

                        document.getElementById('sign-in-email-helper-text').setAttribute("data-error", "User does not exists")
                        document.getElementById('sign-in-email').classList.add('invalid');

                    } else if (res.data.serverResponse === 'Incorrect Password') {

                        document.getElementById('sign-in-password-helper-text').setAttribute("data-error", "Incorrect Password")
                        document.getElementById('sign-in-password').classList.add('invalid');

                    } else {
                        document.getElementById("sign-in-form-helper-text").innerHTML = "Server Error. <br /> Please Try again later.";
                        document.getElementById("sign-in-form-helper-text").classList.add("red-text");
                        document.getElementById("sign-in-form-helper-text").style.opacity = 1;

                        setTimeout(() => {
                            document.getElementById("sign-in-form-helper-text").innerHTML = "";
                            document.getElementById("sign-in-form-helper-text").classList.remove("red-text");
                            document.getElementById("sign-in-form-helper-text").style.opacity = 0;
                        }, fadeOutTime);
                    }
                }
            })
            .catch(err => {

                document.getElementById("sign-in-submit-button").innerHTML = "Sign In";
                document.getElementById("sign-in-form-helper-text").innerHTML = "Network Error in connecting to our services. <br /> Please Try again later.";
                document.getElementById("sign-in-form-helper-text").classList.add("red-text");
                document.getElementById("sign-in-form-helper-text").style.opacity = 1;

                setTimeout(() => {
                    document.getElementById("sign-in-form-helper-text").innerHTML = "";
                    document.getElementById("sign-in-form-helper-text").classList.remove("red-text");
                    document.getElementById("sign-in-form-helper-text").style.opacity = 0;
                }, fadeOutTime);
            })
    }

    // User does not Exist

    // Incorrect Password
}

export const signUpAction = ({ fullname, email, password }) => disptach => {
    if (fullname === "" || email === "" || password === "") {

        document.getElementById("sign-up-submit-button").innerHTML = "Sign Up";
        // inputs are empty
        if (fullname === "") {
            document.getElementById('sign-up-fullname-helper-text').setAttribute("data-error", "Cannot be empty")
            document.getElementById('sign-up-fullname').classList.add('invalid');
        }

        if (email === "") {
            document.getElementById('sign-up-email-helper-text').setAttribute("data-error", "Cannot be empty")
            document.getElementById('sign-up-email').classList.add('invalid');
        }

        if (password === "") {
            document.getElementById('sign-up-password-helper-text').setAttribute("data-error", "Cannot be empty")
            document.getElementById('sign-up-password').classList.add('invalid');
        }
    } else if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email) === false) {
        document.getElementById("sign-up-submit-button").innerHTML = "Sign Up";
        document.getElementById('sign-up-email-helper-text').setAttribute("data-error", "Invalid email address")
        document.getElementById('sign-up-email').classList.add('invalid');
    } else {
        // post 
        axios.post('/signup', { fullname, email, password })
            .then(res => {
                document.getElementById("sign-up-submit-button").innerHTML = "Sign Up";
                if (res.data.serverResponse === 'success') {
                    // User created Successfully

                    document.getElementById('sign-in-email').value = email;
                    document.getElementById('sign-in-email').className = "validate valid grey-text text-lighten-4";

                    document.getElementById('sign-in-password').value = "";
                    document.getElementById('sign-in-password').className = "validate grey-text text-lighten-4";


                    document.getElementById('sign-up-fullname').value = "";
                    document.getElementById('sign-up-fullname').className = "validate grey-text text-lighten-4";

                    document.getElementById('sign-up-email').value = "";
                    document.getElementById('sign-up-email').className = "validate grey-text text-lighten-4";

                    document.getElementById('sign-up-password').value = "";
                    document.getElementById('sign-up-password').className = "validate grey-text text-lighten-4";

                    updateTextFields();

                    document.getElementById("sign-in-form-helper-text").innerHTML = "User created. <br /> Please Sign In to continue.";
                    document.getElementById("sign-in-form-helper-text").classList.add("green-text");
                    document.getElementById("sign-in-form-helper-text").style.opacity = 1;

                    setTimeout(() => {
                        document.getElementById("sign-in-form-helper-text").innerHTML = "";
                        document.getElementById("sign-in-form-helper-text").classList.remove("green-text");
                        document.getElementById("sign-in-form-helper-text").style.opacity = 0;
                    }, fadeOutTime);

                    // close Sign Up form
                    disptach({
                        type: SIGN_UP
                    })

                    // toast({ html: "Sign Up Successful", classes: "grey lighten-4 green-text text-accent-4", displayLength: Infinity })
                } else if (res.data.serverResponse === 'User Exists') {
                    // Email address is already is use
                    document.getElementById('sign-up-email-helper-text').setAttribute("data-error", "Email address is already in use")
                    document.getElementById('sign-up-email').classList.add('invalid');
                } else if (res.data.serverResponse === 'Invalid Email') {
                    // Invalid email address
                    document.getElementById('sign-up-email-helper-text').setAttribute("data-error", "Invalid email address")
                    document.getElementById('sign-up-email').classList.add('invalid');
                } else if (res.data.serverResponse === 'Empty Inputs') {
                    // inputs are empty
                    if (fullname === "") {
                        document.getElementById('sign-up-fullname-helper-text').setAttribute("data-error", "Cannot be empty")
                        document.getElementById('sign-up-fullname').classList.add('invalid');
                    }

                    if (email === "") {
                        document.getElementById('sign-up-email-helper-text').setAttribute("data-error", "Cannot be empty")
                        document.getElementById('sign-up-email').classList.add('invalid');
                    }

                    if (password === "") {
                        document.getElementById('sign-up-password-helper-text').setAttribute("data-error", "Cannot be empty")
                        document.getElementById('sign-up-password').classList.add('invalid');
                    }
                } else {
                    document.getElementById("sign-in-form-helper-text").innerHTML = "Server Error. <br /> Please Try again later.";
                    document.getElementById("sign-in-form-helper-text").classList.add("red-text");
                    document.getElementById("sign-in-form-helper-text").style.opacity = 1;

                    setTimeout(() => {
                        document.getElementById("sign-in-form-helper-text").innerHTML = "";
                        document.getElementById("sign-in-form-helper-text").classList.remove("red-text");
                        document.getElementById("sign-in-form-helper-text").style.opacity = 0;
                    }, fadeOutTime);
                }
            })
            .catch(err => {
                document.getElementById("sign-up-submit-button").innerHTML = "Sign Up";
                document.getElementById("sign-in-form-helper-text").innerHTML = "Network Error in connecting to our services. <br /> Please Try again later.";
                document.getElementById("sign-in-form-helper-text").classList.add("red-text");
                document.getElementById("sign-in-form-helper-text").style.opacity = 1;

                setTimeout(() => {
                    document.getElementById("sign-in-form-helper-text").innerHTML = "";
                    document.getElementById("sign-in-form-helper-text").classList.remove("red-text");
                    document.getElementById("sign-in-form-helper-text").style.opacity = 0;
                }, fadeOutTime);
            })
    }

}
