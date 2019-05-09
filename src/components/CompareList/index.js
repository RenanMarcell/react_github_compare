import React from 'react';
import { Container, Repository } from './styles';
import PropTypes from 'prop-types';

const CompareList = ({ repositories, removeRepository, updateRepository }) => (
    <Container>
        {repositories.length > 0 && repositories.map(repository => (
            <Repository key={repository.id}>
                <header>
                    <img src={ repository.owner.avatar_url } alt={ repository.owner.login } />
                    <strong>{ repository.name }</strong>
                    <small>{ repository.owner.login }</small>
                </header>

                <ul>
                    <li>
                        { repository.stargazers_count } <small>stars</small>
                    </li>
                    <li>
                        { repository.forks } <small>forks</small>
                    </li>
                    <li>
                        { repository.open_issues_count } <small>issues</small>
                    </li>
                    <li>
                        { repository.lastCommit } <small>last commit</small>
                    </li>
                    <li>
                        <button onClick={updateRepository} value={`${repository.owner.login}/${repository.name}`}>Atualizar</button>
                        <button onClick={removeRepository} value={repository.id}>Remover</button>
                    </li>
                </ul>
            </Repository>
        ))}
    </Container>
);

CompareList.propTypes = {
    repositories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        owner: PropTypes.shape({
            login: PropTypes.string,
            avatar_url: PropTypes.string
        }),
        stargazers_count: PropTypes.number,
        forks: PropTypes.number,
        open_issues_count: PropTypes.number,
        lastCommit: PropTypes.string
    }))
};

export default CompareList;