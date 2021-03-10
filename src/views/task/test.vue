<template>
  <div class="app-container">
    <el-form ref="filterForm">
      <el-form-item>
        <!-- <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleCheckFiles=true">
          选择文件
        </el-button> -->
        <el-input v-model="inputpath" placeholder="请输入文件路径" />
        <input type="file" name="hideFile" id="file1">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="upload1">
          上传
        </el-button>
        <!-- <el-button class="filter-item" type="primary" @click="copy">
          拷贝到C盘下的copy
        </el-button> -->
      </el-form-item>
    </el-form>
    <br>
    <input type="file" name="file" @change="handleFileChange">

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
      inputpath: 'E:\\zhaodan\\work\\20200514脚递\\出行\\出行\\免费领券.jpg'
    }
  },
  mounted() {
  },
  methods: {
    listChange() {
      this.list = this.$refs.checkFiles.checkedFiles
      console.log(this.list)
    },
    // 转为Blob对象
    upload() {
      var fso = new ActiveXObject('Scripting.FileSystemObject')
      var fileObj = fso.GetFile(this.inputpath)
      console.log(fileObj.Name)

      var ts = fileObj.OpenAsTextStream(1, -2)
      var s = ts.ReadAll()
      console.log(s)
      ts.Close()

      var blob = new Blob([s])
      console.log(blob)
      // var file = new File([blob], 'note.txt', { type: 'text/plain', lastModified: new Date() })
      // console.log(file)

      // Error in v-on handler: "TypeError: strict 模式下不允许分配到只读属性"
      // blob.name = fileObj.Name
      // blob.type = 'text/plain'
      // blob.lastModifiedDate = fileObj.DateLastModified
      // console.log(blob)

      const formData = new FormData()
      formData.append('file', blob)
      this.request(formData)
    },
    upload1() {
      var fileEle = document.getElementById('file1')
      var filepaht = this.inputpath
      var WshShell = new ActiveXObject('WScript.Shell')

      fileEle.focus()
      setTimeout(function(){
        console.log(filepaht)
        WshShell.sendKeys('E:\\zhaodan\\study\\test-activeX\\demo\\dir.html')
        console.log(fileEle.files)
      }, 5000)
    },
    copy() {
      var pathOrigin = 'E:\\zhaodan\\study\\test-activeX\\demo'
      var pathTarget = 'C:\\demo'
      var fso = new ActiveXObject('Scripting.FileSystemObject')
      fso.CopyFolder(pathOrigin, pathTarget, true)
    },
    request(formdata) {
      axios.post('/uploadfile', formdata)
        .then(function(response) {
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    handleFileChange(e) {
      const [file] = e.target.files
      const formData = new FormData()
      formData.append('file', file)
      this.request(formData)
      console.log(file)
    }
  }
}
</script>
