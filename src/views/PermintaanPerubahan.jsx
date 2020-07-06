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
import Button from 'components/CustomButton/CustomButton.jsx';
import FileBase64 from 'react-file-base64';
import Axios from 'axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Parse from 'parse';
import ModalHandler from './Category/ModalHandler';
import moment from 'moment';
import './Category/datepicker.css';
import DateTime from 'react-datetime';

class PermintaanPerubahan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainee: [],
            staff: [],
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
            photoMode: false,
            searchValue: '',
            searchBy: 'all',
            fotoWajah: '',
            message: '',
            loadingReco: false,
            nama: '',
            nik: '',
            tipeKaryawan: 'Karyawan tetap',
            posisi: '',
            level: '',
            imei: '',
            jamKerja: 'Jam tetap',
            lokasiKerja: 'Tetap',
            jumlahCuti: 0,
            lembur: 'ya',
            username: '',
            password: '',
            statusReco: 0,
            field: [],
            value: []
        };

        //this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        this.getStaff();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let fotoWajahBase64 = '';
        this.getBase64(this.state.fotoWajah, (result) => {
            console.log(result);
            fotoWajahBase64 = result.split(',')[1];
        });
        const { userId, fotoWajah, imei, lokasiKerja, jamKerja, jumlahCuti, lembur } = this.state;

        const ChangeRequest = Parse.Object.extend('ChangeRequest');
        const cr = new ChangeRequest();

        cr.set('userId', Parse.User.createWithoutData(userId));
        cr.set('fotoWajah', new Parse.File('foto_wajah.jpg', fotoWajah));
        cr.set('imei', imei);
        cr.set('jamKerja', jamKerja);
        cr.set('lokasiKerja', lokasiKerja);
        cr.set('jumlahCuti', parseInt(jumlahCuti));
        cr.set('lembur', lembur);

        cr
            .save()
            .then((x) => {
                alert('Succes melakukan request!');
                this.setState({ editMode: false });
            })
            .catch((err) => {
                alert(err.message);
                this.setState({ editMode: false });
            });
    };

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    handleFace = (e) => {
        this.setState({
            loadingReco: true,
            statusReco: 0,
            fotoWajah: e.target.files[0],
            field: this.state.field.concat('fotoWajah'),
            value: this.state.value.concat(e.target.files[0])
        });

        const formData = new FormData();
        formData.append('knax', e.target.files[0]);

        Axios.post('http://35.247.147.177:4000/api/face-check', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(({ data }) => {
                if (data.status === 1)
                    return this.setState({
                        statusReco: 1,
                        message: `✔️ ${data.message}`,
                        loadingReco: false
                    });
                return this.setState({
                    statusReco: 0,
                    message: `✖️ ${data.message}`,
                    loadingReco: false
                });
            })
            .catch((err) => alert('Terjadi error...'));
    };

    handleFilter = (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const { searchBy, searchValue } = this.state;

        console.log(searchBy);

        if (searchBy === 'name') {
            const User = new Parse.User();
            const query = new Parse.Query(User);
            query.matches('fullname', searchValue, 'i');
            query.equalTo('roles', 'staff');
            query
                .find()
                .then((name) => {
                    this.setState({ staff: name, loading: false });
                })
                .catch((err) => alert(err.message));
            return;
        }

        if (searchBy === 'all') {
            const User = new Parse.User();
            const query = new Parse.Query(User);
            query.equalTo('roles', 'staff');
            query
                .find()
                .then((name) => {
                    this.setState({ staff: name, loading: false });
                })
                .catch((err) => alert(err.message));
            return;
        }

        const User = new Parse.User();
        const query = new Parse.Query(User);
        query.equalTo('nik', searchValue.toUpperCase());
        query.equalTo('roles', 'staff');
        query
            .find()
            .then((x) => {
                console.log(x);
                this.setState({ staff: x, loading: false });
            })
            .catch((err) => alert(err.message));
    };

    getStaff() {
        this.setState({ loading: true });
        const User = new Parse.User();
        const query = new Parse.Query(User);

        const d = new Date();
        const start = new moment(d);
        start.startOf('day');
        const finish = new moment(start);
        finish.add(1, 'day');
        console.log('start', start.toDate());
        console.log('finsih', finish.toDate());

        query.equalTo('roles', 'staff');
        query
            .find()
            .then((x) => {
                console.log(x);
                console.log('status', x[0]);
                this.setState({ staff: x, loading: false });
            })
            .catch((err) => alert(err.message));
    }

    render() {
        const { staff, loading, loadingReco, message } = this.state;
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
                    show={this.state.photoMode}
                    title="Foto"
                    loading={this.state.loading}
                    handleHide={() => this.setState({ photoMode: false })}
                    body={<img width="100%" height="100%" src={this.state.lampiran} />}
                />
                <ModalHandler
                    show={this.state.editMode}
                    title="Tambah karyawan"
                    handleHide={() => this.setState({ editMode: false })}
                    body={
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formCategory">
                                <Form.File label="Foto wajah" onChange={this.handleFace} />
                                <Form.Text
                                    className={loadingReco ? 'text-muted' : ''}
                                    style={{
                                        color: `${this.state.statusReco == 0 ? 'red' : 'green'}`
                                    }}
                                >
                                    {loadingReco ? 'processing...' : message}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formImei">
                                <Form.Label>IMEI</Form.Label>
                                <Form.Control
                                    autoCapitalize="true"
                                    autoComplete="false"
                                    type="text"
                                    placeholder="Masukkan imei hp"
                                    onChange={(e) =>
                                        this.setState({
                                            imei: e.target.value,
                                            value: this.state.value.concat(e.target.value),
                                            field: this.state.field.concat('imei')
                                        })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formJam">
                                <Form.Label>Jam kerja</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue="all"
                                    onChange={(e) =>
                                        this.setState({
                                            jamKerja: e.target.value,
                                            field: this.state.field.concat('jamKerja'),
                                            value: this.state.value.concat(e.target.value)
                                        })}
                                >
                                    {['Jam tetap', 'Jam fleksibel', 'Jam bebas'].map((x) => (
                                        <option value={x}>{x}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formLokasi">
                                <Form.Label>Lokasi kerja</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue="all"
                                    onChange={(e) =>
                                        this.setState({
                                            lokasiKerja: e.target.value,
                                            field: this.state.field.concat('lokasiKerja'),
                                            value: this.state.value.concat(e.target.value)
                                        })}
                                >
                                    {['Tetap', 'Bebas (mobile)'].map((x) => (
                                        <option value={x}>{x}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formCuti">
                                <Form.Label>Jumlah cuti</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Masukkan jumlah cuti"
                                    onChange={(e) =>
                                        this.setState({
                                            jumlahCuti: parseInt(e.target.value),
                                            field: this.state.field.concat('jumlahCuti'),
                                            value: this.state.value.concat(parseInt(e.target.value))
                                        })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLembut">
                                <Form.Label>Lembur</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue="all"
                                    onChange={(e) =>
                                        this.setState({
                                            lembur: e.target.value,
                                            field: this.state.field.concat('lembur'),
                                            value: this.state.value.concat(e.target.value)
                                        })}
                                >
                                    {['Ya', 'Tidak'].map((x) => <option value={x}>{x}</option>)}
                                </Form.Control>
                            </Form.Group>

                            <Button
                                variant={this.state.statusReco === 0 ? 'default' : 'primary'}
                                type="submit"
                                disabled={this.state.statusReco === 0 ? true : false}
                            >
                                {this.state.statusReco === 0 ? (
                                    'upload foto dahulu'
                                ) : this.state.loading ? (
                                    'Please wait..'
                                ) : (
                                            'Submit'
                                        )}
                            </Button>
                        </Form>
                    }
                />

                <Container fluid>
                    <Row>
                        <Col md={12}>
                            <Card
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
                                                        controlId="formHorizontalEmails"
                                                    >
                                                        <Col sm={2}>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue="all"
                                                                onChange={(e) =>
                                                                    this.setState({
                                                                        searchBy: e.target.value
                                                                    })}
                                                            >
                                                                {[
                                                                    'all',
                                                                    'nik',
                                                                    'name'
                                                                ].map((x) => (
                                                                    <option value={x}>{x}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                        <Col sm={4} className="pull-right">
                                                            <Form.Control
                                                                disabled={
                                                                    this.state.searchBy ===
                                                                        'all' ? (
                                                                            true
                                                                        ) : (
                                                                            false
                                                                        )
                                                                }
                                                                type="text"
                                                                placeholder={`Masukkan ${this.state
                                                                    .searchBy}`}
                                                                onChange={(e) =>
                                                                    this.setState({
                                                                        searchValue: e.target.value
                                                                    })}
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
                                        <Row>
                                            {staff.length < 1 ? (
                                                <Col md={12}>No data found...</Col>
                                            ) : (
                                                    <Table striped hover id="ekspor">
                                                        <thead>
                                                            <tr>
                                                                <th>NIK</th>
                                                                <th>NAMA</th>
                                                                <th>JAM KERJA</th>
                                                                <th>SISA CUTI</th>
                                                                <th>LEMBUR</th>
                                                                <th>LOKASI KERJA</th>
                                                                <th>ACTION</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody key={1}>
                                                            {staff.map((prop, key) => (
                                                                <tr key={key}>
                                                                    <td>{prop.get('nik')}</td>
                                                                    <td>{prop.get('fullname')}</td>
                                                                    <td>{prop.get('jamKerja')}</td>
                                                                    <td>{prop.get('jumlahCuti')}</td>
                                                                    <td>{prop.get('lembur')}</td>
                                                                    <td>{prop.get('lokasiKerja')}</td>
                                                                    <td>
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={tooltip(
                                                                                'Lihat detail'
                                                                            )}
                                                                        >
                                                                            <Button
                                                                                className="btn-circle btn-primary mr-1"
                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        photoMode: true,
                                                                                        lampiran: prop.attributes.fotoWajah.url()
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-eye" />
                                                                            </Button>
                                                                        </OverlayTrigger>

                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={tooltip(
                                                                                'Request ubah data'
                                                                            )}
                                                                        >
                                                                            <Button
                                                                                className="btn-circle btn-warning mr-1"
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
                                                                                <i className="fa fa-edit" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            overlay={tooltip('Hapus')}
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
                                                                                <i className="fa fa-trash" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    </td>
                                                                </tr>
                                                            ))}
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

export default PermintaanPerubahan;