const Mock = require('mockjs')

const count = 100

const device = Mock.mock({
  thread: '@integer(1, 8)',
  black_d: '@integer(1, 99)',
  black_th: '@integer(0.9, 0.999)',
  freeze_d: '@integer(1, 99)',
  sonic_hi: '@integer(0, 5)',
  sonic_low: '@integer(-10, -1)'
})

const space = Mock.mock({
  writeable: 1,
  total: '@integer(100, 1000)',
  avail: '@integer(0, 100)'
})

module.exports = [
  {
    url: '/admin/review/v1/devices/config',
    type: 'get',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/review/v1/devices/config',
    type: 'put',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/review/v1/devices/space',
    type: 'get',
    response: config => {
      return space
    }
  },
  {
    url: '/admin/v1/users/[0-9]',
    type: 'delete',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]/actived',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]/inactived',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/changepassword',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]/resetpassword',
    type: 'put',
    response: config => {
      return user
    }
  }
]

