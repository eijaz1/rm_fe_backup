import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import AuthHeader from '../components/AuthHeader'

function OrderHistoryScreen() {

    const [orders, setOrders] = useState([])

    useEffect(() => {

        async function fetchOrderHistory() {
            const { data } = await axios.get('/api/orders/get_order_history')
            setOrders(data)
        }

        fetchOrderHistory()
        
    }, [])

    return (
        <div>
            {/* cartInfo array structure: [product object, quantity, total price] */}
            <AuthHeader />
            <div style={{paddingTop: '5rem'}}>
                <table class="ui table">
                <thead>
                    <tr><th class="three wide">Order #</th>
                    <th class="three wide">Total</th>
                    <th class="three wide">Date</th>
                </tr></thead>
                <tbody>
                    {orders.map(order => (
                        <tr>
                            <Link to={`/order_history/${order.public_id}`}><td style={{color: '#00e1ff'}}>{order.public_id}</td></Link>
                            <td>${order.totalPrice} </td>
                            <td>{order.paidAt.substring(0, 10)}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistoryScreen
