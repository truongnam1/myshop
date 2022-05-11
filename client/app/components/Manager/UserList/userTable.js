import React, {useEffect, useState} from 'react';
import { NavItem, Table } from 'reactstrap';
import { getAll } from '../../../containers/Users/actions';
import { formatDate } from '../../../helpers/date';
import UserRole from '../UserRole';
import Pagination from '../../Pagination';
const UserTable = (props) => {

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const getUsers = async (params) => {
      const result = await getAll(params);
      if(result) {
        setPagination(result.pagination);
          setUsers(result.data);
      }
    }

    const renderTable = (data) => {
      return data.map((user, index) => {
        return (
          <tr key={user.id}>
            <th scope="row">{index + 1}</th>
            <td>{user.firstName + ' '  + user.lastName}</td>
            <td>{user.email}</td>
            <td>{formatDate(user.created)}</td>
            <td> <UserRole user={user} className='d-inline-block mt-2' /></td>
          </tr>
        )
      })
    }
    useEffect(() => {
      getUsers({limit: 5, page: 1});
    },[]);


    return (
      
      <>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {renderTable(users)}
          
        </tbody>
      </Table>
      <Pagination totalPage={pagination.totalPage} changePage={getUsers}/>
      </>
    );
}

export default UserTable;