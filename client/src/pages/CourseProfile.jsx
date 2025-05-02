import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/CourseProfile.css';

export default function CourseProfile() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      const courseData = response.data.data;
      setCourse(courseData);
      setStudents(courseData.etudiantsInscrits || []);
      setLoading(false);
    } catch (error) {
      toast.error('Échec du chargement des détails du cours');
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/users', {
        params: { role: 'enseignant' }
      });
      setTeachers(response.data.data);
    } catch (error) {
      toast.error('Échec du chargement des enseignants');
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      const available = response.data.data.filter(
        student => !students.some(enrolled => enrolled._id === student._id)
      );
      setAvailableStudents(available);
      setSearchTerm('');
      setSortBy('nom');
      setSortOrder('asc');
    } catch (error) {
      toast.error('Échec du chargement des étudiants disponibles');
    }
  };

  const filteredAndSortedStudents = availableStudents
    .filter(student => 
      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nom') {
        const nameA = `${a.nom} ${a.prenom}`.toLowerCase();
        const nameB = `${b.nom} ${b.prenom}`.toLowerCase();
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (sortBy === 'date') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  const handleAssignTeacher = async () => {
    if (!selectedTeacher) {
      toast.error('Veuillez sélectionner un enseignant');
      return;
    }

    try {
      await axios.put(`/api/courses/${id}`, {
        enseignant: selectedTeacher
      });
      await fetchCourseDetails();
      setShowTeacherModal(false);
      toast.success('Enseignant assigné avec succès');
    } catch (error) {
      toast.error("Échec de l'assignation de l'enseignant");
    }
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Veuillez sélectionner au moins un étudiant');
      return;
    }

    try {
      for (const studentId of selectedStudents) {
        await axios.post(`/api/courses/${id}/students`, {
          studentId
        });
      }
      await fetchCourseDetails();
      setShowStudentsModal(false);
      setSelectedStudents([]);
      toast.success('Étudiants ajoutés avec succès');
    } catch (error) {
      toast.error("Échec de l'ajout des étudiants");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer cet étudiant du cours ?')) {
      try {
        await axios.delete(`/api/courses/${id}/students/${studentId}`);
        await fetchCourseDetails();
        toast.success('Étudiant retiré avec succès');
      } catch (error) {
        toast.error("Échec du retrait de l'étudiant");
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!course) {
    return <div className="error">Cours non trouvé</div>;
  }

  return (
    <div className="course-profile">
      <div className="course-header">
        <h2>{course.nom}</h2>
        
      </div>

      <div className="course-content">
        <div className="course-details">
          <p><strong>Description:</strong> {course.description}</p>
          <p><strong>Prix:</strong> {course.prix}€</p>
          <p><strong>Durée:</strong> {course.dureeHeures} heures</p>
          <p><strong>Période:</strong> Du {new Date(course.dateDebut).toLocaleDateString()} au {new Date(course.dateFin).toLocaleDateString()}</p>
          <p><strong>Salle:</strong> {course.salle}</p>
          <div>
            <strong>Horaires:</strong>
            <ul>
              {course.horaire.map((horaire, index) => (
                <li key={index}>{horaire.jour}: {horaire.heureDebut} - {horaire.heureFin}</li>
              ))}
            </ul>
          </div>
          {course.enseignant && (
            <div className="teacher-info">
              <h3>Enseignant</h3>
              <p><strong>Nom:</strong> {course.enseignant.nom} {course.enseignant.prenom}</p>
              <p><strong>Email:</strong> {course.enseignant.email}</p>
              <p><strong>Spécialité:</strong> {course.enseignant.specialite}</p>
              <p><strong>Téléphone:</strong> {course.enseignant.telephone}</p>
            </div>
          )}
        </div>

        <div className="students-section">
          <div className="students-header">
            <h3>Étudiants Inscrits</h3>
            <button onClick={() => { fetchAvailableStudents(); setShowStudentsModal(true); }}>
              Ajouter des Étudiants
            </button>
          </div>
          <table className="students-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.nom} {student.prenom}</td>
                  <td>{student.email}</td>
                  <td>{student.telephone || 'Non spécifié'}</td>
                  <td>
                    <button onClick={() => handleRemoveStudent(student._id)}>Retirer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showTeacherModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assigner un Enseignant</h3>
            <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
              <option value="">Sélectionner un enseignant</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.nom} {teacher.prenom} - {teacher.specialite}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleAssignTeacher}>Assigner</button>
              <button onClick={() => setShowTeacherModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showStudentsModal && (
        <div className="modal-overlay">
          <div className="modal students-modal">
            <h3>Ajouter des Étudiants</h3>
            <div className="search-sort-container">
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="sort-controls">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="nom">Trier par nom</option>
                  <option value="date">Trier par date de création</option>
                </select>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="sort-order-btn"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
            <div className="students-selection">
              {filteredAndSortedStudents.map(student => (
                <label key={student._id} className="student-item">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student._id]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                      }
                    }}
                  />
                  <div className="student-info">
                    <span className="student-name">{student.nom} {student.prenom}</span>
                    <span className="student-email">{student.email}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={handleAddStudents} className="add-btn">Ajouter</button>
              <button onClick={() => { setShowStudentsModal(false); setSelectedStudents([]); }} className="cancel-btn">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
