<template>
  <div class="app-container">
    <el-form ref="filterForm" :inline="true">
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleCheckFiles=true">
          选择文件
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="upload">
          上传
        </el-button>
        <!-- <el-button class="filter-item" type="primary" @click="copy">
          拷贝到C盘下的copy
        </el-button> -->
      </el-form-item>
    </el-form>
<br/>
    <input type="file" name="file" v-on:change="fileChange">

    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="磁盘序列号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <span></span>
        </template>
      </el-table-column>
    </el-table>

    <check-files ref="checkFiles" :dialog-visible="dialogVisibleCheckFiles" @listChange="listChange" @closeCheckFiles="dialogVisibleCheckFiles=false" />

  </div>
</template>
<script>
import axios from 'axios'
import CheckFiles from './components/CheckFiles'
export default {
  components: { CheckFiles },
  data() {
    return {
      dialogVisibleCheckFiles: false,
      list: [],
      file: ''
    }
  },
  mounted() {
  },
  methods: {
    listChange() {
      this.list = this.$refs.checkFiles.checkedFiles
      console.log(this.list)
    },
    upload() {
      const formData = new FormData()
      formData.append('file', this.list[0].fileobj)
      this.request(formData)
    },
    fileChange(param) {
      const formData = new FormData()
      formData.append('file', param.target.files[0])
      this.request(formData)
    },
    copy() {
      var pathOrigin = 'E:\\zhaodan\\study\\test-activeX\\demo'
      var pathTarget = 'C:\\demo'
      var fso = new ActiveXObject('Scripting.FileSystemObject')
      fso.CopyFolder(pathOrigin, pathTarget, true)
    },
    request(formdata) {
      axios.post('/uploadfile', formdata)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>
