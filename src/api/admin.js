import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/admin/list',
    method: 'get',
    params: query
  })
}
