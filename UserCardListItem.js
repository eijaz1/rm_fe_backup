import React, { useState, useEffect } from 'react'
import axios from 'axios'

function UserCardListItem({ card, defaultCardId, updateDefault }) {

    const [isDefault, setIsDefault] = useState(false)
    // const [updatedDefaultCardId, setUpdatedDefaultCardId] = useState('')
    // var isDefault = false

    // if (card.id)

    //make buttons update 
    //DO LOGIC ON PAGE THEN SEND DATA

    // useEffect(() => {
    //     setUpdatedDefaultCardId(defaultCardId)
    // }, [])

    // useEffect(() => {
    //     if (card.id == updatedDefaultCardId) {
    //         console.log(card.id)
    //         console.log(updatedDefaultCardId)
    //         setIsDefault(true)
    //     }
    // }, [updatedDefaultCardId])

    useEffect(() => {
        if (card.id == defaultCardId) {
            console.log(card.id)
            console.log(defaultCardId)
            setIsDefault(true)
        } else {
            setIsDefault(false)
        }
    }, [defaultCardId])

    function handleMakeDefault() {
        axios.post(`/api/orders/change_default_card/`, {
			cardId: card.id
		})
		  .then(res => {
			  console.log(res.data)
            //   setUpdatedDefaultCardId(res.data.newDefaultCardId)
            updateDefault()
		  });
    }

    function DefaultButton() {
        if (isDefault == true) {
            return (
                <div>
                    <button className="ui disabled button">Default</button>
                </div>
            )
        } else if (isDefault == false) {
            return (
                <div>
                    <button className="ui button" onClick={handleMakeDefault} style={{background: '#00e1ff', color: '#fff'}}>Make default</button>
                </div>
            )
        }
    }

    return (
        // <div style={{marginTop: '2rem'}}>
        //     <p style={{fontWeight: 'bold'}}>{card.brand} ending in {card.last4}</p>
        //     {/* <p></p> */}
        //     <p>Expires: {card.exp_month} / {card.exp_year}</p>
        //     {/* <p>{`cardid ${card.id}`}</p>
        //     <p>{`defaultid ${defaultCardId}`}</p> */}
        //     <DefaultButton />
        //     <div className="ui button" style={{marginTop: '0.5rem', marginBottom: '2rem'}}>Delete</div>
        // </div>

        <div style={{marginBottom: '2rem', marginTop: '3rem'}}>
            <div className="ui card" style={{borderRadius: '20px', width: '95%', maxWidth: '250px', backgroundColor: '#f5f5f5'}}>
                <div className="content" style={{marginLeft: '10%', marginRight: '10%', textAlign: 'center'}}>
                    <p style={{fontWeight: 'bold'}}>{card.brand} ending in {card.last4}</p>
                    <p>Expires: {card.exp_month} / {card.exp_year}</p>
                    <DefaultButton />
                    <div className="ui button" style={{marginTop: '0.5rem'}}>Delete</div>
                </div>
            </div>
        </div>
    )
}

export default UserCardListItem


