import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

export default function EditStudent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setEditingStudent({
        ...response.data.data,
        password: ''
      });
    } catch (error) {
      toast.error('Échec du chargement des informations de l\'étudiant');
      navigate('/dashboard/students');
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${id}`, editingStudent);
      toast.success('Étudiant mis à jour avec succès');
      navigate('/dashboard/students');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la mise à jour de l\'étudiant');
    }
  };

  if (user?.role !== 'admin') {
    return <div>Accès refusé</div>;
  }

  if (!editingStudent) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Modifier l'Étudiant</h2>
      
      <div className="dashboard-content">
        <div className="edit-user-form">
          <form onSubmit={handleEditStudent}>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={editingStudent.nom}
                onChange={(e) => setEditingStudent({...editingStudent, nom: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Prénom:</label>
              <input
                type="text"
                name="prenom"
                value={editingStudent.prenom}
                onChange={(e) => setEditingStudent({...editingStudent, prenom: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Téléphone:</label>
              <input
                type="tel"
                name="telephone"
                value={editingStudent.telephone}
                onChange={(e) => setEditingStudent({...editingStudent, telephone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Adresse:</label>
              <textarea
                name="adresse"
                value={editingStudent.adresse}
                onChange={(e) => setEditingStudent({...editingStudent, adresse: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Date de Naissance:</label>
              <input
                type="date"
                name="dateNaissance"
                value={editingStudent.dateNaissance ? editingStudent.dateNaissance.split('T')[0] : ''}
                onChange={(e) => setEditingStudent({...editingStudent, dateNaissance: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Promotion Applicable (%):</label>
              <input
                type="number"
                name="promotionApplicable"
                value={editingStudent.promotionApplicable || 0}
                onChange={(e) => setEditingStudent({...editingStudent, promotionApplicable: Number(e.target.value)})}
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
                onChange={(e) => setEditingStudent({...editingStudent, montantTotal: Number(e.target.value)})}
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
                onChange={(e) => setEditingStudent({...editingStudent, statut: e.target.value})}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard/students')}>Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}