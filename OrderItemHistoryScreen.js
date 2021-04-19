import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AuthHeader from '../components/AuthHeader'

function OrderItemHistoryScreen({ match }) {

    // const [cartItems, setCartItems] = useState([])
    const [sumQuantities, setSumQuantities] = useState(0)
    const [sumTotalPrices, setSumTotalPrices] = useState(0.00)
    const [shippingAddress, setShippingAddress] = useState([])
    const [cartInfo, setCartInfo] = useState([])
    const [order, setOrder] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [orderDate, setOrderDate] = useState('')

    function zip(arrays) {
        return arrays[0].map(function(_,i){
            return arrays.map(function(array){return array[i]})
        });
    }

    useEffect(() => {

        async function fetchOrderItems() {
            const { data } = await axios.get(`/api/orders/${match.params.id}/`)
            // setCartItems(data.products)
            // setQuantities(data.quantities)
            // setTotalPrices(data.totalPrices)
            setCartInfo(zip(data.cartInfo))
            setSumQuantities(data.sumQuantities)
            setSumTotalPrices(data.sumTotalPrices)
        }

        async function fetchOrderHistory() {
            const { data } = await axios.get(`/api/orders/get_order/${match.params.id}/`)
            setOrder(data.order)
            setOrderDate(data.order.paidAt.substring(0, 10))
            // setShippingAddress(data.shippingAddress)
            console.log(`order is ${data.order.taxPrice}`)
            setIsLoading(true)
        }

        fetchOrderHistory()
        fetchOrderItems()
        
    }, [])

    return (
        <div>
            {/* cartInfo array structure: [product object, quantity, total price] */}
            <AuthHeader />
            {/* {isLoading ? null : */}
            <div>
            <div style={{paddingTop: '5rem', fontWeight: 'bold'}}>
            <p>Items: {sumQuantities}</p>
            <p>Total: ${order.totalPrice}</p>
            <p>Date: {orderDate}</p>
            </div>

            <table class="ui table">
            <thead>
                <tr><th class="four wide"></th>
                <th class="five wide">Item</th>
                <th class="two wide">Price</th>
                <th class="two wide">Quantity</th>
                <th class="three wide">Total</th>
            </tr></thead>
            <tbody>
                {cartInfo.map(cartItem => (
                    <tr>
                        <td><img src={cartItem[0].imageUrl} 
                        style={{display: 'block', maxWidth: '80px', maxHeight: '80px', 
                        width: 'auto', height: 'auto'}}></img></td>
                        <td>{cartItem[0].name} </td>
                        <td>{cartItem[0].price} </td>
                        <td>{cartItem[1]}</td>
                        <td>${cartItem[2]}</td>
                    </tr>
                ))}
            </tbody>
            </table>
            <p>Delivered to: {order.address}</p>
            <p>Subtotal: ${order.subtotal}</p>
            <p>Tax: ${order.taxPrice}</p>
            <p>Delivery fee: ${order.deliveryPrice}</p>
            <p>Tip: ${order.tipPrice}</p>
            <p><strong>Total: ${order.totalPrice}</strong></p>
            </div>
            {/* } */}
        </div>
    )
}

export default OrderItemHistoryScreen
