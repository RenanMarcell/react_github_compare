import React from 'react';
import moment from 'moment';

import logo from '../../assets/logo.png';
import { Container, Form } from "./styles";
import CompareList from '../../components/CompareList';
import api from '../../services/api';

class Main extends React.Component {
    constructor(props) {
        super(props);
        const hasStorage = typeof (Storage) !== "undefined";
        const repositories = hasStorage && localStorage.getItem('repositories') !== null ?
            JSON.parse(localStorage.getItem('repositories')) :
            [];

        this.state = {
            loading: false,
            repositoryInput: '',
            repositories,
            repositoryError: false
        };
    };

    handleInputChange = (e) => {
        const inputValue = e.target.value;
        this.setState({ repositoryInput: inputValue })
    };

    handleAddRepository = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        try {
            const { data } = await api.get(`repos/${this.state.repositoryInput}`);
            data.lastCommit = moment(data.pushed_at).fromNow();

            this.setState({
                repositories: [ ...this.state.repositories, data ],
                repositoryInput: '',
                repositoryError: false
            });

            localStorage.setItem('repositories', JSON.stringify([ ...this.state.repositories ]));
        } catch (err) {
            this.setState({
                repositoryError: true
            });
        }
        this.setState({ loading: false });
    };

    removeRepository = e => {
        const id = e.target.value;
        const filteredRepositories = this.state.repositories.filter(repository => (
            String(repository.id) !== String(id)
        ));
        this.setState({ repositories: filteredRepositories });
        localStorage.setItem('repositories', JSON.stringify([ ...this.state.repositories ]));
    };

    updateRepository = async e => {
        const value = e.target.value;
        try {
            const { data } = await api.get(`repos/${value}`);
            data.lastCommit = moment(data.pushed_at).fromNow();

            const filteredRepositories = this.state.repositories.filter(repository => (
                String(repository.id) !== String(data.id)
            ));

            this.setState({
                repositories: [ ...filteredRepositories, data ],
                repositoryInput: '',
                repositoryError: false
            });

            localStorage.setItem('repositories', JSON.stringify([ ...this.state.repositories ]));
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        return (
            <Container>
                <img src={logo} alt="Github Compare Logo"/>

                <Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
                    <input
                        type="text"
                        placeholder="usuário/repositório"
                        value={this.state.repositoryInput}
                        onChange={this.handleInputChange}
                    />
                    <button type="submit">{this.state.loading ?
                        <i className="fa fa-spinner fa-pulse" /> :
                        'OK'
                    }</button>
                </Form>

                <CompareList
                    repositories={this.state.repositories}
                    removeRepository={this.removeRepository}
                    updateRepository={this.updateRepository}
                />
            </Container>
        )

    }
};

export default Main;