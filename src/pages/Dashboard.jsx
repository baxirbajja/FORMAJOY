import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const { id } = useParams();
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'etudiant'
  });

  useEffect(() => {
    if (id) {
      const userToEdit = users.find(u => u._id === id);
      if (userToEdit) {
        setEditingUser({
          ...userToEdit,
          password: ''
        });
      }
    }
  }, [id, users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newUser);
      toast.success('User created successfully');
      setNewUser({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'etudiant'
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editingUser._id}`, editingUser);
      toast.success('User updated successfully');
      setEditingUser(null);
      navigate('/dashboard');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>User Management</h2>
      
      <div className="dashboard-content">
        {editingUser ? (
          <div className="edit-user-form">
            <h3>Edit User</h3>
            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  name="nom"
                  value={editingUser.nom}
                  onChange={(e) => setEditingUser({...editingUser, nom: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prénom:</label>
                <input
                  type="text"
                  name="prenom"
                  value={editingUser.prenom}
                  onChange={(e) => setEditingUser({...editingUser, prenom: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  placeholder="Leave empty to keep current password"
                />
              </div>
              
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  required
                >
                  <option value="etudiant">Étudiant</option>
                  <option value="enseignant">Enseignant</option>
                  <option value="organisation">Organisation</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              
              <div className="button-group">
                <button type="submit" className="submit-btn">Update User</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditingUser(null);
                    navigate('/dashboard');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="add-user-form">
              <h3>Add New User</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom:</label>
                  <input
                    type="text"
                    name="nom"
                    value={newUser.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prénom:</label>
                  <input
                    type="text"
                    name="prenom"
                    value={newUser.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="etudiant">Étudiant</option>
                    <option value="enseignant">Enseignant</option>
                    <option value="organisation">Organisation</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn">Add User</button>
              </form>
            </div>
            <div className="users-list">
              <h3>Users List</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{`${user.nom} ${user.prenom}`}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => {
                            setEditingUser({ ...user, password: '' });
                            navigate(`/user/${user._id}/edit`);
                          }}
                          className="edit-btn"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="delete-btn"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}