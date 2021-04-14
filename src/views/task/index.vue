<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="disksn">
        <el-input v-model="filterForm.disksn" placeholder="硬盘序列号" style="width:120px" />
      </el-form-item>
      <el-form-item prop="createdate">
        <el-date-picker
          v-model="filterForm.createdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="创建日期"
        />
      </el-form-item>
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.create_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
        />
      </el-form-item>
      <el-form-item prop="update_time_range">
        <el-date-picker
          v-model="filterForm.update_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="更新开始日期"
          end-placeholder="更新结束日期"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="filterForm.status" placeholder="任务状态">
          <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="filestatus">
        <el-select v-model="filterForm.filestatus" placeholder="故障状态">
          <el-option v-for="item in fileStatusArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!selectedItems.length" @click="handleDelSelected">批量删除</el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" :row-class-name="tableRowClassName" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="table-expand" label-width="100px">
            <el-form-item v-if="row.localpath" label="原始目录">
              <span>{{ row.localpath }}</span>
            </el-form-item>
            <el-form-item v-if="row.ext" label="扩展名">
              <span>{{ row.ext }}</span>
            </el-form-item>
            <el-form-item v-if="row.mime" label="MIME类型">
              <span>{{ row.mime }}</span>
            </el-form-item>
            <el-form-item v-if="row.filename" label="文件名称">
              <span>{{ row.filename }}</span>
            </el-form-item>
            <el-form-item v-if="row.realpath" label="保存实际路径">
              <span>{{ row.realpath }}</span>
            </el-form-item>
            <el-form-item v-if="row.path" label="保存相对路径">
              <span>{{ row.path }}</span>
            </el-form-item>
            <el-form-item v-if="row.md5" label="md5值">
              <span>{{ row.md5 }}</span>
            </el-form-item>
            <el-form-item v-if="row.log" label="日志">
              <span>{{ row.log }}</span>
            </el-form-item>
            <el-form-item v-if="row.filegroup && row.filegroup.id" label="任务组ID">
              <span>{{ row.filegroup.id }}</span>
            </el-form-item>
            <el-form-item v-if="row.filegroup && row.filegroup.id" label="任务组">
              <span>{{ JSON.stringify(row.filegroup) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原始硬盘序列号" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.disksn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原始名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sizestr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" width="50px">
        <template slot-scope="{row}">
          <span>{{ row.prority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重试次数" align="center" width="50px">
        <template slot-scope="{row}">
          <span>{{ row.retry }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近审核" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reviewtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.finishtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障点" align="center">
        <template slot-scope="{row}">
          <span v-if="parseInt(row.filestatus) === 2" style="color: #F56C6C;font-weight: bold;">{{ row.filestatustr }}</span>
          <span v-else>{{ row.filestatustr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.statusstr | statusFilter">
            {{ row.statusstr }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-popover
            placement="top"
            width="170"
            trigger="hover"
          >
            <p>确定要删除此任务吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="delTask(row.id, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="medium" style="margin-left: 10px;">删除</el-button>
          </el-popover>
          <el-button v-if="parseInt(row.filestatus) === 2" type="text" size="medium" style="margin-left: 10px;"><router-link :to="{name: 'TaskDetail', params: {result: row.result}}">查看结果</router-link></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import { fetchList, deleteTask } from '@/api/task'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Edit from './edit.vue'

// const STATUS_INIT = 0 // '已创建'
// const STATUS_NOFILE = 1 // '文件待上传'
// const STATUS_UPLOADED = 2 // '文件上传成功'
// const STATUS_DOING = 3 // '处理中'
// const STATUS_SUCCESS = 4 // '处理成功'
// const STATUS_FAIL = 5 // '处理失败'

export default {
  components: { Pagination, Edit },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已创建': 'info',
        '文件待上传': 'info',
        '文件上传成功': '',
        '处理中': 'warning',
        '处理成功': 'success',
        '处理失败': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        disksn: '',
        createdate: '',
        create_time_range: [],
        update_time_range: [],
        status: '',
        filestatus: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleEdit: false,
      statusArr: [{ label: '已创建', value: 0 }, { label: '文件待上传', value: 1 }, { label: '文件上传成功', value: 2 }, { label: '处理中', value: 3 }, { label: '处理成功', value: 4 }, { label: '处理失败', value: 5 }],
      fileStatusArr: [{ label: '未知', value: 0 }, { label: '正常', value: 1 }, { label: '有故障', value: 2 }],
      selectedItems: []
    }
  },
  created() {
    if (this.$route.params.disksn) {
      this.filterForm.disksn = this.$route.params.disksn
    }
    if (this.$route.params.createdate) {
      this.filterForm.createdate = this.$route.params.createdate
    }
    this.handleFilter()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (parseInt(row.filestatus) === 2) {
        return 'warning-row'
      }
      return ''
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items
        this.total = data.total

        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.disksn !== '') {
        this.listQuery.disksn = this.filterForm.disksn
      }
      if (this.filterForm.createdate !== '') {
        this.listQuery.createdate = this.filterForm.createdate
      }
      if (this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.update_time_range.length) {
        this.listQuery.update_time_range = this.filterForm.update_time_range
      }
      if (this.filterForm.status !== '') {
        this.listQuery.status = this.filterForm.status
      }
      if (this.filterForm.filestatus !== '') {
        this.listQuery.filestatus = this.filterForm.filestatus
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.filterForm = {
        disksn: '',
        createdate: '',
        create_time_range: [],
        update_time_range: [],
        status: ''
      }
    },
    delTask(id, idx) {
      deleteTask({ id: id }).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    editHandle(item, idx) {
      this.editItem = item
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible(params) {
      this.dialogVisibleEdit = params
    },
    handleSelectionChange(val) {
      this.selectedItems = val
    },
    handleDelSelected() {
      this.$confirm(`此操作将删除当前选中的${this.selectedItems.length}条记录, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelSelected()
      }).catch(() => {
        console.log('已取消删除')
      })
    },
    doDelSelected() {
      const requestList = this.selectedItems.map(async(listItem, idx, arr) => {
        return new Promise((resolve, reject) => {
          deleteTask({ id: listItem.id }).then(response => {
            resolve(idx)
          }).catch(error => {
            reject(error)
          })
        })
      })
      Promise.all(requestList).then(res => {
        if (res.length < this.selectedItems.length) {
          this.$message({
            message: '批量删除部分执行成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '批量删除执行成功！',
            type: 'success'
          })
        }
        this.getList()
      })
    }
  }
}
</script>
<style scoped>
.myTabelCell p {
  text-align: left;
  margin: 0 auto;
  margin-top: 5px;
}
.table-expand {
  font-size: 0;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
