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
	Table,
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
import { handleConvert } from 'utils/converter';

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
			status: 3,
			loading: false,
			addMode: false,
			editMode: false,
			deleteMode: false,
			buttonLoading: false,
			checkAll: false,
			checkId: [],
			checkOne: false,
			lampiran: '',
			photoMode: false,
			alasan: ''
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleApprove = this.handleApprove.bind(this);
		this.handleReject = this.handleReject.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleAllCheck = this.handleAllCheck.bind(this);
		this.handleChildCheck = this.handleChildCheck.bind(this);
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

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.equalTo('status', 3);
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.find().then((x) => {
			x.map((y) => (y.select = false));
			console.log(x);
			this.setState({ late: x, loading: false });
		});
	}

	handleFilter(e) {
		e.preventDefault();
		this.setState({ loading: true });
		console.log(this.state.status);
		// alert(this.state.startDate);

		const Late = Parse.Object.extend('Late');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Late);

		// const d = new Date();
		// const start = new moment(d);
		// start.startOf('day');
		// const finish = new moment(start);
		// finish.add(1, 'day');

		// console.log(Parse.User.current().get('leaderId').id);

		// leader.id = Parse.User.current().get('leaderId').id;
		// query.equalTo('leaderId', leader);
		// query.equalTo('status', parseInt(this.state.status));
		// // query.greaterThanOrEqualTo('createdAt', start.toDate());
		// // query.lessThan('createdAt', finish.toDate());
		// query.find().then((x) => {
		// 	console.log(x);
		// 	this.setState({ late: x, loading: false });
		// });
		// Daily
		if (this.state.statusCalendar == 4) {
			// const d = new Date();
			const start = new moment(this.state.startDate);
			start.startOf('day');
			const finish = new moment(start);
			finish.add(1, 'day');

			console.log(Parse.User.current().get('leaderId').id);

			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.equalTo('status', parseInt(this.state.status));
			query.greaterThanOrEqualTo('time', start.toDate());
			query.lessThan('time', finish.toDate());
			query.find().then((x) => {
				x.map((y) => (y.select = false));
				console.log(x);
				this.setState({ late: x, loading: false });
			});
		} else if (this.state.statusCalendar == 5) {
			const start = new moment(this.state.startDate);
			start.startOf('week');
			const finish = new moment(start);
			finish.add(1, 'week');
			// const startDate = moment(this.state.startDate).startOf('isoWeek').toDate();
			// // const endDate = moment(this.state.endDate).add(7, 'day').endOf('isoWeek').toDate();
			// const endDate = moment(this.state.endDate).endOf('isoWeek').toDate();
			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.equalTo('status', parseInt(this.state.status));
			query.greaterThanOrEqualTo('time', start.toDate());
			query.lessThan('time', finish.toDate());
			query.find().then((x) => {
				x.map((y) => (y.select = false));
				console.log(x);
				this.setState({ late: x, loading: false });
			});
		} else if (this.state.statusCalendar == 6) {
			// const startDate = moment(this.state.startDate).startOf('month').toDate();
			// // const endDate = moment(this.state.endDate).add(7, 'day').endOf('month').toDate();
			// const endDate = moment(this.state.endDate).endOf('month').toDate();
			const start = new moment(this.state.startDate);
			start.startOf('month');
			const finish = new moment(start);
			finish.add(1, 'month');

			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.equalTo('status', parseInt(this.state.status));
			query.greaterThanOrEqualTo('time', start.toDate());
			query.lessThan('time', finish.toDate());
			query.find().then((x) => {
				x.map((y) => (y.select = false));
				console.log(x);
				this.setState({ late: x, loading: false });
			});
		} else {
			const d = new Date();
			const start = new moment(d);
			start.startOf('day');
			const finish = new moment(start);
			finish.add(1, 'day');

			console.log(Parse.User.current().get('leaderId').id);

			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.equalTo('status', parseInt(this.state.status));
			// query.greaterThanOrEqualTo('createdAt', start.toDate());
			// query.lessThan('createdAt', finish.toDate());
			query.find().then((x) => {
				x.map((y) => (y.select = false));
				console.log(x);
				this.setState({ late: x, loading: false });
			});
		}
	}

	approveChecked = (e) => {
		const { checkId } = this.state;
		const checkIdLength = checkId.length;
		const Izin = Parse.Object.extend('Late');
		const query = new Parse.Query(Izin);
		let totalData = 0;

		checkId.map((id) => {
			this.handleApproveAll(id);
		});
	};

	rejectChecked = (e) => {
		const { checkId } = this.state;

		checkId.map((id) => {
			this.handleRejectAll(id);
		});
	};

	handleApprove(e) {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(this.state.userId).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newOvertime = [ ...this.state.late ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					late: newOvertime,
					editMode: false,
					loading: false
				});
			});
		});
	}

	handleApproveAll(e) {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newOvertime = [ ...this.state.late ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					late: newOvertime,
					editMode: false,
					loading: false
				});
			});
		});
	}

	handleReject(e) {
		e.preventDefault();
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(this.state.userId).then((x) => {
			x.set('status', 0);
			x.set('alasanReject', this.state.alasan);
			x.save().then(() => {
				const newOvertime = [ ...this.state.late ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					late: newOvertime,
					deleteMode: false,
					loading: false
				});
			});
		});
	}

	handleRejectAll(e) {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newOvertime = [ ...this.state.late ];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					late: newOvertime,
					deleteMode: false,
					loading: false
				});
			});
		});
	}

	handleAllCheck(e) {
		let late = this.state.late;
		let collecId = [];

		late.map((x) => {
			x.select = e.target.checked;
			if (x.select) {
				collecId.push(x.id);
			} else {
				collecId = [];
			}

			return x;
		});

		this.setState({ late: late, checkId: collecId }, () => console.log(this.state.checkId));
	}

	handleChildCheck(e) {
		let { late } = this.state;
		const { checkId } = this.state;
		let checked = e.target.value;
		late.map((x) => {
			console.log('bandingkan', x.id === e.target.value);
			if (x.id === e.target.value) {
				console.log('sama');
				x.select = e.target.checked;
				if (x.select) {
					this.setState(
						(prevState) => ({
							checkId: [ ...this.state.checkId, checked ]
						}),
						() => console.log(this.state.checkId)
					);
				} else {
					const index = checkId.indexOf(checked);
					if (index > -1) {
						checkId.splice(index, 1);
						this.setState(
							(prevState) => ({
								checkId: checkId
							}),
							() => console.log(this.state.checkId)
						);
					}
				}
			}
		});

		this.setState({ late: late });
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
				this.setState({ late: z, loading: false });
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
			profile,
			statusCalendar,
			startDate
		} = this.state;
		const tooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Reject confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					loading={this.state.loading}
					handleSave={this.handleReject}
					body={
						<div>
							<p>{'Reject terlambat ' + this.state.fullnames + ' ?'}</p>
							<Form onSubmit={this.handleReject}>
								<Form.Group controlId="formAlasan">
									<Form.Control
										as="textarea"
										required={true}
										placeholder="Masukkan alasan reject"
										onChange={(e) => this.setState({ alasan: e.target.value })}
									/>
								</Form.Group>
								<Button
									variant={this.state.alasan === '' ? 'default' : 'primary'}
									type="submit"
									disabled={this.state.alasan === '' ? true : false}
								>
									Submit
								</Button>
							</Form>
						</div>
					}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Approve confirmation"
					handleSave={this.handleApprove}
					loading={this.state.loading}
					footer={true}
					handleHide={() => this.setState({ editMode: false })}
					body={'Approve late ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					size="lg"
					show={this.state.photoMode}
					title="Lampiran staff"
					//handleSave={this.handleApprove}
					loading={this.state.loading}
					saveText="Download"
					handleHide={() => this.setState({ photoMode: false })}
					body={<img width="100%" height="100%" src={this.state.lampiran} />}
				/>
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Data late"
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
																		statusCalendar:
																			e.target.value
																	});
																}}
															>
																<option value="">
																	Pilih Kategori
																</option>
																{[ 4, 5, 6 ].map((z) => (
																	<option value={z}>
																		{handleConvert(z)}
																	</option>
																))}
															</Form.Control>
														</Col>
														<Col
															sm={{ span: 3 }}
															className="pull-right"
														>
															<Form.Control
																type="date"
																value={startDate}
																onChange={(e) => {
																	console.log(e.target.value);
																	this.setState({
																		startDate: e.target.value
																	});
																}}
															/>
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
										{late.length === 0 ? (
											''
										) : !late[0].select ? (
											''
										) : (
											<Col sm={{ span: 0 }} className="float-none">
												<Button
													variant="primary"
													type="submit"
													disable={loading ? 'true' : 'false'}
													className="mr-2 m-1"
													onClick={this.approveChecked}
												>
													<i className="fa fa-check" />{' '}
													{loading ? 'Fetching...' : 'Approve'}
												</Button>
												<Button
													variant="primary"
													type="submit"
													className="m-1"
													disable={loading ? 'true' : 'false'}
													onClick={this.rejectChecked}
												>
													<i className="fa fa-close" />{' '}
													{loading ? 'Fetching...' : 'Reject'}
												</Button>
											</Col>
										)}

										<Row>
											{late.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												<Col md={12}>
													<Table striped hover>
														<thead>
															<tr>
																<th>
																	<Form.Check
																		type="checkbox"
																		onClick={
																			this.handleAllCheck
																		}
																	/>
																</th>
																<th>NAME</th>
																<th>ALASAN</th>
																<th>WAKTU</th>
																<th>ACTION</th>
															</tr>
														</thead>
														<tbody key={1}>
															{late.map((prop, key) => (
																<tr key={key}>
																	<td>
																		<Form.Check
																			type="checkbox"
																			value={prop.id}
																			checked={prop.select}
																			onChange={
																				this
																					.handleChildCheck
																			}
																			// onChange={(e) => {
																			//  const checked =
																			//      e.target.checked;

																			// }}
																		/>
																	</td>
																	<td>{prop.get('fullname')}</td>
																	<td>{prop.get('alasan')}</td>
																	<td>
																		{moment(
																			prop.get('time')
																		).format(
																			'DD/MM/YYYY [at] HH:mm:ss'
																		)}
																	</td>
																	{prop.get('status') == 3 ? (
																		<td>
																			{prop.attributes
																				.imageSelfie ==
																			undefined ? (
																				''
																			) : (
																				<OverlayTrigger
																					placement="right"
																					overlay={tooltip(
																						'Foto Absen'
																					)}
																				>
																					<Button
																						className="btn-circle btn-warning mr-2"
																						onClick={() => {
																							this.setState(
																								{
																									photoMode: true,
																									lampiran: prop.attributes.imageSelfie.url()
																								}
																							);
																						}}
																					>
																						<i className="fa fa-eye" />
																					</Button>
																				</OverlayTrigger>
																			)}
																			<OverlayTrigger
																				placement="right"
																				overlay={tooltip(
																					'Approve'
																				)}
																			>
																				<Button
																					className="btn-circle btn-warning mr-2"
																					onClick={() => {
																						this.setState(
																							{
																								editMode: true,
																								userId:
																									prop.id,
																								userIndex: key,
																								fullnames: prop.get(
																									'fullname'
																								)
																							}
																						);
																					}}
																				>
																					<i className="fa fa-check" />
																				</Button>
																			</OverlayTrigger>
																			<OverlayTrigger
																				placement="right"
																				overlay={tooltip(
																					'Reject'
																				)}
																			>
																				<Button
																					className="btn-circle btn-danger"
																					onClick={(
																						e
																					) => {
																						this.setState(
																							{
																								deleteMode: true,
																								userId:
																									prop.id,
																								userIndex: key,
																								fullnames: prop.get(
																									'fullname'
																								)
																							}
																						);
																					}}
																				>
																					<i className="fa fa-close" />
																				</Button>
																			</OverlayTrigger>
																		</td>
																	) : prop.get('status') == 0 ? (
																		<td>Rejected</td>
																	) : (
																		<td>Approved</td>
																	)}
																</tr>
															))}
														</tbody>
													</Table>
												</Col>
											)}
											{/* {late.length < 1 ? (
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
											)} */}
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
