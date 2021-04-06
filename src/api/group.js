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
  return request({
    url: '/admin/review/v1/filegroups',
    method: 'get',
    params
  })
}
