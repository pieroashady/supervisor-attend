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
import axios from 'axios';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';

import { Card } from 'components/Card/Card.jsx';
import { StatsCard } from 'components/StatsCard/StatsCard.jsx';
import { Tasks } from 'components/Tasks/Tasks.jsx';
import {
	dataPie,
	legendPie,
	dataSales,
	optionsSales,
	responsiveSales,
	legendSales,
	dataBar,
	optionsBar,
	responsiveBar,
	legendBar
} from 'variables/Variables.jsx';
import { baseurl } from 'utils/baseurl';
import Axios from 'axios';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			totalTrainee: 0,
			totalContent: 0,
			totalQuiz: 0,
			totalAbsensi: 0,
			percentage: {}
		};
	}

	componentDidMount() {
		this.getTotalTrainee();
		this.getTotalContent();
		this.getTotalQuiz();
		this.getPercentage();
	}

	getPercentage() {
		Axios.get(baseurl('score/percentage')).then((x) => {
			console.log(x);
			this.setState({ percentage: x.data });
		});
	}

	getTotalTrainee() {
		Axios.get(baseurl('trainee/total')).then((response) => {
			console.log(response.data);
			this.setState({ totalTrainee: response.data });
		});
	}

	getTotalQuiz() {
		Axios.get(baseurl('category/total')).then((x) => {
			this.setState({ totalQuiz: x.data });
		});
	}

	getTotalContent() {
		Axios.get(baseurl('content/total')).then((x) => {
			this.setState({ totalContent: x.data });
		});
	}

	createLegend(json) {
		var legend = [];
		for (var i = 0; i < json['names'].length; i++) {
			var type = 'fa fa-circle text-' + json['types'][i];
			legend.push(<i className={type} key={i} />);
			legend.push(' ');
			legend.push(json['names'][i]);
		}
		return legend;
	}
	render() {
		const { totalTrainee, totalAbsensi, totalContent, totalQuiz, percentage } = this.state;
		const dataPiex = {
			labels: [ `${percentage.passed}%`, `${percentage.failed}%` ],
			series: [ percentage.passed, percentage.failed ]
		};

		return (
			<div className="content">
				<Row>
					<Col lg={3} sm={6}>
						<StatsCard
							bigIcon={<i className="pe-7s-graph2 text-success" />}
							statsText="TRAINEE"
							statsValue={totalTrainee}
						/>
					</Col>
					<Col lg={3} sm={6}>
						<StatsCard
							bigIcon={<i className="pe-7s-graph2 text-danger" />}
							statsText="CONTENT"
							statsValue={totalContent}
						/>
					</Col>
					<Col lg={3} sm={6}>
						<StatsCard
							bigIcon={<i className="pe-7s-graph2 text-primary" />}
							statsText="QUIZ"
							statsValue={totalQuiz}
						/>
					</Col>
					<Col lg={3} sm={6}>
						<StatsCard
							bigIcon={<i className="pe-7s-graph2 text-danger" />}
							statsText="ABSENSI"
							statsValue="45"
						/>
					</Col>
				</Row>
				<Row>
					<Col lg={6} sm={6}>
						<Card
							statsIcon="fa fa-clock-o"
							title="Presentase kelulusan quiz"
							category="Last Campaign Performance"
							stats="Campaign sent 2 days ago"
							content={
								<div id="chartPreferences" className="ct-chart ct-perfect-fourth">
									<ChartistGraph data={dataPiex} type="Pie" />
								</div>
							}
							legend={<div className="legend">{this.createLegend(legendPie)}</div>}
						/>
					</Col>
					<Col lg={6} sm={6}>
						<Card
							statsIcon="fa fa-clock-o"
							title="Presentase keterlambatan hari ini"
							category="Last Campaign Performance"
							stats="Campaign sent 2 days ago"
							content={
								<div id="chartPreferences" className="ct-chart ct-perfect-fourth">
									<ChartistGraph data={dataPiex} type="Pie" />
								</div>
							}
							legend={<div className="legend">{this.createLegend(legendPie)}</div>}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const FirstDashboard = () => {
	return (
		<div>
			<Row>
				<Col lg={3} sm={6}>
					<StatsCard
						bigIcon={<i className="pe-7s-graph1 text-danger" />}
						statsText="Errors"
						statsValue="23"
						statsIcon={<i className="fa fa-clock-o" />}
						statsIconText="In the last hour"
					/>
				</Col>
				<Col lg={3} sm={6}>
					<StatsCard
						bigIcon={<i className="fa fa-twitter text-info" />}
						statsText="Followers"
						statsValue="+45"
						statsIcon={<i className="fa fa-refresh" />}
						statsIconText="Updated now"
					/>
				</Col>
			</Row>
			<Row>
				<Col md={8}>
					<Card
						statsIcon="fa fa-history"
						id="chartHours"
						title="Users Behavior"
						category="24 Hours performance"
						stats="Updated 3 minutes ago"
						content={
							<div className="ct-chart">
								<ChartistGraph
									data={dataSales}
									type="Line"
									options={optionsSales}
									responsiveOptions={responsiveSales}
								/>
							</div>
						}
						legend={<div className="legend">{this.createLegend(legendSales)}</div>}
					/>
				</Col>
				<Col md={4}>
					<Card
						statsIcon="fa fa-clock-o"
						title="Email Statistics"
						category="Last Campaign Performance"
						stats="Campaign sent 2 days ago"
						content={
							<div id="chartPreferences" className="ct-chart ct-perfect-fourth">
								<ChartistGraph data={dataPie} type="Pie" />
							</div>
						}
						legend={<div className="legend">{this.createLegend(legendPie)}</div>}
					/>
				</Col>
			</Row>

			<Row>
				<Col md={6}>
					<Card
						id="chartActivity"
						title="2014 Sales"
						category="All products including Taxes"
						stats="Data information certified"
						statsIcon="fa fa-check"
						content={
							<div className="ct-chart">
								<ChartistGraph
									data={dataBar}
									type="Bar"
									options={optionsBar}
									responsiveOptions={responsiveBar}
								/>
							</div>
						}
						legend={<div className="legend">{this.createLegend(legendBar)}</div>}
					/>
				</Col>

				<Col md={6}>
					<Card
						title="Tasks"
						category="Backend development"
						stats="Updated 3 minutes ago"
						statsIcon="fa fa-history"
						content={
							<div className="table-full-width">
								<table className="table">
									<Tasks />
								</table>
							</div>
						}
					/>
				</Col>
			</Row>
		</div>
	);
};

const SecondDashboard = () => {
	return (
		<div>
			<div className="row">
				<div className="col-xl-6 col-md-6 mb-2">
					<div className="card border-left-success shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-success text-uppercase mb-1">
										Completed(11)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												42
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 22 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">33</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6 col-md-6 mb-2">
					<div className="card border-left-primary shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
										Uncompleted
									</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">23</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">42</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-info shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-info text-uppercase mb-1">
										Approved (55)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												33
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 41 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">44</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-warning shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
										Rejected (41)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												33
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 22 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">41</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-danger shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
										Cancelled (21)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												24
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 33 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">44</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-gray shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-gray text-uppercase mb-1">
										PENDING
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												21
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 22 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">32</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="d-sm-flex align-items-center justify-content-between">
				<h1 className="h3 mb-0 text-gray-800">Service level</h1>
			</div>

			<div className="row justify-content-center mb-4">
				<div className="d-flex justify-content-start mb-2">
					<svg
						className="hexagon green noselect"
						data-progress={24}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							Same day
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>

				<div className="d-flex justify-content-start">
					<svg
						className="hexagon primary noselect"
						data-progress={32}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							1 day
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>

						<text className="text" x="50%" y="122%">
							1 day
						</text>
					</svg>
				</div>
				<div className="d-flex justify-content-start">
					<svg
						className="hexagon blue noselect"
						data-progress={23}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							2 days
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>
				<div className="d-flex justify-content-start">
					<svg
						className="hexagon yellow noselect"
						data-progress={12}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							3 days
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>
				<div className="d-flex justify-content-start">
					<svg
						className="hexagon red noselect"
						data-progress={20}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							&gt;3 days
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
