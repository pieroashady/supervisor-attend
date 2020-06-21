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

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trainee: [],
			izin: [],
			error: '',
			userId: '',
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
	}

	componentDidMount() {
		this.getTrainee();
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
					body={'Delete trainee ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Approve confirmation"
					handleSave={this.handleApprove}
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
											{izin.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												izin.map((x, i) => (
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
																x.attributes.attachFile ==
																undefined ? (
																	'https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
																) : (
																	x.attributes.attachFile.url()
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
																	Alasan :{' '}
																	{x.get('alasanIzin') !== '-' ||
																	x.get('alasanIzin') ===
																		undefined ? (
																		x.get('alasanIzin')
																	) : (
																		'Surat terlampir'
																	)}
																	{/* <br />
																	{x.dateOfBirth}
																	<br />
																	{x.phoneNumber} */}
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
																					editMode: true,
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

export default UserProfile;
