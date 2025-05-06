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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortCourses = (coursesList) => {
    return [...coursesList].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'createdAt') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        comparison = dateA - dateB;
      } else if (sortField === 'dateDebut' || sortField === 'dateFin') {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        comparison = dateA - dateB;
      } else if (sortField === 'etudiantsInscrits') {
        const lengthA = a.etudiantsInscrits?.length || 0;
        const lengthB = b.etudiantsInscrits?.length || 0;
        comparison = lengthA - lengthB;
      } else {
        comparison = a[sortField].localeCompare(b[sortField]);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      const coursesData = response.data.data;
      
      const sortedCoursesData = sortCourses(coursesData);
      const coursesWithTeachers = await Promise.all(
        sortedCoursesData.map(async (course) => {
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

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sortedCourses = sortCourses(courses);
    setCourses(sortedCourses);
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
        <button 
          onClick={() => navigate('/dashboard/courses/new')}
          className="add-course-btn"
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
          Ajouter un Nouveau Cours
        </button>
        <div className="search-sort-container">
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('nom')}>Nom {sortField === 'nom' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('etudiantsInscrits')}>Nombre d'étudiants {sortField === 'etudiantsInscrits' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('dureeHeures')}>Durée {sortField === 'dureeHeures' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('dateDebut')}>Date de début {sortField === 'dateDebut' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('dateFin')}>Date de fin {sortField === 'dateFin' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('salle')}>Salle {sortField === 'salle' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter(course => 
                course.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(course => (
                <tr key={course._id}>
                  <td>{course.nom}</td>
                  <td>{course.etudiantsInscrits?.length || 0}</td>
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
