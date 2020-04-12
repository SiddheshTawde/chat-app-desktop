import React from 'react';
import { connect } from "react-redux";
import "./Onboarding.css";
import { onboardingUser } from '../../Actions/userAction';

function Onboarding({ onboardingUser, updatePanel }) {

    const handleOnboarding = () => {
        updatePanel("AddUserScreen")
        onboardingUser();
    }

    return (
        <div className="onboarding-overlay-wrapper valign-wrapper">
            <p className="grey-text text-lighten-4">Hi,</p>
            <p className="grey-text text-lighten-4">There's nothing for you here. This is suppose to be your Onboarding.</p>
            <p className="grey-text text-lighten-4">Welcome, by the way.</p>
            <button className="btn-flat button-text grey darken-4 grey-text text-lighten-4 waves-effect waves-light" onClick={handleOnboarding}>Get Started</button>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    onboardingUser: onboardingUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
