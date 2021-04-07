<template>
  <div class="app-container">
    <div class="formWrap">
      <el-form ref="addForm" label-width="100px">
        <el-form-item prop="disksn" label="硬盘序列号：">
          <el-input v-model="addForm.disksn" placeholder="请输入原始硬盘序列号" />
        </el-form-item>
        <el-form-item label="文件：">
          <el-button class="filter-item" icon="el-icon-folder-opened" @click="folderCheck">
            选择文件所属目录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-upload" @click="createHandle">
            创建任务
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- <div>
      <el-button v-if="status === Status.pause" @click="handleResume">恢复</el-button>
      <el-button v-else :disabled="status !== Status.uploading || !container.hash" @click="handlePause">暂停</el-button>

      <div>计算文件 hash</div>
      <el-progress :percentage="hashPercentage" />
      <div>总进度</div>
      <el-progress :percentage="fakeUploadPercentage" />
    </div> -->
    <div v-show="list.length" class="fileTableWrap">
      <el-form>
        <el-form-item label="文件类型筛选" style="margin-bottom: 10px;">
          <el-checkbox-group v-model="checkedExts" @change="extFilter">
            <el-checkbox v-for="item in extsArr" :key="item" :label="item" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" :data="filterList" border fit highlight-current-row size="small" style="width: 800px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="文件名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.file.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小" align="center">
          <template slot-scope="{row}">
            <span>{{ row.file.size }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="{row}">
            <span>{{ row.file.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件路径" align="center">
          <template slot-scope="{row}">
            <span>{{ row.file.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传进度" align="center">
          <template slot-scope="{row}">
            <el-progress :percentage="row.percentage" />
            <!-- <span>{{ row.percentage }}</span> -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <span></span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

  </div>
</template>
<script>
import { createTask, mergeTask } from '@/api/task'
const SIZE = 50 * 1024 * 1024 // 切片大小

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading'
}
export default {
  data() {
    return {
      handleList: [],
      list: [],
      filterList: [],
      checkedList: [],
      rootHandle: {},
      addForm: {
        disksn: ''
      },
      Status,
      container: {
        file: null,
        hash: '',
        worker: null
      },
      hashPercentage: 0,
      currFileIdx: 0,
      chunkData: [],
      requestList: [],
      status: Status.wait,
      // 当暂停时会取消 xhr 导致进度条后退
      // 为了避免这种情况，需要定义一个假的进度条
      fakeUploadPercentage: 0,
      extsArr: [],
      checkedExts: []
    }
  },
  computed: {
    uploadDisabled() {
      return (
        !this.container.file ||
        [Status.pause, Status.uploading].includes(this.status)
      )
    },
    uploadPercentage() {
      if (!this.container.file || !this.chunkData.length) return 0
      const loaded = this.chunkData
        .map(item => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur)
      return parseInt((loaded / this.container.file.size).toFixed(2))
    }
  },
  watch: {
    uploadPercentage(now) {
      this.checkedList[this.currFileIdx].percentage = now > 100 ? 100 : now

      if (now > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = now
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async fileCheck() {
      const fileHandles = await window.showOpenFilePicker({ multiple: true })
      fileHandles.forEach(async(item, idx, arr) => {
        console.log(item)
        const file = await item.getFile()
        console.log(file)
      })
    },
    resetFilelist() {
      this.list = []
      this.filterList = []
      this.$refs.multipleTable.clearSelection()
      this.extsArr = []
      this.checkedExts = []
    },
    async folderCheck() {
      this.resetFilelist()
      const parentHandle = await window.showDirectoryPicker()
      this.rootHandle = parentHandle
      this.rootDirectory = parentHandle.name
      await this.getSub(parentHandle)

      this.filterList = this.list
      this.$nextTick(() => {
        if (this.filterList) {
          this.filterList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      })

      this.getExts()
    },
    async getSub(parentHandle) {
      var that = this
      for await (const entry of parentHandle.values()) {
        if (entry.kind === 'directory') {
          var subHandle = await parentHandle.getDirectoryHandle(entry.name, { create: false })
          await that.getSub(subHandle)
        } else if (entry.kind === 'file') {
          that.handleList.push(entry)
          // console.log(await that.rootHandle.resolve(entry))
          // console.log(await entry.getFile())
          var file = await entry.getFile()
          file.path = this.rootDirectory + '/' + (await that.rootHandle.resolve(entry)).join('/')
          var ext = file.name.substring(file.name.lastIndexOf('.') + 1)
          that.list.push({ file: file, ext: ext, percentage: 0 })
        }
      }
    },
    getExts() {
      const exts = []
      this.list.forEach((fileitem, idx, arr) => {
        if (exts.indexOf(fileitem.ext) === -1) {
          exts.push(fileitem.ext)
        }
      })
      this.extsArr = exts
      this.checkedExts = exts
    },
    extFilter() {
      this.filterList = this.list.filter((fileitem, idx, arr) => {
        return this.checkedExts.indexOf(fileitem.ext) !== -1
      })
      this.$nextTick(() => {
        if (this.filterList) {
          this.filterList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.checkedList = val
    },
    async createHandle() {
      if (!this.addForm.disksn) {
        this.$message({
          message: '请填写磁盘序列号！',
          type: 'warning'
        })
        return
      }
      if (!this.checkedList.length) {
        this.$message({
          message: '请选择要上传的文件！',
          type: 'warning'
        })
        return
      }

      await this.createTasks(this.checkedList)
    },
    async createTasks(filelist) {
      const requestList = filelist.map(async(listItem, idx, arr) => {
        const fileChunkList = this.createFileChunk(listItem.file)
        filelist[idx].fileChunkList = fileChunkList
        filelist[idx].hash = await this.calculateHash(fileChunkList)
        await this.createTask(listItem, idx)
      })
      await Promise.all(requestList)
      this.$message({
        message: '任务创建成功，开始上传文件！',
        type: 'success'
      })
      await this.uploadFiles(filelist, 0)
    },
    async createTask(fileItem, idx) {
      var md5 = fileItem.hash
      var params = {
        disksn: this.addForm.disksn,
        localpath: fileItem.file.path,
        name: fileItem.file.name,
        md5: md5,
        size: fileItem.file.size,
        ext: fileItem.ext,
        realpath: md5 + '/' + md5 + '.' + fileItem.ext
      }
      return new Promise((resolve, reject) => {
        createTask(params).then(response => {
          this.checkedList[idx].taskid = response.id
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    async uploadFiles(filelist, startIdx) {
      const listItem = filelist[startIdx]
      const fileChunkList = listItem.fileChunkList
      this.container.file = listItem.file
      // this.resetData()
      // Object.assign(this.$data, this.$options.data())
      // this.container.file = file

      // this.status = Status.uploading
      // const fileChunkList = this.createFileChunk(this.container.file)
      // this.container.hash = await this.calculateHash(fileChunkList)

      // const { shouldUpload, uploadedList } = await this.verifyUpload(
      //   this.container.file.name,
      //   this.container.hash
      // )
      // if (!shouldUpload) {
      //   this.$message.success('秒传：上传成功')
      //   this.status = Status.wait
      //   return
      // }
      var uploadedList = []
      this.chunkData = fileChunkList.map(({ file }, index) => ({
        taskid: listItem.taskid,
        fileHash: listItem.hash,
        index,
        hash: listItem.hash + '-' + index,
        chunk: file,
        size: file.size,
        percentage: uploadedList.includes(index) ? 100 : 0
      }))
      this.currFileIdx = startIdx

      // await this.uploadChunks(uploadedList)
      await this.uploadChunks()
      if (startIdx < filelist.length - 1) {
        await this.uploadFiles(filelist, startIdx + 1)
      } else {
        console.log('所有文件上传结束')
      }
    },
    // 暂停
    handlePause() {
      this.status = Status.pause
      this.resetData()
    },
    resetData() {
      this.requestList.forEach(xhr => xhr?.abort())
      this.requestList = []
      if (this.container.worker) {
        this.container.worker.onmessage = null
      }
    },
    // 恢复
    async handleResume() {
      this.status = Status.uploading
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      )
      await this.uploadChunks(uploadedList)
    },
    // 上传切片，同时过滤已上传的切片
    async uploadChunks(uploadedList = []) {
      const requestList = this.chunkData
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ taskid, fileHash, chunk, hash, index }) => {
          const formData = new FormData()
          formData.append('reviewId', taskid)
          formData.append('chunk', chunk)
          formData.append('hash', hash)
          formData.append('chunkTotal', this.chunkData.length)
          formData.append('fileHash', fileHash)
          return { formData, index }
        })
        .map(async({ formData, index }) =>
          this.myRequest({
            url: '/api/admin/review/v1/chunks',
            method: 'post',
            data: formData,
            onProgress: this.createProgressHandler(this.chunkData[index]),
            requestList: this.requestList
          })
        )
      await Promise.all(requestList).then(async(result) => {
        console.log(result)
        // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
        // 合并切片
        if (uploadedList.length + requestList.length === this.chunkData.length) {
          await this.mergeRequest(this.checkedList[this.currFileIdx].taskid)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // xhr
    myRequest({ url, method, data, headers = {}, onProgress = e => e, requestList }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = onProgress
        xhr.open(method, url)
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        )
        xhr.send(data)
        xhr.onload = e => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr)
            requestList.splice(xhrIndex, 1)
          }
          resolve({
            data: e.target.response
          })
        }
        // 暴露当前 xhr 给外部
        requestList?.push(xhr)
      })
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return fileChunkList
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
      return new Promise(resolve => {
        this.container.worker = new Worker('/filereview/hash.js')
        this.container.worker.postMessage({ fileChunkList })
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data
          this.hashPercentage = percentage
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    // 通知服务端合并切片
    async mergeRequest(id) {
      mergeTask({ id: id }).then(response => {
        // this.$message({
        //   message: '合并成功！',
        //   type: 'success'
        // })
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    // 根据 hash 验证文件是否曾经已经被上传过
    // 没有才进行上传
    async verifyUpload(filename, fileHash) {
      const { data } = await this.myRequest({
        url: '/file/verify.json',
        method: 'get',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          filename,
          fileHash
        })
      })
      return JSON.parse(data)
    },
    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler(item) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100))
      }
    },
    getMyDate() {
      var dateObj = new Date()
      var m = dateObj.getMonth() + 1
      var d = dateObj.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      return '' + m + d
    }
  }
}
</script>
<style scoped>
.formWrap {
  width: 800px;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 10px;
}
.fileTableWrap {
  margin-top: 10px;
}
</style>
