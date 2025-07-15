// API Service for FastAPI backend calls
class ApiService {
  constructor(baseURL = 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Coach-specific API calls (CUJs 6-9)
  async provisionCoach(coachData) {
    return this.request('/provision', {
      method: 'POST',
      body: JSON.stringify(coachData),
    });
  }

  async getCoachOnboardingProgress(coachId) {
    return this.request(`/coach/${coachId}/onboarding`);
  }

  async updateCoachSkills(coachId, skillsData) {
    return this.request(`/coach/${coachId}/skills`, {
      method: 'PUT',
      body: JSON.stringify(skillsData),
    });
  }

  async getAnalytics(coachId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/analytics/${coachId}?${queryParams}`);
  }

  async searchKnowledgeBase(query, filters = {}) {
    return this.request('/kb/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  // Student-specific API calls
  async getStudentGamePlan(studentId) {
    return this.request(`/student/${studentId}/gameplan`);
  }

  async updateStudentProgress(studentId, progressData) {
    return this.request(`/student/${studentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  // Parent-specific API calls
  async getParentDashboard(parentId) {
    return this.request(`/parent/${parentId}/dashboard`);
  }

  async getEscalationSummaries(parentId) {
    return this.request(`/parent/${parentId}/escalations`);
  }

  // Manager-specific API calls
  async getManagerOversight(managerId) {
    return this.request(`/manager/${managerId}/oversight`);
  }

  async createIntervention(managerId, interventionData) {
    return this.request(`/manager/${managerId}/interventions`, {
      method: 'POST',
      body: JSON.stringify(interventionData),
    });
  }

  // Generic CRUD operations
  async get(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default ApiService; 