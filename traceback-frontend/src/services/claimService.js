import api from '../utils/api'
const claimService = {
  submit:       async (body) => (await api.post('/claims', body)).data.data,
  getMine:      async (page=0,size=20) => (await api.get('/claims/mine',{params:{page,size}})).data.data,
  forItem:      async (itemId) => (await api.get(`/claims/item/${itemId}`)).data.data,
  getById:      async (id) => (await api.get(`/claims/${id}`)).data.data,
  review:       async (id, approve, notes='') => (await api.patch(`/claims/${id}/review`,null,{params:{approve,notes}})).data.data,
  withdraw:     async (id) => (await api.patch(`/claims/${id}/withdraw`)).data.data,
  adminGetAll:  async ({ status, page=0, size=50 }={}) => {
    const p = new URLSearchParams({ page, size })
    if (status) p.append('status', status)
    return (await api.get(`/admin/claims?${p}`)).data.data
  },
}
export default claimService
