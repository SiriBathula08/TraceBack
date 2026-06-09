import api from '../utils/api'
const itemService = {
  getItems: async ({ type, category, page=0, size=12, sort='createdAt' }={}) => {
    const p = new URLSearchParams({ page, size, sort })
    if (type && type !== 'ALL') p.append('type', type)
    if (category) p.append('category', category)
    return (await api.get(`/items?${p}`)).data.data
  },
  search:     async (q, page=0, size=12) => (await api.get('/items/search', { params:{q,page,size} })).data.data,
  getById:    async (id) => (await api.get(`/items/${id}`)).data.data,
  getMine:    async (page=0, size=20) => (await api.get('/items/mine', { params:{page,size} })).data.data,
  getMatches: async (id, limit=8) => (await api.get(`/items/${id}/matches`, { params:{limit} })).data.data,
  getStats:   async () => (await api.get('/items/stats')).data.data,
  create:     async (body) => (await api.post('/items', body)).data.data,
  update:     async (id, body) => (await api.put(`/items/${id}`, body)).data.data,
  setStatus:  async (id, status) => (await api.patch(`/items/${id}/status`, null, { params:{status} })).data.data,
  remove:     async (id) => api.delete(`/items/${id}`),
  adminItems: async ({ type, page=0, size=50 }={}) => {
    const p = new URLSearchParams({ page, size })
    if (type) p.append('type', type)
    return (await api.get(`/admin/items?${p}`)).data.data
  },
  adminStatus: async (id, status) => (await api.patch(`/admin/items/${id}/status`, null, { params:{status} })).data.data,
}
export default itemService
