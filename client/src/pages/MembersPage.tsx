import { gql, useQuery } from '@apollo/client';
import MembersList from '../components/MembersList';

export const LIST_ALL_MEMBERS = gql`
  query ListAllMembers {
    listAllMembers {
      members {
        id
        firstName
        lastName
        phoneNumber
        email
        department {
          id
          name
        }
        isLoggedInUser
      }
    }
  }
`;

const MembersPage = (props: any) => {
  const { loading, data } = useQuery(LIST_ALL_MEMBERS);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="is-flex is-flex-direction-column is-align-items-center">
      <div className="title">Members</div>
      <MembersList members={data.listAllMembers.members} />
    </div>
  );
};

export default MembersPage;
