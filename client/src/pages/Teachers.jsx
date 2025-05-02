import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import '../styles/Dashboard.css';
import '../styles/Teachers.css'

export default function Teachers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const { id } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'enseignant',
    telephone: '',
    adresse: '',
    specialite: '',
    pourcentageProfit: 0,
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
      setTeachers(filteredTeachers);
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
        adresse: '',
        specialite: '',
        pourcentageProfit: 0,
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3>Ajouter un Nouvel Enseignant</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Fermer
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  name="nom"
                  value={newTeacher.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prénom:</label>
                <input
                  type="text"
                  name="prenom"
                  value={newTeacher.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newTeacher.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mot de passe:</label>
                <input
                  type="password"
                  name="password"
                  value={newTeacher.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Téléphone:</label>
                <input
                  type="tel"
                  name="telephone"
                  value={newTeacher.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Adresse:</label>
                <input
                  type="text"
                  name="adresse"
                  value={newTeacher.adresse}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Spécialité:</label>
                <input
                  type="text"
                  name="specialite"
                  value={newTeacher.specialite}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pourcentage de Profit:</label>
                <input
                  type="number"
                  name="pourcentageProfit"
                  value={newTeacher.pourcentageProfit}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sessions par Semaine:</label>
                <input
                  type="number"
                  name="sessionsParSemaine"
                  value={newTeacher.sessionsParSemaine}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Statut:</label>
                <select
                  name="statut"
                  value={newTeacher.statut}
                  onChange={handleInputChange}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">Ajouter l'Enseignant</button>
            </form>
          </div>
        )}
        {editingTeacher ? (
          <div className="edit-user-form">
            <h3>Edit Teacher</h3>
            <form onSubmit={handleEditTeacher}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  name="nom"
                  value={editingTeacher.nom}
                  onChange={(e) => setEditingTeacher({...editingTeacher, nom: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prénom:</label>
                <input
                  type="text"
                  name="prenom"
                  value={editingTeacher.prenom}
                  onChange={(e) => setEditingTeacher({...editingTeacher, prenom: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Téléphone:</label>
                <input
                  type="tel"
                  name="telephone"
                  value={editingTeacher.telephone || ''}
                  onChange={(e) => setEditingTeacher({...editingTeacher, telephone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Adresse:</label>
                <input
                  type="text"
                  name="adresse"
                  value={editingTeacher.adresse || ''}
                  onChange={(e) => setEditingTeacher({...editingTeacher, adresse: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Spécialité:</label>
                <input
                  type="text"
                  name="specialite"
                  value={editingTeacher.specialite || ''}
                  onChange={(e) => setEditingTeacher({...editingTeacher, specialite: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pourcentage de Profit:</label>
                <input
                  type="number"
                  name="pourcentageProfit"
                  value={editingTeacher.pourcentageProfit || 0}
                  onChange={(e) => setEditingTeacher({...editingTeacher, pourcentageProfit: Number(e.target.value)})}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sessions par Semaine:</label>
                <input
                  type="number"
                  name="sessionsParSemaine"
                  value={editingTeacher.sessionsParSemaine || 0}
                  onChange={(e) => setEditingTeacher({...editingTeacher, sessionsParSemaine: Number(e.target.value)})}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Statut:</label>
                <select
                  name="statut"
                  value={editingTeacher.statut || 'actif'}
                  onChange={(e) => setEditingTeacher({...editingTeacher, statut: e.target.value})}
                  required
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mot de passe:</label>
                <input
                  type="password"
                  name="password"
                  value={editingTeacher.password}
                  onChange={(e) => setEditingTeacher({...editingTeacher, password: e.target.value})}
                  placeholder="Laisser vide pour garder le mot de passe actuel"
                />
              </div>

              <div className="form-group">
                <label>Sessions Par Semaine:</label>
                <input
                  type="number"
                  name="sessionsParSemaine"
                  value={editingTeacher.sessionsParSemaine || 0}
                  onChange={(e) => setEditingTeacher({...editingTeacher, sessionsParSemaine: Number(e.target.value)})}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Heures Disponibles:</label>
                {editingTeacher.heuresDisponibles?.map((horaire, index) => (
                  <div key={index} className="horaire-group">
                    <select
                      value={horaire.jour}
                      onChange={(e) => {
                        const newHeuresDisponibles = [...editingTeacher.heuresDisponibles];
                        newHeuresDisponibles[index] = { ...horaire, jour: e.target.value };
                        setEditingTeacher({...editingTeacher, heuresDisponibles: newHeuresDisponibles});
                      }}
                    >
                      <option value="lundi">Lundi</option>
                      <option value="mardi">Mardi</option>
                      <option value="mercredi">Mercredi</option>
                      <option value="jeudi">Jeudi</option>
                      <option value="vendredi">Vendredi</option>
                      <option value="samedi">Samedi</option>
                      <option value="dimanche">Dimanche</option>
                    </select>
                    <input
                      type="time"
                      value={horaire.debut}
                      onChange={(e) => {
                        const newHeuresDisponibles = [...editingTeacher.heuresDisponibles];
                        newHeuresDisponibles[index] = { ...horaire, debut: e.target.value };
                        setEditingTeacher({...editingTeacher, heuresDisponibles: newHeuresDisponibles});
                      }}
                    />
                    <input
                      type="time"
                      value={horaire.fin}
                      onChange={(e) => {
                        const newHeuresDisponibles = [...editingTeacher.heuresDisponibles];
                        newHeuresDisponibles[index] = { ...horaire, fin: e.target.value };
                        setEditingTeacher({...editingTeacher, heuresDisponibles: newHeuresDisponibles});
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newHeuresDisponibles = editingTeacher.heuresDisponibles.filter((_, i) => i !== index);
                        setEditingTeacher({...editingTeacher, heuresDisponibles: newHeuresDisponibles});
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newHeuresDisponibles = [...(editingTeacher.heuresDisponibles || []), { jour: 'lundi', debut: '', fin: '' }];
                    setEditingTeacher({...editingTeacher, heuresDisponibles: newHeuresDisponibles});
                  }}
                >
                  Ajouter un horaire
                </button>
              </div>

              <div className="form-group">
                <label>Statut:</label>
                <select
                  name="statut"
                  value={editingTeacher.statut || 'actif'}
                  onChange={(e) => setEditingTeacher({...editingTeacher, statut: e.target.value})}
                  required
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              
              <div className="button-group">
                <button type="submit" className="submit-btn">Update Teacher</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditingTeacher(null);
                    navigate('/dashboard/teachers');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
  
           
         </>
        )}
        <div className="users-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
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
                      onClick={() => {
                        setEditingTeacher({ ...teacher, password: '' });
                        navigate(`/user/${teacher._id}/edit`);
                      }}
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