import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { MenuItem } from 'components/MenuItem';
export class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.state = {
            showDialog: false,
            menuItemList: []
        }
    }

    componentDidMount() {
        this.setState({ menuItemList: this.props.menuItemList });
    }
    

    handleMenuClick() {

    }



    render () {
        let defaultKey = this.props.menuItemList ? this.props.menuItemList[0].name : "Burgers";
        this.props.menuItemList.length > 0 && this.props.menuItemList.forEach((category, i) => {

            let entries = [];


            category.menu_items.length > 0 
            && category.menu_items.forEach((item, i) => {
                let props = {
                    name: item.name,
                    description: item.description,
                    media_urls: item.media_urls,
                    price: item.price,
                    labels: item.labels,
                    tags: item.tags,
                }
                let entry = (
                    <Row key={i} className="layout--menu">
                        <Col>
                            <MenuItem className="menu-item" {...props}/>
                        </Col>
                    </Row>
                );
                entries.push(entry);
            })

            let tab = (
                <Tab key={category.name} eventKey={category.name} title={category.name}>
                    {entries}
                </Tab>
            )

            tabs.push(tab);
        });

        return (
            <Container className="layout--padding--menu">
                <Tabs defaultActiveKey={defaultKey}>
                    {tabs}
                </Tabs>
            </Container>
        );
    }
}