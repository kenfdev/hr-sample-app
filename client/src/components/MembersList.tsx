import React from 'react';
import { Member } from '../models/member';
import { Link } from 'react-router-dom';

type Props = {
  members: Member[];
};

const MembersList: React.FC<Props> = ({ members }) => {
  const renderMembers = () => {
    return members.map((m) => (
      <tr key={m.id}>
        <td>
          <span className="icon mr-1">
            <i className="fas fa-user"></i>
          </span>
          <Link to={`/members/${m.id}`}>
            {m.firstName} {m.lastName}
            {m.isLoggedInUser ? '(You)' : null}
          </Link>
        </td>
        <td>
          <span className="icon mr-1">
            <i className="fas fa-building"></i>
          </span>
          {m.department.name}
        </td>
        <td>
          <span className="icon mr-1">
            <i className="fas fa-mobile"></i>
          </span>
          {m.phoneNumber}
        </td>
        <td>
          <span className="icon mr-1">
            <i className="fas fa-envelope"></i>
          </span>
          {m.email}
        </td>
        <td></td>
      </tr>
    ));
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Phone</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{renderMembers()}</tbody>
    </table>
  );
};

export default MembersList;
