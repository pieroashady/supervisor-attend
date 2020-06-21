import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

class ViewTrainee extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const id = this.props.match.params.id;
		const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;

		return (
			<div>
				<OverlayTrigger placement="right" overlay={remove}>
					<p>Hello</p>
				</OverlayTrigger>
			</div>
		);
	}
}

export default ViewTrainee;
