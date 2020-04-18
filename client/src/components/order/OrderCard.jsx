import React from 'react';
import { Card, Button, Table } from 'react-bootstrap';
import { orderStatus } from 'src/components/Dashboard';
import { OrderHelper } from 'src/components/order/OrderHelper';

export class OrderCard extends React.Component {
    orderStatusIndicator = (currOrderStatus) => {
        let variant;
        switch (currOrderStatus) {
            case orderStatus.ORDERED:
                variant = 'warning';
                break;
            case orderStatus.PROGRESS:
                variant = 'primary';
                break;
            case orderStatus.COMPLETED:
                variant = 'success';
                break;
            case orderStatus.CANCELLED:
                variant = 'danger';
                break;
            default:
                break;
            }
        return (<Button variant={variant}>{currOrderStatus}</Button>)
    }

    render() {
        const { order } = this.props;

        return (<Card className="order-card" style={{ width: '95%' }}>
            <Card.Header>
                <Card.Title>Order</Card.Title>
                <Card.Subtitle>#{order._id}</Card.Subtitle>
                {this.orderStatusIndicator(order.status)}
            </Card.Header>
            <Card.Body>
                <Table>
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items.map((orderItem, j) => {
                            return (<tr key={j}>
                                <th>{orderItem.quantity}</th>
                                <th>
                                    <Card.Title>
                                        {orderItem.menu_item.name}
                                    </Card.Title>
                                    <Card.Text className="order-notes">
                                        {orderItem.notes}
                                    </Card.Text>
                                </th>
                                <th>${orderItem.menu_item.price}</th>
                            </tr>)
                        })}
                    </tbody>
                </Table>
                <Card.Title>Total: ${OrderHelper.getTotal(order)}</Card.Title>
            </Card.Body>
        </Card>);
    }
}