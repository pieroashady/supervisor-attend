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
	OverlayTrigger
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

class Late extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trainee: [],
			late: [],
			error: '',
			userId: '',
			fullnames: '',
			userIndex: 0,
			loading: false,
			addMode: false,
			editMode: false,
			deleteMode: false,
			buttonLoading: false
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleApprove = this.handleApprove.bind(this);
		this.handleReject = this.handleReject.bind(this);
	}

	componentDidMount() {
		this.getTrainee();
	}

	getTrainee() {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Late);

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.equalTo('status', 3);
		query.find().then((x) => {
			console.log(x);
			this.setState({ late: x, loading: false });
		});
	}

	handleApprove(e) {
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(this.state.userId).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newOvertime = [ ...this.state.late ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					overtime: newOvertime,
					editMode: false
				});
			});
		});
	}
	handleReject(e) {
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(this.state.userId).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newOvertime = [ ...this.state.late ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					overtime: newOvertime,
					deleteMode: false
				});
			});
		});
	}

	handleEdit(id) {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		// Finds the user by its ID
		query
			.get(id)
			.then((user) => {
				// Updates the data we want
				this.setState({
					traineeId: id,
					editMode: true,
					username: user.get('username'),
					email: user.get('email'),
					dob: user.get('dateOfBirth'),
					pob: user.get('placeOfBirth'),
					phoneNumber: user.get('phoneNumber'),
					fullname: user.get('fullname'),
					batch: user.get('batch')
				});
			})
			.catch((err) => console.log(err));
	}

	handleUpdate(e) {
		e.preventDefault();

		this.setState({ loading: true });

		const {
			username,
			email,
			password,
			passwordConf,
			dob,
			pob,
			phoneNumber,
			fullname,
			batch,
			profile
		} = this.state;

		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.get(this.state.traineeId).then((user) => {
			user.set('username', `${username}-batch${batch}`);
			user.set('email', email);
			if (profile !== '') user.set('profile', new Parse.File('profile.jpg', profile));
			user.set('dateOfBirth', dob);
			user.set('placeOfBirth', pob);
			user.set('phoneNumber', phoneNumber);
			user.set('role', 'trainee');
			user.set('fullname', fullname);
			user.set('batch', parseInt(batch));
			user.set('status', 1);
			user.set('password', password);
			user.set('out', false);
			user.save().then((z) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
		});
	}

	handleDelete() {
		this.setState({ loading: true });
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.get(this.state.traineeId).then((x) => {
			x.set('status', 0);
			x.save().then((z) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
		});
	}

	handleSearch(e) {
		e.preventDefault();

		console.log(this.state.batch);

		this.setState({ loading: true });

		const data = {
			batch: this.state.batch
		};

		Axios.post(baseurl('trainee/batch'), data)
			.then((x) => {
				console.log(x.data);
				this.setState({ trainee: x.data, loading: false });
			})
			.catch((err) => this.setState({ error: err, loading: false }));
	}

	render() {
		const { late, error, loading, batch } = this.state;
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
					body={'Reject late ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Approve confirmation"
					handleSave={this.handleApprove}
					handleHide={() => this.setState({ editMode: false })}
					body={'Approve late ' + this.state.fullnames + ' ?'}
				/>
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Data late"
								content={
									<div>
										<Row>
											{late.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												late.map((x, i) => (
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
																			Absen masuk:
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
																			Late reason:
																		</strong>
																		<br />
																		{x.get('alasan')}
																	</span>
																</span>
															}
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
			</div>
		);
	}
}

export default Late;
