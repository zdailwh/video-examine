import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/v1/users',
    method: 'get',
    params: query
  })
}

export function actived(query) {
  return request({
    url: '/admin/v1/users/' + query.id + '/actived',
    method: 'put'
  })
}

export function inactived(query) {
  return request({
    url: '/admin/v1/users/' + query.id + '/inactived',
    method: 'put'
  })
}

export function createUser(data) {
  return request({
    url: '/admin/v1/users',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/v1/users/' + data.id,
    method: 'put',
    data: {
      username: data.username,
      mobile: data.mobile
    }
  })
}

export function deleteUser(query) {
  return request({
    url: '/admin/v1/users/' + query.id,
    method: 'delete'
  })
}
