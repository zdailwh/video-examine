const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    serialNumber: '@increment',
    filename: '1.ts',
    size: '231113',
    path: 'c:\\1.ts',
    'status|1': ['待上传', '上传中', '处理中', '完成'],
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/file/upload',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {}
      }
    }
  },
  {
    url: '/vue-element-admin/file/verify',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          shouldUpload: [],
          uploadedList: []
        }
      }
    }
  },
  {
    url: '/vue-element-admin/file/merge',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {}
      }
    }
  }
]

