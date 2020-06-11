import React from "react";
import { Container, Row, Form, FormGroup, FormControl, FormLabel, Button, Alert, Table } from "react-bootstrap";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			location: "",
			records: [],
			showAlert: false,
			alertMsg: "",
			alertType: "success",
			id: "",
			update: false,
		};
	}

	handleChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value,
		});
	};

	componentWillMount() {
		this.fetchAllRecords();
	}

	// add a record
	addRecord = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var body = JSON.stringify({ name: this.state.name, location: this.state.location });
		fetch("http://localhost:8000/api/create", {
			method: "POST",
			headers: myHeaders,
			body: body,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				this.setState({
					name: "",
					location: "",
					showAlert: true,
					alertMsg: result.response,
					alertType: "success",
				});
			});
	};

	// fetch All Records
	fetchAllRecords = () => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		fetch("http://localhost:8000/api/view", {
			method: "GET",
			headers: headers,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log("result", result);
				this.setState({
					records: result.response,
				});
			})
			.catch((error) => console.log("error", error));
	};

	// view single data to edit
	editRecord = (id) => {
		fetch("http://localhost:8000/api/view/" + id, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				this.setState({
					id: id,
					update: true,
					name: result.response[0].name,
					location: result.response[0].location,
				});
			})
			.catch((error) => console.log("error", error));
	};

	// update record
	updateRecord = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var body = JSON.stringify({ id: this.state.id, name: this.state.name, location: this.state.location });
		fetch("http://localhost:8000/api/update", {
			method: "PUT",
			headers: myHeaders,
			body: body,
		})
			.then((response) => response.json())
			.then((result) => {
				this.setState({
					showAlert: true,
					alertMsg: result.response,
					alertType: "success",
					update: false,
					id: "",
					name: "",
					location: "",
				});
				this.fetchAllRecords();
			})
			.catch((error) => console.log("error", error));
	};

	// delete a record
	deleteRecord = (id) => {
		fetch("http://localhost:8000/api/delete/" + id, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((result) => {
				this.setState({
					showAlert: true,
					alertMsg: result.response,
					alertType: "danger",
				});
				this.fetchAllRecords();
			})
			.catch((error) => console.log("error", error));
	};
	render() {
		return (
			<div>
				<Container>
					{this.state.showAlert === true ? (
						<Alert
							variant={this.state.alertType}
							onClose={() => {
								this.setState({
									showAlert: false,
								});
							}}
							dismissible
						>
							<Alert.Heading>{this.state.alertMsg}</Alert.Heading>
						</Alert>
					) : null}

					{/* All Records */}
					<Row>
						<Table striped bordered hover size="sm">
							<thead>
								<tr>
									<th>id</th>
									<th>Name</th>
									<th>Location</th>
									<th colSpan="2">Actions</th>
								</tr>
							</thead>
							<tbody>
								{this.state.records.map((record) => {
									return (
										<tr>
											<td>{record.id}</td>
											<td>{record.name}</td>
											<td>{record.location}</td>
											<td>
												<Button variant="info" onClick={() => this.editRecord(record.id)}>
													Edit
												</Button>
											</td>
											<td>
												<Button variant="danger" onClick={() => this.deleteRecord(record.id)}>
													Delete
												</Button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</Row>

					{/* Insert Form */}
					<Row>
						<Form>
							<FormGroup>
								<FormLabel>Enter the name</FormLabel>
								<FormControl type="text" name="name" placeholder="Enter the name" onChange={this.handleChange} value={this.state.name}></FormControl>
							</FormGroup>
							<FormGroup>
								<FormLabel>Enter the Location</FormLabel>
								<FormControl type="text" name="location" value={this.state.location} onChange={this.handleChange} placeholder="Enter the Location"></FormControl>
							</FormGroup>

							{this.state.update === true ? <Button onClick={this.updateRecord}>update</Button> : <Button onClick={this.addRecord}>Save</Button>}
						</Form>
					</Row>
				</Container>
			</div>
		);
	}
}

export default App;
