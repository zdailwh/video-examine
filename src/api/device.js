import request from '@/utils/request'

export function deviceRead(data) {
  return request({
    url: '/admin/review/v1/devices/config',
    method: 'get'
  })
}

export function deviceUpdate(data) {
  return request({
    url: '/admin/review/v1/devices/config',
    method: 'put',
    data: {
      thread: data.thread,
      black_d: data.black_d,
      black_th: data.black_th,
      freeze_d: data.freeze_d,
      sonic_hi: data.sonic_hi,
      sonic_low: data.sonic_low
    }
  })
}

export function deviceSpace(data) {
  return request({
    url: '/admin/review/v1/devices/space',
    method: 'get'
  })
}
