import React from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import AuthHeader from '../components/AuthHeader';

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function CheckoutScreen() {
    return (
        <div>
            <AuthHeader />
            <div style={{paddingTop: '5rem'}}>
                <Elements stripe={promise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    )
}

export default CheckoutScreen
