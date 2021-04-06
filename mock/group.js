const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    disksn: '1239876',
    createdate: '@date',
    totalcount: 12,
    finishcount: 5,
    errorcount: 7,
    faultcount: 14,
    'status|1': [0, 1],
    'statusstr|1': ['有效', '无效']
  }))
}

module.exports = [
  {
    url: '/admin/review/v1/filegroups',
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
  }
]

