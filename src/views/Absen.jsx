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
	Table,
	Tab
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
import { slicename } from 'utils/slicename';
import { handleConvert } from 'utils/converter';

class Absen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trainee: [],
			absence: [],
			error: '',
			batch: 1,
			username: '',
			email: '',
			dob: moment(),
			pob: '',
			phoneNumber: '',
			fullname: '',
			password: '',
			passwordConf: '',
			profile: '',
			error: '',
			fullnames: '',
			traineeId: '',
			loading: false,
			addMode: false,
			editMode: false,
			deleteMode: false,
			buttonLoading: false
		};

		this.handleFilterCalendar = this.handleFilterCalendar.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	componentDidMount() {
		this.getTrainee();
		// this.getTraineeHistory();
	}

	getTrainee() {
		this.setState({ loading: true });
		const Absence = Parse.Object.extend('Absence');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.find().then((x) => {
			console.log(x);
			this.setState({ absence: x, loading: false });
		});
		// const data = {
		// 	batch: 1
		// };
		// Axios.post(baseurl('trainee/batch'), data)
		// 	.then((x) => {
		// 		this.setState({ trainee: x.data, loading: false });
		// 	})
		// 	.catch((err) => this.setState({ error: err, loading: false }));
	}

	getTraineeHistory = () => {
		this.setState({ loading: true });
		const Absence = Parse.Object.extend('Absence');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.find().then((x) => {
			console.log(x);
			this.setState({ absence: x, loading: false });
		});
		// const data = {
		// 	batch: 1
		// };
		// Axios.post(baseurl('trainee/batch'), data)
		// 	.then((x) => {
		// 		this.setState({ trainee: x.data, loading: false });
		// 	})
		// 	.catch((err) => this.setState({ error: err, loading: false }));
	};

	// handleFilterCalendar(key) {
	// 	switch (key) {
	// 		case 0:
	// 			return 'Monthly';
	// 		case 1:
	// 			return 'Weekly';
	// 		case 3:
	// 			return 'Daily';
	// 		default:
	// 			break;
	// 	}
	// }

	handleFilterCalendar = (e) => {
		e.preventDefault();
		const Absence = Parse.Object.extend('Absence');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Absence);

		// Weekly
		if (this.state.status == 5) {
			const d = new Date();
			const start = new moment(this.state.startDate);
			start.startOf('week');
			const finish = new moment(start);
			finish.add(1, 'week');
			// const startDate = moment(this.state.startDate).startOf('isoWeek').toDate();
			// // const endDate = moment(this.state.endDate).add(7, 'day').endOf('isoWeek').toDate();
			// const endDate = moment(this.state.endDate).endOf('isoWeek').toDate();
			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.greaterThanOrEqualTo('absenMasuk', start.toDate());
			query.lessThan('absenMasuk', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ absence: x, loading: false });
			});
		} else if (this.state.status == 6) {
			const start = new moment(this.state.startDate);
			start.startOf('month');
			const finish = new moment(start);
			finish.add(1, 'month');
			// const startDate = moment(this.state.startDate).startOf('month').toDate();
			// const endDate = moment(this.state.endDate).endOf('month').toDate();
			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.greaterThanOrEqualTo('absenMasuk', start.toDate());
			query.lessThan('absenMasuk', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ absence: x, loading: false });
			});
		} else if (this.state.status == 4) {
			const start = new moment(this.state.startDate);
			start.startOf('day');
			const finish = new moment(start);
			finish.add(1, 'day');
			// const endDate = moment(this.state.endDate).endOf('day').toDate();
			// const startDate = moment(this.state.startDate).startOf('day').toDate();
			leader.id = Parse.User.current().get('leaderId').id;
			query.equalTo('leaderId', leader);
			query.greaterThanOrEqualTo('absenMasuk', start.toDate());
			query.lessThan('absenMasuk', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ absence: x, loading: false });
			});
		}
	};

	handleAdd(e) {
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

		const user = new Parse.User();
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
		user
			.signUp()
			.then((x) => {
				console.log('data', x);
				this.setState({
					addMode: false,
					loading: false
				});
				window.location.reload(false);
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
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
		const { absence, error, loading, batch } = this.state;
		absence.map((x) => console.log(x.attributes));
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
			startDate,
			endDate
		} = this.state;
		const tooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Delete confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleDelete}
					body={'Delete trainee ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Foto Absen"
					handleHide={() => this.setState({ editMode: false })}
					body={<img width="100%" height="100%" src={this.state.fullnames} />}
				/>
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Data Absen"
								content={
									<div>
										<Row>
											<Col>
												<Form onSubmit={this.handleFilterCalendar}>
													<Form.Group
														as={Row}
														controlId={'formHorizontalEmail'}
													>
														<Col sm={2}>
															<p>Search by</p>
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
																required="true"
															>
																<option value="">
																	Pilih Kategori
																</option>
																{[ 4, 5, 6 ].map((x) => (
																	<option value={x}>
																		{handleConvert(x)}
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
																required="true"
															/>
														</Col>
														{/* <Col sm={{ span: 3 }} className="pull-right">
														<Form.Control
															type="date"
															value={endDate}
															onChange={(e) => {
																this.setState({ endDate: e.target.value })
															}}
															required
														/>
													</Col> */}
														<Button
															variant="primary"
															type="submit"
															disable={loading ? 'true' : 'false'}
															className="mr-2 m-1"
															// onClick={this.handleFilterCalendar}
														>
															<i className="fa fa-search" />{' '}
															{loading ? 'Fetching...' : 'Search'}
														</Button>
													</Form.Group>
												</Form>
											</Col>
										</Row>
										<Row>
											{loading ? (
												<Col md={12} className="ml-2">
													Sedang memuat data...
												</Col>
											) : absence.length < 1 ? (
												<Col md={12} className="ml-2">
													Data kosong
												</Col>
											) : (
												<Table striped hover>
													<thead>
														<tr>
															<th>No</th>
															<th>Nama</th>
															<th>Jam Masuk</th>
															<th>Jam Keluar</th>
															<th>Action</th>
														</tr>
													</thead>
													<tbody key={1}>
														{absence.length < 1 ? (
															<td className="center">
																No data found...
															</td>
														) : (
															absence.map((prop, key) => (
																<tr>
																	<td>{key + 1}</td>
																	<td>{prop.get('fullname')}</td>
																	<td>
																		{prop.get('absenMasuk') ===
																		undefined ? (
																			'-'
																		) : (
																			moment(
																				prop.get(
																					'absenMasuk'
																				)
																			).format(
																				'DD/MM/YYYY [at] HH:mm:ss'
																			)
																		)}
																	</td>
																	<td>
																		{prop.get('absenKeluar') ===
																		undefined ? (
																			'-'
																		) : (
																			moment(
																				prop.get(
																					'absenKeluar'
																				)
																			).format(
																				'DD/MM/YYYY [at] HH:mm:ss'
																			)
																		)}
																	</td>
																	<td>
																		<OverlayTrigger
																			placement="right"
																			overlay={tooltip(
																				'Foto Absen'
																			)}
																		>
																			<Button
																				className="btn-circle btn-warning mr-2"
																				onClick={() => {
																					this.setState({
																						editMode: true,
																						fullnames: prop.attributes.selfieImage.url()
																					});
																				}}
																			>
																				<i className="fa fa-eye" />
																			</Button>
																		</OverlayTrigger>
																	</td>
																</tr>
															))
														)}
													</tbody>
												</Table>
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

export default Absen;
