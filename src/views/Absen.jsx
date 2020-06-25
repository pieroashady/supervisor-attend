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
import { slicename } from 'utils/slicename';

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

		this.handleSearch = this.handleSearch.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	componentDidMount() {
		this.getTrainee();
	}

	getTrainee() {
		this.setState({ loading: true });
		const Absence = Parse.Object.extend('Absence');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Absence);

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
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
			profile
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
					title="Edit content"
					handleHide={() => this.setState({ editMode: false })}
					body={''}
				/>
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Data absen"
								content={
									<div>
										<Row>
											{absence.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												absence.map((x, i) => (
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
																x.attributes.selfieImage ==
																undefined ? (
																	'https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
																) : (
																	x.attributes.selfieImage.url()
																)
															}
															name={slicename(x.get('fullname'))}
															userName={''}
															description={
																<span>
																	<span>
																		<strong>
																			Absen Masuk:
																		</strong>
																		<br />
																		{moment(
																			x
																				.get('absenMasuk')
																				.toString()
																		).format(
																			'DD/MM/YYYY [at] HH:mm:ss'
																		)}
																	</span>
																	<br />
																	<span>
																		<strong>
																			Absen Keluar:
																		</strong>
																		<br />
																		{x.get('absenKeluar') ===
																		undefined ? (
																			'-'
																		) : (
																			moment(
																				x
																					.get(
																						'absenKeluar'
																					)
																					.toString()
																			).format(
																				'DD/MM/YYYY [at] HH:mm:ss'
																			)
																		)}
																	</span>
																	{/* <br />
																	{x.dateOfBirth}
																	<br />
																	{x.phoneNumber} */}
																</span>
															}
															// socials={
															// 	<div>
															// 		{/* <OverlayTrigger
															// 			placement="right"
															// 			overlay={tooltip(
															// 				'Lihat pengerjaan quiz'
															// 			)}
															// 		>
															// 			<Link
															// 				to={`/admin/quiz/${x.objectId}`}
															// 			>
															// 				<Button simple>
															// 					<i className="fa fa-eye" />
															// 				</Button>
															// 			</Link>
															// 		</OverlayTrigger> */}
															// 		<OverlayTrigger
															// 			placement="right"
															// 			overlay={tooltip('Approve')}
															// 		>
															// 			<Button
															// 				simple
															// 				onClick={() => {
															// 					this.handleEdit(
															// 						x.objectId
															// 					);
															// 				}}
															// 			>
															// 				<i className="fa fa-check" />
															// 			</Button>
															// 		</OverlayTrigger>
															// 		<OverlayTrigger
															// 			placement="right"
															// 			overlay={tooltip('Reject')}
															// 		>
															// 			<Button
															// 				simple
															// 				onClick={(e) => {
															// 					console.log(x.id);
															// 				}}
															// 			>
															// 				<i className="fa fa-close" />
															// 			</Button>
															// 		</OverlayTrigger>
															// 	</div>
															// }
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

export default Absen;
