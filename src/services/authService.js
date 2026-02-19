// Mock auth service with sessionStorage

// Remove old user data from localStorage if present
try {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
} catch (e) {
  // Ignore errors (e.g., if localStorage is unavailable)
}
const USERS_KEY = 'devhire_users'
const CURRENT_USER_KEY = 'devhire_current_user'

// Initialize with some demo users
const initializeDemoUsers = () => {
  const existing = sessionStorage.getItem(USERS_KEY)
  if (!existing) {
    const demoUsers = [
      {
        id: '1',
        email: 'recruiter@devhire.com',
        password: 'password123',
        role: 'recruiter',
        companyName: 'TechCorp',
        verified: true,
      },
      {
        id: '2',
        email: 'candidate@devhire.com',
        password: 'password123',
        role: 'candidate',
        name: 'John Doe',
        verified: true,
      },
    ]
    sessionStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
  }
}

export const authService = {
  register: (userData) => {
    initializeDemoUsers()
    const users = JSON.parse(sessionStorage.getItem(USERS_KEY) || '[]')
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User already exists')
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    if (newUser.role === 'recruiter') {
      newUser.companyName = userData.companyName
      newUser.website = userData.website || ''
      newUser.logo = userData.logo || null
    } else {
      newUser.name = userData.name
      newUser.resume = userData.resume || null
      newUser.skills = userData.skills || []
    }

    users.push(newUser)
    sessionStorage.setItem(USERS_KEY, JSON.stringify(users))

    return newUser
  },

  login: (email, password) => {
    initializeDemoUsers()
    const users = JSON.parse(sessionStorage.getItem(USERS_KEY) || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  logout: () => {
    sessionStorage.removeItem(CURRENT_USER_KEY)
  },

  getCurrentUser: () => {
    const user = sessionStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return sessionStorage.getItem(CURRENT_USER_KEY) !== null
  },

  updateUser: (userId, updates) => {
    const users = JSON.parse(sessionStorage.getItem(USERS_KEY) || '[]')
    const index = users.findIndex(u => u.id === userId)
    
    if (index === -1) throw new Error('User not found')

    users[index] = { ...users[index], ...updates }
    sessionStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Update current user if it's the logged-in user
    const currentUser = authService.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]))
    }

    return users[index]
  },
}
