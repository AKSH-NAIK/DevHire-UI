// Mock auth service with localStorage
const USERS_KEY = 'devhire_users'
const CURRENT_USER_KEY = 'devhire_current_user'

// Initialize with some demo users
const initializeDemoUsers = () => {
  const existing = localStorage.getItem(USERS_KEY)
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
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
  }
}

export const authService = {
  register: (userData) => {
    initializeDemoUsers()
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    
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
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    return newUser
  },

  login: (email, password) => {
    initializeDemoUsers()
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return localStorage.getItem(CURRENT_USER_KEY) !== null
  },

  updateUser: (userId, updates) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const index = users.findIndex(u => u.id === userId)
    
    if (index === -1) throw new Error('User not found')

    users[index] = { ...users[index], ...updates }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Update current user if it's the logged-in user
    const currentUser = authService.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]))
    }

    return users[index]
  },
}
