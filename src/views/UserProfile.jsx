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
			buttonLoading: false,
			checkAll: false,
			checkId: [],
			checkOne: false,
			lampiran: '',
			photoMode: false
		};

		this.handleApprove = this.handleApprove.bind(this);
		this.handleReject = this.handleReject.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleAllCheck = this.handleAllCheck.bind(this);
		this.handleChildCheck = this.handleChildCheck.bind(this);
	}

	componentDidMount() {
		this.getTrainee();
	}

	handleAllCheck(e) {
		let izin = this.state.izin;
		let collecId = [];

		izin.map((x) => {
			x.isChecked = e.target.checked;
			if (x.isChecked) {
				collecId.push(x.id);
			} else {
				collecId = [];
			}

			return x;
		});

		this.setState({ izin: izin, checkId: collecId }, () => console.log(this.state.checkId));
	}

	handleChildCheck(e) {
		let { izin } = this.state;
		const { checkId } = this.state;
		let checked = e.target.value;
		izin.map((x) => {
			console.log('bandingkan', x.id === e.target.value);
			if (x.id === e.target.value) {
				console.log('sama');
				x.isChecked = e.target.checked;
				if (x.isChecked) {
					this.setState(
						(prevState) => ({
							checkId: [...this.state.checkId, checked]
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

		this.setState({ izin: izin });
	}

	approveChecked = (e) => {
		const { checkId } = this.state;
		const checkIdLength = checkId.length;
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);
		let totalData = 0;

		checkId.map((id) => {
			this.handleApproveAll(id);
			// console.log(id);
			//query.equalTo('objectId', id);
			// query.get(id).then((x) => {
			// 	// x.set('status', 1);
			// 	// x.save().then((x) => {
			// 	//  console.log('success');
			// 	// });
			// 	console.log(x);
			// });
			// query
			//  .get(id)
			//  .then((x) => {
			//      x.set('status', 1);
			//      x
			//          .save()
			//          .then((x) => {
			//              console.log('success');
			//              totalData++;
			//              if (totalData == checkIdLength) {
			//                  console.log('stop');
			//                  this.setState({ checkId: [] });
			//              }
			//          })
			//          .catch((err) => this.setState({ error: err }));
			//  })
		});
	};

	rejectChecked = (e) => {
		const { checkId } = this.state;

		checkId.map((id) => {
			this.handleRejectAll(id);
		})
	};

	handleApprove(e) {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(this.state.userId).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newOvertime = [...this.state.izin];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					izin: newOvertime,
					editMode: false,
					loading: false
				});
			});
		});
	}

	handleApproveAll(e) {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newOvertime = [...this.state.izin];
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
				const newOvertime = [...this.state.izin];
				newOvertime.splice(this.state.userIndex, 1);
				this.setState({
					izin: newOvertime,
					deleteMode: false,
					loading: false
				});
			});
		});
	}

	handleRejectAll(e) {
		this.setState({ loading: false });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newOvertime = [...this.state.izin];
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

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');
		console.log('start', start.toDate());
		console.log('finsih', finish.toDate());
		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.equalTo('status', 3);
		query.equalTo('statusIzin', 1);
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
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

		// const d = new Date();
		// const start = new moment(d);
		// start.startOf('day');
		// const finish = new moment(start);
		// finish.add(1, 'day');

		// console.log(Parse.User.current().get('leaderId').id);

		// leader.id = Parse.User.current().get('leaderId').id;
		// query.equalTo('leaderId', leader);
		// query.equalTo('status', parseInt(this.state.status));
		// query.equalTo('statusIzin', 1);
		// // query.greaterThanOrEqualTo('createdAt', start.toDate());
		// // query.lessThan('createdAt', finish.toDate());
		// query.find().then((x) => {
		// 	console.log(x);
		// 	this.setState({ izin: x, loading: false });
		// }).catch((error) => {
		// 	this.setState({ loading: false });
		// 	console.log(error);
		// });
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
			query.equalTo('statusIzin', 1);
			query.greaterThanOrEqualTo('date', start.toDate());
			query.lessThan('date', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ izin: x, loading: false });
			}).catch((error) => {
				this.setState({ loading: false });
				console.log(error);
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
			query.equalTo('statusIzin', 1);
			query.greaterThanOrEqualTo('date', start.toDate());
			query.lessThan('date', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ izin: x, loading: false });
			}).catch((error) => {
				this.setState({ loading: false });
				console.log(error);
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
			query.equalTo('statusIzin', 1);
			query.greaterThanOrEqualTo('date', start.toDate());
			query.lessThan('date', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ izin: x, loading: false });
			}).catch((error) => {
				this.setState({ loading: false });
				console.log(error);
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
			query.equalTo('statusIzin', 1);
			// query.greaterThanOrEqualTo('createdAt', start.toDate());
			// query.lessThan('createdAt', finish.toDate());
			query.find().then((x) => {
				console.log(x);
				this.setState({ izin: x, loading: false });
			}).catch((error) => {
				this.setState({ loading: false });
				console.log(error);
			});
		}
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
					handleSave={this.handleReject}
					loading={this.state.loading}
					body={'Reject izin ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					show={this.state.deleteMode}
					title="Reject confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleReject}
					loading={this.state.loading}
					body={'Reject izin ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					size="lg"
					show={this.state.photoMode}
					title="Lampiran staff"
					//handleSave={this.handleApprove}
					loading={this.state.loading}
					saveText="Download"
					handleHide={() => this.setState({ photoMode: false })}
					body={<img width="100%" height={300} src={this.state.lampiran} />}
				/>

				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Request izin"
								ctTableFullWidth
								ctTableResponsive
								content={
									<div>
										<Row>
											<Col sm={6}>
												<Form
													onSubmit={this.handleFilter}
													style={{ marginBottom: '20px' }}
												>
													<Form.Group
														as={Row}
														controlId="formHorizontalEmail"
													>
														<Col sm={4}>
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
																		statusCalendar: e.target.value
																	});
																}}
															>
																<option value="">Pilih Kategori</option>
																{[4, 5, 6].map((z) => (
																	<option value={z}>
																		{handleConvert(z)}
																	</option>
																))}
															</Form.Control>
														</Col>
														<Col sm={{ span: 3 }} className="pull-right">
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
														<Col sm={4}>
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
										<Row>
											{izin.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
													<Col md={12}>
														<Table striped hover>
															<thead>
																<tr>
																	<th>
																		<Form.Check
																			type="checkbox"
																			onClick={this.handleAllCheck}
																		/>
																	</th>
																	<th>NAME</th>
																	<th>DESKRIPSI IZIN</th>
																	<th>ALASAN IZIN</th>
																	<th>DARI</th>
																	<th>SAMPAI</th>
																	<th>ACTION</th>
																</tr>
															</thead>
															<tbody key={1}>
																{izin.map((prop, key) => (
																	<tr key={key}>
																		<td>
																			<Form.Check
																				type="checkbox"
																				value={prop.id}
																				checked={prop.isChecked}
																				onChange={
																					this.handleChildCheck
																				}
																			// onChange={(e) => {
																			//  const checked =
																			//      e.target.checked;

																			// }}
																			/>
																		</td>
																		<td>{prop.get('fullname')}</td>
																		<td>{prop.get('descIzin')}</td>
																		<td>{prop.get('alasanIzin')}</td>
																		<td>
																			{moment(
																				prop.get('dari')
																			).format('DD/MM/YYYY')}
																		</td>
																		<td>
																			{moment(
																				prop.get('sampai')
																			).format('DD/MM/YYYY')}
																		</td>
																		{prop.get('status') == 3 ?
																			<td>
																				{prop.attributes.attachFile ==
																					undefined ? (
																						''
																					) : (
																						<OverlayTrigger
																							placement="right"
																							overlay={tooltip(
																								'Lampiran'
																							)}
																						>
																							<Button
																								className="btn-circle btn-warning mr-2"
																								onClick={() => {
																									this.setState({
																										photoMode: true,
																										lampiran: prop.attributes.attachFile.url()
																									});
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
																							this.setState({
																								editMode: true,
																								userId: prop.id,
																								userIndex: key,
																								fullnames: prop.get(
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
																						className="btn-circle btn-danger"
																						onClick={(e) => {
																							this.setState({
																								deleteMode: true,
																								userId: prop.id,
																								userIndex: key,
																								fullnames: prop.get(
																									'fullname'
																								)
																							});
																						}}
																					>
																						<i className="fa fa-close" />
																					</Button>
																				</OverlayTrigger>
																			</td>
																			: prop.get('status') == 0 ? (<td>Rejected</td>) : (<td>Approved</td>)}
																	</tr>
																))}
															</tbody>
														</Table>
													</Col>
													// <Col md={3}>
													//  <UserCard
													//      out={x.status}
													//      bgImage={
													//          <img
													//              src="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
													//              alt="..."
													//          />
													//      }
													//      avatar={
													//          x.attributes.attachFile ==
													//          undefined ? (
													//              'https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
													//          ) : (
													//              x.attributes.attachFile.url()
													//          )
													//      }
													//      name={x
													//          .get('fullname')
													//          .split(' ')
													//          .slice(0, 2)
													//          .join(' ')}
													//      userName={x.get('descIzin')}
													//      description={
													//          <span>
													//              <strong>Alasan</strong>
													//              <br />
													//              {x.get('alasanIzin') !== '-' ||
													//              x.get('alasanIzin') ===
													//                  undefined ? (
													//                  x.get('alasanIzin')
													//              ) : (
													//                  'Surat terlampir'
													//              )}
													//              {/* <br />
													//              {x.dateOfBirth}
													//              <br />
													//              {x.phoneNumber} */}
													//          </span>
													//      }
													//      status={x.get('status')}
													//      socials={
													//          <div>
													//              <OverlayTrigger
													//                  placement="right"
													//                  overlay={tooltip('Approve')}
													//              >
													//                  <Button
													//                      simple
													//                      onClick={() => {
													//                          this.setState({
													//                              editMode: true,
													//                              userId: x.id,
													//                              userIndex: i,
													//                              fullnames: x.get(
													//                                  'fullname'
													//                              )
													//                          });
													//                      }}
													//                  >
													//                      <i className="fa fa-check" />
													//                  </Button>
													//              </OverlayTrigger>
													//              <OverlayTrigger
													//                  placement="right"
													//                  overlay={tooltip('Reject')}
													//              >
													//                  <Button
													//                      simple
													//                      onClick={(e) => {
													//                          this.setState({
													//                              deleteMode: true,
													//                              userId: x.id,
													//                              userIndex: i,
													//                              fullnames: x.get(
													//                                  'fullname'
													//                              )
													//                          });
													//                      }}
													//                  >
													//                      <i className="fa fa-close" />
													//                  </Button>
													//              </OverlayTrigger>
													//          </div>
													//      }
													//  />
													// </Col>
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