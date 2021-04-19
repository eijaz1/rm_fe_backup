import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

function CartListItem( { cartItem, deleteCartItemFromList, changeNumCartItems, addToTotalPrice, subtractFromTotalPrice, loggedIn }) {

    const {numCartItems, setNumCartItems} = useContext(CartContext)

    const [productQuantity, setProductQuantity] = useState(parseInt(cartItem[1]))

    const data = {
        public_id: cartItem[0].public_id 
    }

    function handleRemoveFromCart() {
        if (loggedIn) {
            var config = {
                method: 'delete',
                url: '/api/orders/delete_cart_item/',
                data: data
            };
            axios(config)       
            .then(res => {
                // deleteCartItemFromList(cartItem[0].public_id, cartItem[1], cartItem[2])
                deleteCartItemFromList(cartItem[0].public_id, productQuantity, totalLoggedInCartItemPrice)
                setNumCartItems(res.data.quantity)      
            })
            .catch(function (error) {
            // Handle error
            console.log(error);
            // setServerError(true)
            });
        }
        else {
            deleteCartItemFromList(cartItem[0].public_id, productQuantity, totalCartItemPrice)
            var cartItems = localStorage.getItem('cartItems')
            var parsedCartItems = JSON.parse(cartItems)
            parsedCartItems = parsedCartItems.filter(x => x !== cartItem[0].public_id)
            localStorage.setItem("cartItems", JSON.stringify(parsedCartItems))
            setNumCartItems(parsedCartItems.length)
        }
    }

    const increaseQuantityData = {
        public_id: cartItem[0].public_id,
        action: 'add'
    }

    const decreaseQuantityData = {
        public_id: cartItem[0].public_id,
        action: 'remove'
    }

    const [totalCartItemPrice, setTotalCartItemPrice] = useState(cartItem[2])
    const [totalLoggedInCartItemPrice, setTotalLoggedInCartItemPrice] = useState(cartItem[2])

    function handleIncreaseQuantity() {
        if (loggedIn) {
            var config = {
                method: 'post',
                url: `/api/orders/add_to_cart/`,
                data : increaseQuantityData
            };
            axios(config).then(res => {
                console.log(res.data)
                setNumCartItems(res.data.quantity)
                changeNumCartItems(res.data.quantity)
                addToTotalPrice(cartItem[0].price)
                setProductQuantity(productQuantity + 1)
                setTotalLoggedInCartItemPrice((parseFloat(totalLoggedInCartItemPrice) + parseFloat(cartItem[0].price)).toFixed(2))
            })
        }
        else {
            var cartItems = localStorage.getItem('cartItems')
            var parsedCartItems = JSON.parse(cartItems)
            parsedCartItems.push(cartItem[0].public_id)
            localStorage.setItem("cartItems", JSON.stringify(parsedCartItems))
            setNumCartItems(parsedCartItems.length)
            changeNumCartItems(parsedCartItems.length)
            addToTotalPrice(cartItem[0].price)
            setProductQuantity(productQuantity + 1)
            setTotalCartItemPrice((parseFloat(totalCartItemPrice) + parseFloat(cartItem[0].price)).toFixed(2))
        }
    }

    function handleDecreaseQuantity() {
        if (productQuantity > 1) {
            if (loggedIn) {
                var config = {
                    method: 'post',
                    url: `/api/orders/add_to_cart/`,
                    data : decreaseQuantityData
                };
                axios(config).then(res => {
                    console.log(res.data)
                    setNumCartItems(res.data.quantity)
                    changeNumCartItems(res.data.quantity)
                    subtractFromTotalPrice(cartItem[0].price)
                    setProductQuantity(productQuantity - 1)
                    setTotalLoggedInCartItemPrice((parseFloat(totalLoggedInCartItemPrice) - parseFloat(cartItem[0].price)).toFixed(2))
                })
            }
            else {

                var cartItems = localStorage.getItem('cartItems')
                var parsedCartItems = JSON.parse(cartItems)
                console.log(`cartItems before splice ${cartItems}`)
                // parsedCartItems.splice(cartItems.indexOf(String(cartItem[0].public_id)), 1)
                for( var i = 0; i < parsedCartItems.length; i++){ 
    
                    if ( parsedCartItems[i] === cartItem[0].public_id) { 
                
                        parsedCartItems.splice(i, 1); 
                        break
                    }
                
                }
                
                console.log(`cartItems after splice ${parsedCartItems}`)
                localStorage.setItem('cartItems', JSON.stringify(parsedCartItems))
                setNumCartItems(parsedCartItems.length)
                changeNumCartItems(parsedCartItems.length)
                subtractFromTotalPrice(cartItem[0].price)
                setProductQuantity(productQuantity - 1)
                setTotalCartItemPrice((parseFloat(totalCartItemPrice) - parseFloat(cartItem[0].price)).toFixed(2))
            }

        } else {
            if (loggedIn) {
                // handleRemoveFromCart()
            }
            // else {
            //     deleteCartItemFromList(cartItem[0].public_id, cartItem[1], cartItem[2])
            //     var cartItems = localStorage.getItem('cartItems')
            //     var parsedCartItems = JSON.parse(cartItems)
            //     parsedCartItems = parsedCartItems.filter(x => x !== cartItem[0].public_id)
            //     localStorage.setItem("cartItems", JSON.stringify(parsedCartItems))
            //     setNumCartItems(parsedCartItems.length)
            //     // var cartItems = localStorage.getItem('cartItems')
            //     // var parsedCartItems = JSON.parse(cartItems)
            //     // console.log(`cartItems before splice ${cartItems}`)
            //     // parsedCartItems = parsedCartItems.filter(x => x !== cartItem[0].public_id); 
            //     // parsedCartItems.splice(cartItems.indexOf(cartItem[0].public_id))
            //     // console.log(`cartItems after splice ${parsedCartItems}`)
            //     // localStorage.setItem('cartItems', JSON.stringify(parsedCartItems))
            //     // // deleteCartItemFromList(cartItem[0].public_id, cartItem[1], cartItem[2])
            //     // setNumCartItems(parsedCartItems.length)
            //     // // changeNumCartItems(parsedCartItems.length)
            // }
        }

    }

    return (
            <tr>
                <td><Link to={`/product/${cartItem[0].public_id}`}><img src={cartItem[0].imageUrl} 
                style={{display: 'block', maxWidth: '80px', maxHeight: '80px', 
                width: 'auto', height: 'auto'}}></img></Link></td>
                <td><Link to={`/product/${cartItem[0].public_id}`} style={{color: '#000'}}>{cartItem[0].name}</Link></td>
                <td>{cartItem[0].price} </td>
                <td><i className="minus icon" onClick={handleDecreaseQuantity} style={{cursor: 'pointer'}}></i> {productQuantity} <i class="plus icon" onClick={handleIncreaseQuantity} style={{cursor: 'pointer'}}></i></td>
                {loggedIn ? <td>${totalLoggedInCartItemPrice}</td> :<td>${totalCartItemPrice}</td>}
                
                <td><i className="trash icon" style={{cursor: 'pointer'}} onClick={handleRemoveFromCart}></i></td>
            </tr>
    )
}

export default CartListItem
