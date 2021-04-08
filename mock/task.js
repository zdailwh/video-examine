const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    update_time:'@datetime',
    'status|1': [0, 1, 2, 3, 4, 5],
    'statusstr|1': ['已创建', '文件待上传', '文件上传成功', '处理中', '处理成功', '处理失败'],
    disksn: '12345678',
    localpath: 'C:\\lyl\\test.ts',
    name: '12345678123456781234567812345678',
    ext: 'ts',
    realpath: '/data/web/www/private/uploads/12345678123456781234567812345678/12345678123456781234567812345678.ts',
    mime: '',
    size: 0,
    sizestr: '0B',
    md5: '12345678123456781234567812345678',
    prority: 0,
    retry: 0,
    reviewtime: '@datetime',
    finishtime: '@datetime',
    log: '',
    result: '',
    'filestatus|1': [0, 1, 2],
    'filestatustr|1': ['未知', '正常', '有故障'],
  }))
}

const task = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  update_time:'@datetime',
  'status|1': [0, 1, 2, 3, 4, 5],
  'statusstr|1': ['已创建', '文件待上传', '文件上传成功', '处理中', '处理成功', '处理失败'],
  disksn: '12345678',
  localpath: 'C:\\lyl\\test.ts',
  name: '12345678123456781234567812345678',
  ext: 'ts',
  realpath: '/data/web/www/private/uploads/12345678123456781234567812345678/12345678123456781234567812345678.ts',
  mime: '',
  size: 0,
  sizestr: '0B',
  md5: '12345678123456781234567812345678',
  prority: 0,
  retry: 0,
  reviewtime: '@datetime',
  finishtime: '@datetime',
  log: '',
  result: '',
  'filestatus|1': [0, 1, 2],
  'filestatustr|1': ['未知', '正常', '有故障'],
})

const infoList = []
const infoCount = 60

for (let i = 0; i < infoCount; i++) {
  infoList.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    serialNumber: '@increment',
    p1: '00:01:13',
    p2: '静音',
    p3: '2s'
  }))
}

module.exports = [
  {
    url: '/admin/review/v1/filereviews/[0-9]',
    type: 'get',
    response: config => {
      const { page = 0, per_page = 20 } = config.query
      let mockInfoList = infoList
      const pageList = mockInfoList.filter((item, index) => index < per_page * (page + 1) && index >= per_page * page)
      return {
        total: mockInfoList.length,
        items: pageList
      }
    }
  },
  {
    url: '/admin/review/v1/filereviews',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 0, per_page = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < per_page * (page + 1) && index >= per_page * page)

      return {
        total: mockList.length,
        items: pageList
      }
    }
  },
  {
    url: '/admin/review/v1/filereviews',
    type: 'post',
    response: config => {
      return task
    }
  },
  {
    url: '/admin/review/v1/filereviews/[0-9]/merge',
    type: 'put',
    response: config => {
      return task
    }
  },
  {
    url: '/admin/review/v1/filereviews/[0-9]',
    type: 'put',
    response: config => {
      return task
    }
  },
  {
    url: '/admin/review/v1/filereviews/[0-9]',
    type: 'delete',
    response: config => {
      return task
    }
  }
]

