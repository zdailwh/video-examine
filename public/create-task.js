const SIZE = 50 * 1024 * 1024 // 切片大小
var fileList = []
var disksn = ''

self.onmessage = function(e) {
  fileList = e.data.filelist || []
  disksn = e.data.disksn || ''
  createTasks()
}

async function createTasks() {
  const requestList = fileList.map(async(listItem, idx, arr) => {
    const fileChunkList = createFileChunk(listItem.file)
    fileList[idx].fileChunkList = fileChunkList
    fileList[idx].hash = await calculateHash(fileChunkList)
    createTask(listItem, idx)
  })
  await Promise.all(requestList).then(async(result) => {
    console.log(result)
    console.log('任务创建成功，开始上传文件！')
  }).catch((error) => {
    console.log(error)
  })
  // await this.uploadFiles(fileList, 0)
}

function createTask(fileItem, idx) {
  var md5 = fileItem.hash
  var formData = new FormData()
  formData.append('disksn', disksn)
  formData.append('localpath', fileItem.file.path)
  formData.append('name', fileItem.file.name)
  formData.append('md5', md5)
  formData.append('size', fileItem.file.size)
  formData.append('ext', fileItem.ext)
  formData.append('realpath', md5 + '/' + md5 + '.' + fileItem.ext)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      // 如果请求成功
      if((xhr.status >= 200 && xhr.status <= 200) || xhr.status === 304) {
        // do successCallback
        console.log(xhr)
        console.log(xhr.response)
        resolve()
      } else {
        reject()
      }
    }

    xhr.open('post', '/api/admin/review/v1/filereviews', false)
    xhr.send(formData)
    // createTask(params).then(response => {
    //   fileList[idx].taskid = response.id
    //   resolve()
    // }).catch(error => {
    //   reject(error)
    // })
  })
}

// 生成文件切片
function createFileChunk(file, size = SIZE) {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + size) })
    cur += size
  }
  return fileChunkList
}
// 生成文件 hash（web-worker）
function calculateHash(fileChunkList) {
  return new Promise(resolve => {
    var calcWorker = new Worker('./hash.js')
    calcWorker.postMessage({ fileChunkList })
    calcWorker.onmessage = e => {
      const { percentage, hash } = e.data
      this.hashPercentage = percentage
      if (hash) {
        resolve(hash)
      }
    }
  })
}