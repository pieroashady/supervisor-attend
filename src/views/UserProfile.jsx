/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from 'react';
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

import { Card } from 'components/Card/Card.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { UserCard } from 'components/UserCard/UserCard.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';

import avatar from 'assets/img/faces/face-3.jpg';
import Axios from 'axios';
import { baseurl } from 'utils/baseurl';
import Parse from 'parse';
import ModalHandler from './Category/ModalHandler';
import moment from 'moment';
import DateTime from 'react-datetime';
import { Link } from 'react-router-dom';
import { handleConvert } from 'utils/converter';

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trainee: [],
			izin: [],
			error: '',
			userId: '',
			status: 3,
			userIndex: 0,
			fullnames: '',
			loading: false,
			addMode: false,
			editMode: false,
			deleteMode: false,
			buttonLoading: false
		};

		this.handleApprove = this.handleApprove.bind(this);
		this.handleReject = this.handleReject.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
	}

	componentDidMount() {
		this.getTrainee();
	}

	handleApprove(e) {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(this.state.userId).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newOvertime = [ ...this.state.izin ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					izin: newOvertime,
					editMode: false,
					loading: false
				});
			});
		});
	}

	handleReject(e) {
		this.setState({ loading: false });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(this.state.userId).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newOvertime = [ ...this.state.izin ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					izin: newOvertime,
					deleteMode: false,
					loading: false
				});
			});
		});
	}

	getTrainee() {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Izin);

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.equalTo('status', 3);
		query.find().then((x) => {
			console.log(x);
			this.setState({ izin: x, loading: false });
		});
	}

	handleFilter(e) {
		e.preventDefault();
		this.setState({ loading: true });
		console.log(this.state.status);

		const Izin = Parse.Object.extend('Izin');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Izin);

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.equalTo('status', parseInt(this.state.status));
		query.find().then((x) => {
			console.log(x);
			this.setState({ izin: x, loading: false });
		});
	}

	render() {
		const { izin, error, loading, batch } = this.state;
		izin.map((x) => console.log(x.get('alasanIzin')));
		const {
			username,
			email,
			password,
			passwordConf,
			dob,
			pob,
			phoneNumber,
			fullname,
			profile
		} = this.state;
		const tooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Reject confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleReject}
					loading={this.state.loading}
					body={'Reject izin ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Approve confirmation"
					handleSave={this.handleApprove}
					loading={this.state.loading}
					handleHide={() => this.setState({ editMode: false })}
					body={`Approve izin ${this.state.fullnames} ?`}
				/>

				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Request izin"
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
																{[ 3, 1, 0 ].map((x) => (
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
																disable={loading ? 'true' : 'false'}
															>
																<i className="fa fa-search" />{' '}
																{loading ? 'Fetching...' : 'Search'}
															</Button>
														</Col>
													</Form.Group>
												</Form>
											</Col>
										</Row>
										<Row>
											{izin.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												<Table striped hover>
													<thead>
														<tr>
															<th>CHECK</th>
															<th>NAME</th>
															<th>NIP</th>
															<th>START</th>
															<th>END</th>
															<th>TIME LAPSE</th>
															<th>DISTANCE</th>
															<th>PERCENTAGE</th>
															<th>NOTES</th>
														</tr>
													</thead>
													<tbody key={1}>
														{izin.map((prop, key) => (
															<tr key={key}>
																<td>{key + 1}</td>
																<td>{prop.recoName}</td>
																<td>{prop.recoNip}</td>
																<td>{prop.recoStart}</td>
																<td>{prop.recoEnd}</td>
																<td>{prop.recoTimeLapse}</td>
																<td>
																	{prop.recoDistance.toFixed(2)}
																</td>
																<td>{prop.recoPercentage}</td>
																<td>{prop.recoNotes}</td>
															</tr>
														))}
													</tbody>
												</Table>
												// <Col md={3}>
												// 	<UserCard
												// 		out={x.status}
												// 		bgImage={
												// 			<img
												// 				src="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
												// 				alt="..."
												// 			/>
												// 		}
												// 		avatar={
												// 			x.attributes.attachFile ==
												// 			undefined ? (
												// 				'https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
												// 			) : (
												// 				x.attributes.attachFile.url()
												// 			)
												// 		}
												// 		name={x
												// 			.get('fullname')
												// 			.split(' ')
												// 			.slice(0, 2)
												// 			.join(' ')}
												// 		userName={x.get('descIzin')}
												// 		description={
												// 			<span>
												// 				<strong>Alasan</strong>
												// 				<br />
												// 				{x.get('alasanIzin') !== '-' ||
												// 				x.get('alasanIzin') ===
												// 					undefined ? (
												// 					x.get('alasanIzin')
												// 				) : (
												// 					'Surat terlampir'
												// 				)}
												// 				{/* <br />
												// 				{x.dateOfBirth}
												// 				<br />
												// 				{x.phoneNumber} */}
												// 			</span>
												// 		}
												// 		status={x.get('status')}
												// 		socials={
												// 			<div>
												// 				<OverlayTrigger
												// 					placement="right"
												// 					overlay={tooltip('Approve')}
												// 				>
												// 					<Button
												// 						simple
												// 						onClick={() => {
												// 							this.setState({
												// 								editMode: true,
												// 								userId: x.id,
												// 								userIndex: i,
												// 								fullnames: x.get(
												// 									'fullname'
												// 								)
												// 							});
												// 						}}
												// 					>
												// 						<i className="fa fa-check" />
												// 					</Button>
												// 				</OverlayTrigger>
												// 				<OverlayTrigger
												// 					placement="right"
												// 					overlay={tooltip('Reject')}
												// 				>
												// 					<Button
												// 						simple
												// 						onClick={(e) => {
												// 							this.setState({
												// 								deleteMode: true,
												// 								userId: x.id,
												// 								userIndex: i,
												// 								fullnames: x.get(
												// 									'fullname'
												// 								)
												// 							});
												// 						}}
												// 					>
												// 						<i className="fa fa-close" />
												// 					</Button>
												// 				</OverlayTrigger>
												// 			</div>
												// 		}
												// 	/>
												// </Col>
											)}) )}
										</Row>
									</div>
								}
							/>
						</Col>
					</Row>

					{/* </Col> */}
					{/* </Row> */}
				</Container>
			</div>
		);
	}
}

export default UserProfile;
