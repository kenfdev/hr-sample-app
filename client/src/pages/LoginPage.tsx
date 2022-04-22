import React from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { client } from '..';

type Props = {
  onLogin: () => Promise<void>;
};

const LoginPage: React.FC<Props> = (props) => {
  const history = useHistory();

  const handleClick = async (userId: string) => {
    localStorage.removeItem('token');
    await client.clearStore();

    localStorage.setItem('token', userId);

    await props.onLogin();

    history.push('/members');
  };
  const renderListItems = () => {
    // hard coded users
    const users = [
      {
        userId: '7f19d65a-3ef2-4e9a-ac20-a1984a6dd2f8',
        description: 'Member of HR Department',
        isAdmin: false,
      },
      {
        userId: '508351ce-2c96-41d6-9764-0abd6c12e3f1',
        description: 'Member of ITSec Department',
        isAdmin: true,
      },
      {
        userId: '574319c9-7d97-4616-8ae6-ee78377e0cb6',
        description: 'Member of Engineering Department',
        isAdmin: false,
      },
      {
        userId: 'cf02fc55-5942-49ee-8193-70b002e92ef8',
        description: 'Manager of Engineering Department',
        isAdmin: false,
      },
    ];

    return users.map((u) => (
      <li key={u.userId} onClick={() => handleClick(u.userId)}>
        <Card className="card is-clickable">
          <div className="card-content">
            <div className="is-size-4">{u.description}</div>
            <p>{u.isAdmin ? 'Admin' : null}</p>
          </div>
        </Card>
      </li>
    ));
  };

  return (
    <Container>
      <LoginContainer>
        <div className="has-text-centered is-full title">Login As...</div>
        <div className="columns ">
          <ul className="column is-offset-one-quarter is-half">
            {renderListItems()}
          </ul>
        </div>
      </LoginContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
`;

const LoginContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Card = styled.div`
  & {
    border-bottom: #f0f0f0 solid 1px;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

export default LoginPage;
