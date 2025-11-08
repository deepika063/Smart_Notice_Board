export const mockNotices = [
  {
    id: 1,
    title: 'Midterm Examination Schedule Released',
    content: 'The schedule for midterm examinations has been published...',
    priority: 'high',
    author: { name: 'Dr. Smith', role: 'HOD Computer Science' },
    publishDate: new Date().toISOString(),
    target: ['Computer Science', 'All Students'],
    status: 'published',
    comments: []
  }
];

export const mockUsers = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'Administration'
  },
  faculty: {
    id: '2', 
    name: 'Professor John',
    email: 'faculty@college.edu',
    role: 'faculty',
    department: 'Computer Science'
  },
  student: {
    id: '3',
    name: 'Student Alice',
    email: 'student@college.edu', 
    role: 'student',
    department: 'Computer Science',
    batch: '2024'
  }
};