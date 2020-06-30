import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import Parse, { User } from 'parse';
import {
    Container,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    Form,
    Tooltip,
    OverlayTrigger,
    Table
} from 'react-bootstrap';
import Card from 'components/Card/Card';
import { slicename } from 'utils/slicename';
import { UserCard } from 'components/UserCard/UserCard.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import moment from 'moment';
import Button from 'components/CustomButton/CustomButton.jsx';
import { handleConvert } from 'utils/converter';

class ViewDetailEarly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leave: [],
            loading: false,
            buttonLoading: false
        };
    }

    componentDidMount() {
        this.getDetailEarly();
    }

    getDetailEarly() {
        // this.state({ loading: true });
        const objectId = this.props.match.params.objectId;
        const Leave = Parse.Object.extend('EarlyLeave');
        const Leader = Parse.Object.extend('Leader');
        const leader = new Leader();
        const query = new Parse.Query(Leave);

        console.log(Parse.User.current().get('leaderId').id);

        leader.id = Parse.User.current().get('leaderId').id;
        query.equalTo('leaderId', leader);
        // query.equalTo('_User', 'LEDw8FUJeQ');
        query.equalTo('status', 3);
        query.find().then((x) => {
            console.log(x);
            this.setState({ leave: x, loading: false });
        });
    }

    render() {
        const objectId = this.props.match.params.objectId;
        const { leave } = this.state;
        const tooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

        return (
            <div className="content">

                <Container fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="List"
                                content={
                                    <div>
                                        <Row>
                                            <Col>
                                                <Form
                                                    onSubmit={this.handleFilter}
                                                    style={{ marginBottom: '20px' }}
                                                >
                                                    <Form.Group
                                                        as={Row}
                                                        controlId="formHorizontalEmail"
                                                    >
                                                        <Col sm={2}>
                                                            <p>Search by approval</p>
                                                        </Col>
                                                        <Col
                                                            sm={{ span: 2 }}
                                                            className="pull-right"
                                                        >
                                                            <Form.Control
                                                                as="select"
                                                                // defaultValue={1}
                                                                onChange={(e) => {
                                                                    console.log(e.target.value);
                                                                    this.setState({
                                                                        status: e.target.value
                                                                    });
                                                                }}
                                                            >
                                                                {[3, 1, 0].map((x) => (
                                                                    <option value={x}>
                                                                        {handleConvert(x)}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                        <Col sm={{ span: 2 }}>
                                                            <Button
                                                                variant="primary"
                                                                type="submit"
                                                            // disable={loading ? 'true' : 'false'}
                                                            >
                                                                <i className="fa fa-search" />{' '}
                                                                {/* {loading ? 'Fetching...' : 'Search'} */}
                                                            </Button>
                                                        </Col>
                                                    </Form.Group>
                                                </Form>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {leave.length < 1 ? (
                                                <Col md={12}>No data found...</Col>
                                            ) : (
                                                    leave.map((x, i) => (
                                                        <Col md={3}>
                                                            <UserCard
                                                                out={x.status}
                                                                bgImage={
                                                                    <img
                                                                        src="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                                                        alt="..."
                                                                    />
                                                                }
                                                                avatar={
                                                                    x.attributes.imageSelfie ==
                                                                        undefined ? (
                                                                            'https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
                                                                        ) : (
                                                                            x.attributes.imageSelfie.url()
                                                                        )
                                                                }
                                                                name={x
                                                                    .get('fullname')
                                                                    .split(' ')
                                                                    .slice(0, 2)
                                                                    .join(' ')}
                                                                userName={x.get('descIzin')}
                                                                description={
                                                                    <span>
                                                                        <span>
                                                                            <strong>
                                                                                Absen keluar:
																		</strong>
                                                                            <br />
                                                                            {moment(
                                                                                x.get('time')
                                                                            ).format(
                                                                                'DD/MM/YYYY [at] HH:mm:ss'
                                                                            )}
                                                                        </span>
                                                                        <br />
                                                                        <span>
                                                                            <strong>
                                                                                Early reason:
																		</strong>
                                                                            <br />
                                                                            {x.get('alasan')}
                                                                        </span>
                                                                    </span>
                                                                }
                                                                status={x.get('status')}
                                                                socials={
                                                                    <div>
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={tooltip('Approve')}
                                                                        >
                                                                            <Button
                                                                                simple
                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        editMode: true,
                                                                                        userId: x.id,
                                                                                        userIndex: i,
                                                                                        fullnames: x.get(
                                                                                            'fullname'
                                                                                        )
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-check" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={tooltip('Reject')}
                                                                        >
                                                                            <Button
                                                                                simple
                                                                                onClick={(e) => {
                                                                                    this.setState({
                                                                                        deleteMode: true,
                                                                                        userId: x.id,
                                                                                        userIndex: i,
                                                                                        fullnames: x.get(
                                                                                            'fullname'
                                                                                        )
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-close" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                }
                                                            />
                                                        </Col>
                                                    ))
                                                )}
                                        </Row>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>

                    {/* </Col> */}
                    {/* </Row> */}
                </Container>

                {/* <ModalHandler
                    show={this.state.deleteMode}
                    title="Reject confirmation"
                    handleHide={() => this.setState({ deleteMode: false })}
                    handleSave={this.handleReject}
                    loading={this.state.loading}
                    body={'Reject request ' + this.state.fullnames + ' ?'}
                />
                <ModalHandler
                    show={this.state.editMode}
                    title="Approve confirmation"
                    handleSave={this.handleApprove}
                    loading={this.state.loading}
                    handleHide={() => this.setState({ editMode: false })}
                    body={'Approve request ' + this.state.fullnames + ' ?'}
                /> */}
                {/* <Row>
                    <Col md={12}>
                        <Card
                            title="Data Early"
                            content={
                                <p>{leave.map((x, i) => (
                                    <UserCard name={x.get('fullname')}></UserCard>
                                ))}</p>
                            }
                        >

                        </Card>
                    </Col>
                </Row> */}
            </div>
        );
    }
}

export default ViewDetailEarly;