import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CartListItem from '../components/CartListItem'
import { Link, useHistory } from 'react-router-dom'
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import Header from '../components/Header';
import AuthHeader from '../components/AuthHeader';


function CartScreen() {

    // const [cartItems, setCartItems] = useState([])
    const [sumQuantities, setSumQuantities] = useState(0)
    const [sumTotalPrices, setSumTotalPrices] = useState(0.00)
    const [cartInfo, setCartInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const history = useHistory()

    function zip(arrays) {
        return arrays[0].map(function(_,i){
            return arrays.map(function(array){return array[i]})
        });
    }

    async function fetchCartItems() {
        const { data } = await axios.get('/api/orders/get_cart_items')
        // setCartItems(data.products)
        // setQuantities(data.quantities)
        // setTotalPrices(data.totalPrices)
        setCartInfo(zip(data.cartInfo))
        setSumQuantities(data.sumQuantities)
        setSumTotalPrices(data.sumTotalPrices)
        setIsLoading(false)
    }

    // async function fetchLocalStorageCartItems() {
    //     const { data } = await axios.get('/api/orders/get_local_storage_cart_items')
    //     setCartInfo(zip(data.cartInfo))
    //     setSumQuantities(data.sumQuantities)
    //     setSumTotalPrices(data.sumTotalPrices)
    //     setIsLoading(false)
    // }

    // function fetchLocalStorageCartItems() {
    //     const cartItems = localStorage.getItem('cartItems')
    //     console.log(`cartitems are ${cartItems}`)
    //     const payload = {
    //         cartItems: cartItems
    //     }
        
	// 	axios.get(`/api/orders/get_local_storage_cart_items`, {
    //         cartItems: payload
	// 	})
	// 	.then(res => {
	// 		// console.log(res.data)
    //         setCartInfo(zip(res.data.cartInfo))
    //         setSumQuantities(res.data.sumQuantities)
    //         setSumTotalPrices(res.data.sumTotalPrices)
    //         setIsLoading(false)
	// 	});
    // }

    function fetchLocalStorageCartItems() {
        const cartItems = localStorage.getItem('cartItems')
        console.log(`cartitems are ${cartItems}`)
        const payload = {
            cartItems: JSON.parse(localStorage.getItem('cartItems'))
        }
        
        var config = {
            method: 'post',
            url: `/api/orders/get_local_storage_cart_items/`,
            data: payload,
        };
        axios(config).then(res => {
            if (typeof res.data.cartInfo != "undefined") {
                setCartInfo(zip(res.data.cartInfo))
                setSumQuantities(res.data.sumQuantities)
                setSumTotalPrices(res.data.sumTotalPrices)
            }

            setIsLoading(false)     
        });
    }



    const [authNav, setAuthNav] = useState(false)

    useEffect(() => {

        axios.get('/api/users/check_if_user_is_logged_in/').then(function(res) {
            if (res.data.loggedIn) {
                setAuthNav(true)
                fetchCartItems()
            } else {
                fetchLocalStorageCartItems()
            }
            
            // else {
            //     console.log('protected route no user signed in')
            //     // For fail, update state like
            //     this.setState(() => ({ isLoading: false, isLoggedIn: false }));
            // }
          });
          

        // async function fetchCartItems() {
        //     const { data } = await axios.get('/api/orders/get_cart_items')
        //     // setCartItems(data.products)
        //     // setQuantities(data.quantities)
        //     // setTotalPrices(data.totalPrices)
        //     setCartInfo(zip(data.cartInfo))
        //     setSumQuantities(data.sumQuantities)
        //     setSumTotalPrices(data.sumTotalPrices)
        // }

        // fetchCartItems()
        
    }, [])

    function deleteCartItemFromList(publicId, quantity, totalPrice) {
        setCartInfo(cartInfo.filter(cartItem => cartItem[0].public_id !== publicId))
        setSumQuantities(sumQuantities - quantity)
        setSumTotalPrices((sumTotalPrices - totalPrice).toFixed(2))
    }

    function changeNumCartItems(quantity) {
        setSumQuantities(quantity)
    }

    function addToTotalPrice(price) {
        // setSumTotalPrices((sumTotalPrices + price).toFixed(2))
        console.log(price)
        var newTotal = (parseFloat(sumTotalPrices) + parseFloat(price))
        console.log(newTotal)
        setSumTotalPrices(newTotal.toFixed(2))

    }

    function subtractFromTotalPrice(price) {
        // setSumTotalPrices((sumTotalPrices - price).toFixed(2))
        var newTotal = (parseFloat(sumTotalPrices) - parseFloat(price))
        setSumTotalPrices(newTotal.toFixed(2))
    }

    function handleCheckout() {
        history.push('/checkout')
    }

    function goBack() {
        history.goBack()
    }

    function NoCartItemsMessage() {
        if (cartInfo.length == 0) {
            return <div className="ten wide" style={{textAlign: 'center', fontWeight: 'bold'}}>No items added to cart.</div>
        } else {
            return null
        }
    }

    function CheckoutButton() {
        if (cartInfo.length == 0) {
            return <button className="ui disabled button" onClick={handleCheckout} style={{background: '#00e1ff', color: '#fff', display: 'flex', justifyContent: 'center', width: '80%', maxWidth: '400px', margin: '0 auto'}}>Checkout</button>
        } else {
            return <button className="ui button" onClick={handleCheckout} style={{background: '#00e1ff', color: '#fff', display: 'flex', justifyContent: 'center', width: '80%', maxWidth: '400px', margin: '0 auto'}}>Checkout</button>
        }
    }

    // cartInfo array structure: [product object, quantity, total price]
    return (
        <div>
            {isLoading ? null :
                <div>
                    <div>
                        {authNav ? <AuthHeader /> : <Header /> }
                    </div>
                    <div style={{width: '100%', paddingTop: '5rem'}}>
                        <ArrowBackRoundedIcon onClick={goBack} style={{cursor: 'pointer', display: 'block', float: 'left', margin: '0.5rem', color: '#00e1ff'}} color="" fontSize="large"/>
                    </div>
                    <br />
                    <div style={{marginTop: '2rem'}}>
                        <span><h3 className="" style={{float: 'left', display: 'inline'}}>Items: {sumQuantities}</h3></span>
                        <span><h3 className="" style={{float: 'right', display: 'inline'}}>Subtotal: {sumTotalPrices}</h3></span>
                    </div>

                    <div style={{margin: '2rem'}}></div>
                    <NoCartItemsMessage />
                    <table class="ui table">
                    <thead>
                        <tr>
                            <th class="four wide"></th>
                            <th class="four wide">Item</th>
                            <th class="two wide">Price</th>
                            <th class="two wide">Quantity</th>
                            <th class="three wide">Total</th>
                            <th class="one wide"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartInfo.map(cartItem => (
                            <CartListItem key={cartItem[0].public_id} cartItem={cartItem} 
                            deleteCartItemFromList={deleteCartItemFromList} 
                            changeNumCartItems={changeNumCartItems} 
                            addToTotalPrice={addToTotalPrice} 
                            subtractFromTotalPrice={subtractFromTotalPrice}
                            loggedIn={authNav} />
                            // <tr>
                            //     <td><img src={cartItem[0].imageUrl} 
                            //     style={{display: 'block', maxWidth: '80px', maxHeight: '80px', 
                            //     width: 'auto', height: 'auto'}}></img></td>
                            //     <td>{cartItem[0].name} </td>
                            //     <td>{cartItem[0].price} </td>
                            //     <td>{cartItem[1]}</td>
                            //     <td>${cartItem[2]}</td>
                            //     <td><i class="trash icon" style={{cursor: 'pointer'}} onClick={handleRemoveFromToCart}></i></td>
                            // </tr>
                        ))}
                    </tbody>
                    </table>
                    <CheckoutButton />
                    {/* <button className="ui button" onClick={handleCheckout} style={{background: '#00e1ff', color: '#fff', display: 'flex', justifyContent: 'center', width: '80%', maxWidth: '400px', margin: '0 auto'}}>Checkout</button> */}
                </div>
            }
        </div>
    )
}

export default CartScreen
