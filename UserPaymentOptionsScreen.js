import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CardSetupForm from '../components/CardSetupForm';
import UserCardListItem from '../components/UserCardListItem';
import AuthHeader from '../components/AuthHeader';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function UserPaymentOptionsScreen() {

    const [cards, setCards] = useState([])
    const [defaultCardId, setDefaultCardId] = useState('')
    const [count, setCount] = useState(1)

    useEffect(() => {
        axios.get(`/api/users/get_user_cards/`)
        .then(res => {
        //   console.log(res.data)
          setCards(res.data.data);
          console.log(res.data.data)
        });
    }, [])

    useEffect(() => {
        axios.get(`/api/orders/get_default_card_id/`)
        .then(res => {
        //   console.log(res.data)
          setDefaultCardId(res.data.defaultCardId);
          console.log(res.data)
        });
    }, [count])

    function updateDefault() {
        setCount(count + 1)
    }
    
    return (
        <div>
            <AuthHeader />
            <div style={{paddingTop: '5rem'}}>
                <Elements stripe={stripePromise}>
                    <CardSetupForm />
                </Elements>
                
                <div>
                    <div style={{fontSize: '2rem', marginTop: '4rem'}}>Payment Methods</div>
                    {cards.map(card => (
                        <UserCardListItem key={card.id} card={card} defaultCardId={defaultCardId} updateDefault={updateDefault} />
                        // <UserCardListItem key={card.id} card={card} isDefault={isDefault} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserPaymentOptionsScreen
