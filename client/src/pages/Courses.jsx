import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/Courses.css';

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    nom: '',
    description: '',
    prix: '',
    dureeHeures: '',
    dateDebut: '',
    dateFin: '',
    salle: '',
    enseignant: '',
    horaire: [{
      jour: 'lundi',
      heureDebut: '',
      heureFin: ''
    }]
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      const coursesData = response.data.data;
      
      const coursesWithTeachers = await Promise.all(
        coursesData.map(async (course) => {
          if (!course.enseignant || typeof course.enseignant !== 'string') {
            return { ...course, enseignantDetails: null };
          }
          
          try {
            const teacherResponse = await axios.get(`/api/users/${course.enseignant}`);
            return {
              ...course,
              enseignantDetails: teacherResponse.data.data
            };
          } catch (error) {
            console.error(`Erreur lors du chargement des détails de l'enseignant (ID: ${course.enseignant}):`, error);
            return {
              ...course,
              enseignantDetails: { nom: 'Non disponible', prenom: '' }
            };
          }
        })
      );
      
      setCourses(coursesWithTeachers);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      toast.error('Échec du chargement des cours. Veuillez réessayer plus tard.');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/users');
      const filteredTeachers = response.data.data.filter(user => user.role === 'enseignant');
      setTeachers(filteredTeachers);
    } catch (error) {
      toast.error('Échec du chargement des enseignants');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHoraireChange = (index, field, value) => {
    setNewCourse(prev => {
      const newHoraire = [...prev.horaire];
      newHoraire[index] = { ...newHoraire[index], [field]: value };
      return { ...prev, horaire: newHoraire };
    });
  };

  const addHoraire = () => {
    setNewCourse(prev => ({
      ...prev,
      horaire: [...prev.horaire, { jour: 'lundi', heureDebut: '', heureFin: '' }]
    }));
  };

  const removeHoraire = (index) => {
    setNewCourse(prev => ({
      ...prev,
      horaire: prev.horaire.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', newCourse);
      toast.success('Cours créé avec succès');
      setNewCourse({
        nom: '',
        description: '',
        prix: '',
        dureeHeures: '',
        dateDebut: '',
        dateFin: '',
        salle: '',
        enseignant: '',
        horaire: [{ jour: 'lundi', heureDebut: '', heureFin: '' }]
      });
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la création du cours');
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/courses/${editingCourse._id}`, editingCourse);
      toast.success('Cours mis à jour avec succès');
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      toast.error('Échec de la mise à jour du cours');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        toast.success('Cours supprimé avec succès');
        fetchCourses();
      } catch (error) {
        toast.error('Échec de la suppression du cours');
      }
    }
  };

  if (user?.role !== 'admin') {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="courses-container">
      <h2>Gestion des Cours</h2>
      <div className="courses-content">
        {!showAddForm && !editingCourse ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-course-btn"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px',
              width:'fit-content'
            }}
          >
            Ajouter un Nouveau Cours
          </button>
        ) : editingCourse ? (
          <div className="edit-course-form">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3>Modifier le Cours</h3>
              <button 
                onClick={() => setEditingCourse(null)}
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
            <form onSubmit={handleEditCourse}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  name="nom"
                  value={editingCourse.nom}
                  onChange={(e) => setEditingCourse({...editingCourse, nom: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prix:</label>
                <input
                  type="number"
                  name="prix"
                  value={editingCourse.prix}
                  onChange={(e) => setEditingCourse({...editingCourse, prix: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Durée (heures):</label>
                <input
                  type="number"
                  name="dureeHeures"
                  value={editingCourse.dureeHeures}
                  onChange={(e) => setEditingCourse({...editingCourse, dureeHeures: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date de début:</label>
                <input
                  type="date"
                  name="dateDebut"
                  value={editingCourse.dateDebut?.split('T')[0]}
                  onChange={(e) => setEditingCourse({...editingCourse, dateDebut: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date de fin:</label>
                <input
                  type="date"
                  name="dateFin"
                  value={editingCourse.dateFin?.split('T')[0]}
                  onChange={(e) => setEditingCourse({...editingCourse, dateFin: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salle:</label>
                <input
                  type="text"
                  name="salle"
                  value={editingCourse.salle}
                  onChange={(e) => setEditingCourse({...editingCourse, salle: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Enseignant:</label>
                <select
                  name="enseignant"
                  value={editingCourse.enseignant}
                  onChange={(e) => setEditingCourse({...editingCourse, enseignant: e.target.value})}
                  required
                >
                  <option value="">Sélectionner un enseignant</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.nom} {teacher.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="horaires-section">
                <h4>Horaires</h4>
                {editingCourse.horaire.map((horaire, index) => (
                  <div key={index} className="horaire-group">
                    <select
                      value={horaire.jour}
                      onChange={(e) => {
                        const newHoraire = [...editingCourse.horaire];
                        newHoraire[index] = { ...newHoraire[index], jour: e.target.value };
                        setEditingCourse({...editingCourse, horaire: newHoraire});
                      }}
                    >
                      {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map(jour => (
                        <option key={jour} value={jour}>{jour.charAt(0).toUpperCase() + jour.slice(1)}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={horaire.heureDebut}
                      onChange={(e) => {
                        const newHoraire = [...editingCourse.horaire];
                        newHoraire[index] = { ...newHoraire[index], heureDebut: e.target.value };
                        setEditingCourse({...editingCourse, horaire: newHoraire});
                      }}
                    />
                    <input
                      type="time"
                      value={horaire.heureFin}
                      onChange={(e) => {
                        const newHoraire = [...editingCourse.horaire];
                        newHoraire[index] = { ...newHoraire[index], heureFin: e.target.value };
                        setEditingCourse({...editingCourse, horaire: newHoraire});
                      }}
                    />
                    {editingCourse.horaire.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newHoraire = editingCourse.horaire.filter((_, i) => i !== index);
                          setEditingCourse({...editingCourse, horaire: newHoraire});
                        }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newHoraire = [...editingCourse.horaire, { jour: 'lundi', heureDebut: '', heureFin: '' }];
                    setEditingCourse({...editingCourse, horaire: newHoraire});
                  }}
                >
                  Ajouter un horaire
                </button>
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn">Mettre à jour</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingCourse(null)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="add-course-form">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3>Ajouter un Nouveau Cours</h3>
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
                value={newCourse.nom}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={newCourse.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Prix:</label>
              <input
                type="number"
                name="prix"
                value={newCourse.prix}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Durée (heures):</label>
              <input
                type="number"
                name="dureeHeures"
                value={newCourse.dureeHeures}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Date de début:</label>
              <input
                type="date"
                name="dateDebut"
                value={newCourse.dateDebut}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date de fin:</label>
              <input
                type="date"
                name="dateFin"
                value={newCourse.dateFin}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Salle:</label>
              <input
                type="text"
                name="salle"
                value={newCourse.salle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Enseignant:</label>
              <select
                name="enseignant"
                value={newCourse.enseignant}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un enseignant</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.nom} {teacher.prenom}
                  </option>
                ))}
              </select>
            </div>

            <div className="horaire-section">
              <h4>Horaires</h4>
              {newCourse.horaire.map((horaire, index) => (
                <div key={index} className="horaire-group">
                  <select
                    value={horaire.jour}
                    onChange={(e) => handleHoraireChange(index, 'jour', e.target.value)}
                  >
                    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map(jour => (
                      <option key={jour} value={jour}>{jour}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={horaire.heureDebut}
                    onChange={(e) => handleHoraireChange(index, 'heureDebut', e.target.value)}
                    required
                  />
                  <input
                    type="time"
                    value={horaire.heureFin}
                    onChange={(e) => handleHoraireChange(index, 'heureFin', e.target.value)}
                    required
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => removeHoraire(index)}>Supprimer</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addHoraire}>Ajouter un horaire</button>
            </div>

            <button type="submit" className="submit-btn">Ajouter le Cours</button>
          </form>
        </div>
        )
        }
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Nombre d'étudiants</th>
                <th>Prix</th>
                <th>Durée</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Salle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>{course.nom}</td>
                  <td>{course.etudiantsInscrits?.length || 0}</td>
                  <td>{course.prix} MAD</td>
                  <td>{course.dureeHeures}h</td>
                  <td>{new Date(course.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(course.dateFin).toLocaleDateString()}</td>
                  <td>{course.salle}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => navigate(`/dashboard/courses/${course._id}`)}
                      className="view-btn"
                    >
                      Voir détails
                    </button>
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="edit-btn"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
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
  );
}