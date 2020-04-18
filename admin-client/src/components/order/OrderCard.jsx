import React from 'react';
import { Button, ButtonGroup, Card, Table } from 'react-bootstrap';
import { orderStatus } from 'src/components/Dashboard';
import { Requests } from 'src/utilities/Requests';

export class OrderCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: Date.now(),
            tableName: ''
        }
    }

    componentDidMount = async () => {
        this.timeElapsed = setInterval(() => this.tick(), 1000);

        const table = await Requests.getTable(this.props.order.table_id);
        this.setState({ tableName: table.name });
    }

    componentWillUnmount() {
        clearInterval(this.timeElapsed);
    }

    truncateId = (id) => {
        return id.slice(0, 10) + '...';
    }    

    getTotal = () => {
        let total = 0;
        this.props.order.order_items.forEach(orderItem => {
            total += orderItem.quantity * orderItem.menu_item.price;
        });
        return total;
    }

    // #region Time Elapsed Functions
    tick = () => {
        this.setState({ currentTime: Date.now() });
    }

    getTimeElapsed = () => {
        let orderStart = new Date(this.props.order.timestamp);
        let secondsElapsed = Math.floor((this.state.currentTime - orderStart.getTime()) / 1000);
        let minutes = Math.floor(secondsElapsed / 60);
        let hours = Math.floor(secondsElapsed / 3600);
        minutes -= hours * 60;
        let seconds = secondsElapsed % 60;

        let time = '';
        if (hours > 0)    time += `${hours} hours `;
        if (minutes > 0)  time += `${minutes} minutes `;
        if (seconds > 0)  time += `${seconds} seconds `;

        return time;
    }
    // #endregion

    // #region Order Status Functions
    isActive = () => {
        const { order } = this.props;
        return order.status === orderStatus.ORDERED || order.status === orderStatus.PROGRESS;
    }

    orderStatusButtons = () => {
        const { changeOrderStatus, order } = this.props;

        const statusButtonVariantMap = new Map([
            [orderStatus.ORDERED, 'warning'],
            [orderStatus.PROGRESS, 'info'],
            [orderStatus.COMPLETED, 'success'],
            [orderStatus.CANCELLED, 'danger'],
        ]);
    
        return (<ButtonGroup>
            {[...statusButtonVariantMap.entries()].map(([status, variant], i) => {
                let buttonVariant = variant;
                if (status !== order.status) {
                    buttonVariant = 'outline-' + buttonVariant;
                }
                return <Button 
                    key={i}
                    className="order-status-btn"
                    variant={buttonVariant}
                    onClick={() => changeOrderStatus(status, order._id)}
                >
                    {status}
                </Button>;
            })}
        </ButtonGroup>);
    }
    // #endregion

    render() {
        const { order } = this.props;

        return (
            <Card style={{ width: '30vw', margin: '10px' }}>
                <Card.Header>
                    <Card.Title>Order #{this.truncateId(order._id)}</Card.Title>
                    <Card.Subtitle>Table: <strong>{this.state.tableName}</strong></Card.Subtitle>
                    {this.orderStatusButtons()}
                    {this.isActive() &&
                        <div>
                            <Card.Subtitle>Time Elapsed:</Card.Subtitle>
                            <Card.Text>{this.getTimeElapsed()}</Card.Text>
                        </div>
                    }
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
                                        <Card.Text>
                                            {orderItem.notes}
                                        </Card.Text>
                                    </th>
                                    <th>${orderItem.menu_item.price}</th>
                                </tr>)
                            })}
                        </tbody>
                    </Table>
                    <Card.Title>Total: ${this.getTotal()}</Card.Title>
                </Card.Body>
            </Card>
        );
    }
}