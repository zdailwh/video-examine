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
        <el-select v-model="filterForm.status" placeholder="状态">
          <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-document-add"><router-link :to="{name: 'TaskAdd'}">新建任务</router-link></el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务组名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.groupname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原始硬盘序列号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.disksn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务总数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalcount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功任务数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.finishcount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常任务数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.errorcount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障视频数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.faultcount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 0" type="success">{{ row.statusstr }}</el-tag>
          <el-tag v-else type="info">{{ row.statusstr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium"><router-link :to="{name: 'Task', params: {disksn: row.disksn, createdate: row.createdate}}">查看子任务</router-link></el-button>
          <el-button type="text" size="medium" @click="delHandle(row.id, $index)">删除</el-button>
          <el-button type="text" size="medium"><router-link :to="{name: 'TaskAdd', params: {disksn: row.disksn, groupname: row.groupname}}">新建任务</router-link></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, deleteGroup } from '@/api/group'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
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
        status: ''
      },
      statusArr: [{ label: '有效', value: 0 }, { label: '无效', value: 1 }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    delHandle(id, idx) {
      this.$confirm(`此操作将删除任务组的同时，同步删除对应的所有任务, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delGroup(id, idx)
      }).catch(() => {
        console.log('已取消删除')
      })
    },
    delGroup(id, idx) {
      deleteGroup({ id: id }).then(response => {
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
    }
  }
}
</script>
