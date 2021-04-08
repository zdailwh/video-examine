import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.disksn !== '') {
    params.disksn = query.disksn
  }
  if (query.createdate !== '') {
    params.createdate = query.createdate
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.status !== '') {
    params.status = query.status
  }
  if (query.filestatus !== '') {
    params.filestatus = query.filestatus
  }
  return request({
    url: '/admin/review/v1/filereviews',
    method: 'get',
    params
  })
}

export function createTask(data) {
  return request({
    url: '/admin/review/v1/filereviews',
    method: 'post',
    data: data
  })
}

export function mergeTask(query) {
  return request({
    url: `/admin/review/v1/filereviews/${query.id}/merge`,
    method: 'put'
  })
}

export function updateFilereview(data) {
  return request({
    url: '/admin/review/v1/filereviews/' + data.id,
    method: 'put',
    data: {
      prority: parseInt(data.prority)
    }
  })
}

export function getDetail(query) {
  return request({
    url: '/admin/review/v1/filereviews/' + query.id,
    method: 'get',
    params: {
      page: query.page - 1,
      per_page: query.limit
    }
  })
}

export function deleteTask(query) {
  return request({
    url: '/admin/review/v1/filereviews/' + query.id + '/delete',
    method: 'get'
  })
}
