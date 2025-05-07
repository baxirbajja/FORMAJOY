import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

export default function Students() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'etudiant',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    promotionApplicable: 0,
    montantTotal: 0,
    statut: 'actif'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Added state for sort order

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (id) {
      const studentToEdit = students.find(s => s._id === id);
      if (studentToEdit) {
        setEditingStudent({ ...studentToEdit, password: '' });
      }
    }
  }, [id, students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/users');
      const filtered = response.data.data.filter(u => u.role === 'etudiant');
      setStudents(filtered);
    } catch {
      toast.error("Échec du chargement des étudiants");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newStudent);
      toast.success("Étudiant créé avec succès");
      setNewStudent({
        nom: '',
        prenom: '',
        email: '',
        role: 'etudiant',
        telephone: '',
        adresse: '',
        dateNaissance: '',
        promotionApplicable: 0,
        montantTotal: 0,
        statut: 'actif'
      });
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...editingStudent };
      if (!updateData.password) delete updateData.password;
      await axios.put(`/api/users/${editingStudent._id}`, updateData);
      toast.success("Étudiant mis à jour avec succès");
      setEditingStudent(null);
      navigate('/dashboard/students');
      fetchStudents();
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  const handleEdit = (studentId) => navigate(`/dashboard/students/${studentId}/edit`);

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await axios.delete(`/api/users/${studentId}`);
        toast.success("Étudiant supprimé");
        fetchStudents();
      } catch {
        toast.error("Erreur de suppression");
      }
    }
  };

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    } else {
      setSortBy(column);
      setSortOrder('asc'); // Default to ascending when switching columns
    }
  };

  const sortedStudents = students
    .filter(student => `${student.nom} ${student.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy) {
        const aValue = sortBy === 'name' ? `${a.nom} ${a.prenom}` : a[sortBy];
        const bValue = sortBy === 'name' ? `${b.nom} ${b.prenom}` : b[sortBy];

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
      return 0;
    });

  if (user?.role !== 'admin') return <div>Accès refusé</div>;

  return (
    <div className="dashboard-container">
      <h2>Gestion des Étudiants</h2>

      <div className="dashboard-content">
        {!editingStudent && !showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-student-btn"
          >
            Ajouter un Nouvel Étudiant
          </button>
        )}

        {showAddForm && (
          <div className="add-student-form">
            <div className="form-header">
              <h3>Ajouter un Étudiant</h3>
              <button onClick={() => setShowAddForm(false)} className="cancel-btn">Fermer</button>
            </div>
            <form onSubmit={handleSubmit}>
              {["nom", "prenom", "email", "telephone", "adresse", "dateNaissance"].map(field => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  {field === "adresse" ? (
                    <textarea name={field} value={newStudent[field]} onChange={handleInputChange} />
                  ) : (
                    <input
                      type={field === "email" ? "email" : field === "dateNaissance" ? "date" : "text"}
                      name={field}
                      value={newStudent[field]}
                      onChange={handleInputChange}
                      required={["nom", "prenom", "email"].includes(field)}
                    />
                  )}
                </div>
              ))}
              <div className="form-group">
                <label>Promotion Applicable (%):</label>
                <input
                  type="number"
                  name="promotionApplicable"
                  value={newStudent.promotionApplicable}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label>Montant Total (DH):</label>
                <input
                  type="number"
                  name="montantTotal"
                  value={newStudent.montantTotal}
                  onChange={handleInputChange}
                  min="0"
                  disabled
                />
                <small>Ce montant est calculé automatiquement à partir des cours inscrits</small>
              </div>
              
              <div className="form-group">
                <label>Statut:</label>
                <select name="statut" value={newStudent.statut} onChange={handleInputChange}>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Ajouter l'Étudiant</button>
            </form>
          </div>
        )}

        {editingStudent && (
          <div className="edit-user-form">
            <h3>Modifier l'Étudiant</h3>
            <form onSubmit={handleEditStudent}>
              {["nom", "prenom", "email", "telephone", "adresse", "dateNaissance"].map(field => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  {field === "adresse" ? (
                    <textarea
                      name={field}
                      value={editingStudent[field]}
                      onChange={e => setEditingStudent({ ...editingStudent, [field]: e.target.value })}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : field === "dateNaissance" ? "date" : "text"}
                      name={field}
                      value={field === "dateNaissance" ? editingStudent[field]?.split('T')[0] : editingStudent[field]}
                      onChange={e => setEditingStudent({ ...editingStudent, [field]: e.target.value })}
                      required={["nom", "prenom", "email"].includes(field)}
                    />
                  )}
                </div>
              ))}
              <div className="form-group">
                <label>Promotion Applicable (%):</label>
                <input
                  type="number"
                  name="promotionApplicable"
                  value={editingStudent.promotionApplicable || 0}
                  onChange={e => setEditingStudent({ ...editingStudent, promotionApplicable: Number(e.target.value) })}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label>Montant Total (DH):</label>
                <input
                  type="number"
                  name="montantTotal"
                  value={editingStudent.montantTotal || 0}
                  onChange={e => setEditingStudent({ ...editingStudent, montantTotal: Number(e.target.value) })}
                  min="0"
                  disabled
                />
                <small>Ce montant est calculé automatiquement à partir des cours inscrits</small>
              </div>
              
              <div className="form-group">
                <label>Statut:</label>
                <select
                  name="statut"
                  value={editingStudent.statut}
                  onChange={e => setEditingStudent({ ...editingStudent, statut: e.target.value })}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              <div className="button-group">
                <button type="submit" className="submit-btn">Mettre à jour</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingStudent(null);
                    navigate('/dashboard/students');
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {!editingStudent && (
          <div className="students-list">
            <h3>Liste des Étudiants</h3>
            <div className="filter-controls">
              <input
              style={{width:"80%"}}
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{cursor:"pointer"}}  onClick={() => toggleSort('name')}>
                      Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↓' : '↑')}
                    </th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th style={{cursor:"pointer"}} onClick={() => toggleSort('montantTotal')}>
                      Montant Total {sortBy === 'montantTotal' && (sortOrder === 'asc' ? '↓' : '↑')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map(student => (
                    <tr key={student._id}>
                      <td>{student.nom}</td>
                      <td>{student.email}</td>
                      <td>{student.telephone || 'Non spécifié'}</td>
                      <td>{student.montantTotal ? parseFloat(student.montantTotal).toFixed(2) + ' DH' : '0.00 DH'}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => navigate(`/student-profile/${student._id}`)} className="view-profile-btn"> Voir le profile</button>
                          <button onClick={() => handleEdit(student._id)} className="edit-btn">Modifier</button>
                          <button onClick={() => handleDeleteStudent(student._id)} className="delete-btn">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
