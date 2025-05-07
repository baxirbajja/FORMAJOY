import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Teachers.css'

export default function Teachers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingTeacher, setEditingTeacher] = useState(null);

  const sortTeachers = (teachersList) => {
    return [...teachersList].sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
  };

  const { id } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'enseignant',
    telephone: '',
    specialite: '',
    pourcentageProfit: 0,
    salaire: 0,
    heuresDisponibles: [],
    sessionsParSemaine: 0,
    statut: 'actif'
  });

  useEffect(() => {
    if (id) {
      const teacherToEdit = teachers.find(t => t._id === id);
      if (teacherToEdit) {
        setEditingTeacher({
          ...teacherToEdit,
          password: ''
        });
      }
    }
  }, [id, teachers]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/users');
      const filteredTeachers = response.data.data.filter(user => user.role === 'enseignant');
      const sortedTeachers = sortTeachers(filteredTeachers);
      setTeachers(sortedTeachers);
    } catch (error) {
      toast.error('Failed to fetch teachers');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newTeacher);
      toast.success('Teacher created successfully');
      setNewTeacher({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'enseignant',
        telephone: '',
        specialite: '',
        pourcentageProfit: 0,
        salaire: 0,
        heuresDisponibles: [],
        sessionsParSemaine: 0,
        statut: 'actif'
      });
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create teacher');
    }
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editingTeacher._id}`, editingTeacher);
      toast.success('Teacher updated successfully');
      setEditingTeacher(null);
      navigate('/dashboard/teachers');
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update teacher');
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`/api/users/${teacherId}`);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const handleSort = (field) => {
    const direction = (sortField === field && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sortedTeachers = sortTeachers(teachers);
    setTeachers(sortedTeachers);
  };

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Teacher Management</h2>
      <div className="dashboard-content">
        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-teacher-btn"
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px',
              width: 'fit-content',
              maxHeight:'60px'
            }}
          >
            Ajouter un Nouvel Enseignant
          </button>
        ) : (
          <div className="add-teacher-form">
            {/* Form fields for adding a new teacher */}
          </div>
        )}
        {editingTeacher && (
          <div className="edit-user-form">
            {/* Form fields for editing a teacher */}
          </div>
        )}
        <div className="users-list">
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <table>
            <thead>
              <tr>
                <th style={{cursor:"pointer"}} onClick={() => handleSort('nom')}>Name {sortField === 'nom' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('telephone')}>Phone {sortField === 'telephone' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th style={{cursor:"pointer"}} onClick={() => handleSort('specialite')}>Specialty {sortField === 'specialite' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers
                .filter(teacher => 
                  teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(teacher => (
                <tr key={teacher._id}>
                  <td>{`${teacher.nom} ${teacher.prenom}`}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.telephone}</td>
                  <td>{teacher.specialite}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => navigate(`/teacher-profile/${teacher._id}`)}
                      className="view-profile-btn"
                    >
                      Voir le profil
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/teachers/${teacher._id}/edit`)}
                      className="edit-btn"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
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
      </div>
    </div>
  );
}
