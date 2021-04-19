import React, { useState, useEffect, useContext } from "react"
import { CartContext } from '../context/CartContext'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [amount, setAmount] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [deliveryAmount, setDeliveryAmount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [cardBrand, setCardBrand] = useState('')
  const [cardLastFour, setCardLastFour] = useState('')
  const [cardExpMonth, setCardExpMonth] = useState(0)
  const [cardExpYear, setCardExpYear] = useState(0)
  const stripe = useStripe();
  const elements = useElements();

  const [deliveryAddress, setDeliveryAddress] = useState(localStorage.getItem('delAdd') || '')
  const [unitNum, setUnitNum] = useState(localStorage.getItem('un') || '')
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()

  const {numCartItems, setNumCartItems} = useContext(CartContext)

//   useEffect(() => {
//     axios.post(`/api/orders/create-payment-intent/`)
//     //   .then(res => {
//     //     return res.json();
//     //   })
//       .then(res => {
//           console.log(res.data)
// 		// setClientSecret(res.data.client_secret);
// 		setPaymentIntentId(res.data.intent.id)
//         // console.log(`clientsecret: ${res.data.client_secret}`)
// 		console.log(`amount: ${res.data.intent.amount}`)
// 		console.log(`pi_id: ${res.data.intent.id}`)
//         setAmount(res.data.intent.amount)
//         setSubtotal(res.data.subtotal)
//         setTaxAmount(res.data.taxAmount)
//         setDeliveryAmount(res.data.deliveryAmount)
// 		setTipAmount(Math.floor(res.data.subtotal * 0.15))
//         setIsLoading(false)
//       });
      
//   }, []);

	useEffect(() => {
		axios.get(`/api/orders/checkout_amount/`)
		//   .then(res => {
		//     return res.json();
		//   })
		.then(res => {
			setSubtotal(res.data.subtotal)
			setTaxAmount(res.data.taxAmount)
			setDeliveryAmount(res.data.deliveryAmount)
			setTipAmount((Math.floor(res.data.subtotal * 0.07) < 2) ? 2.00 : Math.floor(res.data.subtotal * 0.07).toFixed(2))
			setIsLoading(false)
		});
		
	}, []);

  useEffect(() => {
    axios.get('/api/orders/get_default_card/')
    .then(res => {
      console.log(res.data)
      setCardBrand(res.data.brand)
      setCardLastFour(res.data.last4)
      setCardExpMonth(res.data.exp_month)
      setCardExpYear(res.data.exp_year)
    })
  }, [])

  	// function handleSubmit() {
	// 	axios.post(`/api/orders/confirm-payment/`, {
	// 		paymentIntentId: paymentIntentId,
    //   address: deliveryAddress,
    //   unitNum: unitNum,
	// 	})
	// 	  .then(res => {
	// 		  console.log(res.data)
    //     history.push('/success')

	// 	  });
    // }

	function handleSubmit() {
		axios.post(`/api/orders/create_and_confirm_payment/`, {
			tipAmount: tipAmount,
      		address: deliveryAddress,
      		unitNum: unitNum,
		})
		.then(res => {
			console.log(res.data)
      setNumCartItems(0)
      history.push('/success')
		});
    }
    
    // axios.post(`/api/orders/add_shipping_address/`, {
    //   paymentIntentId: paymentIntentId,
    //   address: address,
    //   unitNum: unitNum,
    // })
    //   .then(res => {
    //     console.log(res.data)
    //   });

	  // }

    // const [unitNum, setUnitNum] = useState('')

    function onUnitNumInputChange(e) {
      setUnitNum(e.target.value)
    }

    function DeliveryPrice() {
      if (deliveryAmount == 0) {
        return (
          <p>Delivery:<span className="right floated"><span style={{textDecoration: 'line-through'}}>2.95</span> <strong>FREE</strong></span></p>
        )
      } 
      else {
        return (
          <p>Delivery:<span className="right floated">{deliveryAmount.toFixed(2)}</span></p>
        )
      }
    }

	const [tipNone, setTipNone] = useState(false)
	const [tipTwelve, setTipTwelve] = useState(false)
	const [tipFifteen, setTipFifteen] = useState(true)
	const [tipEighteen, setTipEighteen] = useState(false)
	const [tipCustom, setTipCustom] = useState(false)
	const [tipAmount, setTipAmount] = useState(0.00)
	
	function addTipNone() {
		setTipNone(true)
		setTipTwelve(false)
		setTipFifteen(false)
		setTipEighteen(false)
		setTipCustom(false)
		setTipAmount(0.00)
	}

	function addTipTwelve() {
		setTipNone(false)
		setTipTwelve(true)
		setTipFifteen(false)
		setTipEighteen(false)
		setTipCustom(false)
		setTipAmount((Math.floor(subtotal * 0.05) < 1) ? 1.00 : Math.floor(subtotal * 0.05).toFixed(2))
		// {(Math.floor(subtotal * 0.12) < 1) ? 1 : Math.floor(subtotal * 0.12)}
	}

	function addTipFifteen() {
		setTipNone(false)
		setTipTwelve(false)
		setTipFifteen(true)
		setTipEighteen(false)
		setTipCustom(false)
		setTipAmount((Math.floor(subtotal * 0.07) < 2) ? 2.00 : Math.floor(subtotal * 0.07).toFixed(2))
	}

	function addTipEighteen() {
		setTipNone(false)
		setTipTwelve(false)
		setTipFifteen(false)
		setTipEighteen(true)
		setTipCustom(false)
		setTipAmount((Math.floor(subtotal * 0.10) < 3) ? 3.00 : Math.floor(subtotal * 0.10).toFixed(2))
	}

	function addTipCustom() {
		setTipNone(false)
		setTipTwelve(false)
		setTipFifteen(false)
		setTipEighteen(false)
		setTipCustom(true)
	}

	function onCustomTipInputChange(e) {
        setTipAmount(e.target.value)
    }


	function TipPrice() {
		return (
			<div>
				<div className="ui horizontal list">
					<div className="ui button" onClick={addTipNone} style={{ background: tipNone ? '#00e1ff' : null, color: tipNone ? '#fff' : null, width: '6rem', borderRadius: '25px', cursor: 'pointer', marginRight: '0.5rem'}}>No Tip</div>
					<div className="ui button" onClick={addTipTwelve} style={{ background: tipTwelve ? '#00e1ff' : null, color: tipTwelve ? '#fff' : null, width: '6rem', borderRadius: '25px', cursor: 'pointer', marginRight: '0.5rem'}}>${(Math.floor(subtotal * 0.05) < 1) ? 1 : Math.floor(subtotal * 0.05)}</div>
					<div className="ui button" onClick={addTipFifteen} style={{ background: tipFifteen ? '#00e1ff' : null, color: tipFifteen ? '#fff' : null, width: '6rem', borderRadius: '25px', cursor: 'pointer', marginRight: '0.5rem'}}>${(Math.floor(subtotal * 0.07) < 2) ? 2 : Math.floor(subtotal * 0.07)}</div>
					<div className="ui button" onClick={addTipEighteen} style={{ background: tipEighteen ? '#00e1ff' : null, color: tipEighteen ? '#fff' : null, width: '6rem', borderRadius: '25px', cursor: 'pointer', marginRight: ''}}>${(Math.floor(subtotal * 0.10) < 3) ? 3 : Math.floor(subtotal * 0.10)}</div>
					{/* <div className="ui button" onClick={addTipEighteen} style={{ background: tipEighteen ? '#00e1ff' : null, color: tipEighteen ? '#fff' : null, width: '10rem', maxWidth: '500px', borderRadius: '25px', cursor: 'pointer', margin: '', display: '', justifyContent: ''}}>${(subtotal * 0.18).toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp; (18%)</div> */}
					{/* <div className="ui button" onClick={addTipCustom} style={{ background: tipCustom ? '#00e1ff' : null, color: tipCustom ? '#fff' : null, width: '10rem', maxWidth: '500px', borderRadius: '25px', cursor: 'pointer', margin: '', display: '', justifyContent: ''}}>Custom amount</div> */}
				</div>
				
			</div>
		)
	}

  //   function ShowDeliveryAddress() {
  //     if (deliveryAddress == '') {
  //         return <Link to='/add_address' style={{color: '#00e1ff'}}>Add delivery address</Link>
  //     } else {
  //         return <div><span style={{fontWeight: 'bold'}}>Deliver to:</span> {deliveryAddress} &nbsp;&nbsp;&nbsp;&nbsp;<div><Link to='/add_address' style={{color: '#00e1ff'}}>Change address</Link></div></div>
  //     }
  // }

  return (
    
        <div>
          {isLoading ? null :
          <div>
            <div style={{marginBottom: '2rem', marginTop: '1rem'}}>
              <div className="ui card" style={{borderRadius: '20px', width: '95%', maxWidth: '500px', height: 'auto', margin: '0 auto', backgroundColor: '#fff'}}>
                <div className="content" style={{marginLeft: '15%', marginRight: '15%'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', paddingBottom: '1rem', textAlign: 'center'}}>Delivery address</div>
                  <p>{deliveryAddress}</p>
                  <p class="ui labeled input">
                  <div className="ui label">Apt / Unit # (optional)</div>
                    <input type="text" value={unitNum} onChange={onUnitNumInputChange}  />
                  </p>
                  <div style={{textAlign: 'center'}}>
                  	<Link to='/add_address' style={{color: '#00e1ff', textAlign: 'center'}}>Edit address</Link>
                  </div>
                </div>
              </div>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <div className="ui card" style={{borderRadius: '20px', width: '95%', maxWidth: '500px', height: 'auto', margin: '0 auto', backgroundColor: '#f5f5f5'}}>
                <div className="content" style={{marginLeft: '15%', marginRight: '15%'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', paddingBottom: '1rem', textAlign: 'center'}}>Payment Method</div>
                  <div>{cardBrand} ending in {cardLastFour}<span className="right floated">Expires: {cardExpMonth} / {cardExpYear}</span></div>
                  <div style={{textAlign: 'center', paddingTop: '1rem'}}>
                  <Link to='/payment_options' style={{color: '#00e1ff', textAlign: 'center'}}>Edit payment method</Link>
                  </div>
                </div>
              </div>
            </div>

			<div style={{marginBottom: '2rem'}}>
              <div className="ui card" style={{borderRadius: '20px', width: '95%', maxWidth: '500px', height: 'auto', margin: '0 auto', backgroundColor: '#fff'}}>
                <div className="content" style={{marginLeft: '2%', marginRight: '2%'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', paddingBottom: '1rem', textAlign: 'center'}}>Tip</div>
                  <div style={{textAlign: 'center', marginBottom: '1rem'}}>100% of the tip goes to your driver</div>
                  <div style={{textAlign: 'center'}}>
                  <TipPrice />
                  </div>
                </div>
              </div>
            </div>

			{/* <TipPrice /> */}
            
            <div style={{marginBottom: '2rem'}}>
              <div className="ui card" style={{borderRadius: '20px', width: '95%', maxWidth: '500px', height: 'auto', margin: '0 auto', backgroundColor: '#f5f5f5'}}>
                <div className="content" style={{marginLeft: '15%', marginRight: '15%'}}>
                  <p>Subtotal:<span className="right floated">{subtotal.toFixed(2)}</span></p>
                  <DeliveryPrice />
                  <p>Service fee:<span className="right floated"><strong>FREE</strong></span></p>
                  <p>Tax:<span className="right floated">{taxAmount.toFixed(2)}</span></p>
				  <p>Tip:<span className="right floated">{parseFloat(tipAmount).toFixed(2)}</span></p>
                  
                  {/* <p>Delivery:<span className="right floated">{deliveryAmount.toFixed(2)}</span></p> */}
                  
                  {/* <p style={{fontWeight: 'bold'}}>Total:<span className="right floated">${(amount / 100.00).toFixed(2)}</span></p> */}
				  <p style={{fontWeight: 'bold'}}>Total:<span className="right floated">${(subtotal + taxAmount + parseFloat(tipAmount)).toFixed(2)}</span></p>
                </div>
              </div>
            </div>

            <div className="ui button" onClick={handleSubmit} style={{background: '#00e1ff', color: '#fff', width: '95%', maxWidth: '500px', borderRadius: '20px', margin: '0 auto', display: 'flex', justifyContent: 'center'}}>Place Order</div>

            {/* <div>Payment Method</div>
            <div>{cardBrand} {cardLastFour} {cardExpMonth} / {cardExpYear}</div>
            <div className="ui button" onClick={handleSubmit} style={{background: '#00e1ff', color: '#fff', width: '95%', maxWidth: '500px', borderRadius: '20px', margin: '0 auto'}}>Place Order</div> */}
          </div>
          }
        </div>
  );
}
