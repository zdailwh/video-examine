<template>
  <el-dialog
    title="选择文件目录"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <div class="treeContainer">
      <el-tree
        ref="tree"
        accordion
        :data="tableDrives"
        :props="treeDefaultProps"
        :load="loadNode"
        lazy
        show-checkbox
        node-key="value"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeDefaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'leaf'
      },
      tableDrives: [],
      checkedNodes: [],
      checkedFiles: []
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      this.$refs.tree.setCheckedNodes([])
      this.$emit('closeCheckFiles')
    },
    commit() {
      this.checkedNodes = this.$refs.tree.getCheckedNodes()
      this.checkedFiles = this.$refs.tree.getCheckedNodes(true)
      this.$emit('listChange')
      this.$emit('closeCheckFiles')
    },
    handleClose(done) {
      this.$emit('closeCheckFiles')
      // done()
    },
    loadNode(node, resolve) {
      if (window.ActiveXObject !== undefined) {
        if (node.level === 0) {
          return resolve(this.getDrives())
        }
        if (node.level === 1) {
          return resolve(this.driveGetFolders(node))
        }
        if (node.level > 1) {
          return resolve(this.folderGetSub(node))
        }
      } else {
        return resolve([])
      }
    },
    getDrives() {
      var fso, s, n, e, x
      fso = new ActiveXObject('Scripting.FileSystemObject')
      e = new Enumerator(fso.Drives)
      s = ''
      for (; !e.atEnd(); e.moveNext()) {
        // x = e.item()
        // s = s + x.DriveLetter
        // s += ':'
        // if (x.DriveType === 3) {
        //   n = x.ShareName
        // } else if (x.IsReady) {
        //   n = x.VolumeName
        // } else {
        //   n = '[驱动器未就绪]'
        // }
        // s += n + ','
        s += e.item()
        s += ','
      }
      var drives = s.split(',')
      var tableDrives = []
      for (var i = 0; i < drives.length - 1; i++) {
        var option = {}
        option.value = drives[i]
        option.text = '[' + drives[i].split(':')[0] + ':]' + drives[i].split(':')[1]
        var driveObj = fso.GetDrive(drives[i])
        option.driveLetter = driveObj.DriveLetter
        option.driveType = driveObj.DriveType
        option.serialNumber = driveObj.SerialNumber
        option.children = []
        tableDrives.push(option)
      }
      return tableDrives
    },
    driveGetFolders(node) {
      var driveObj = node.data
      var fso, f, fc, files, s
      var drive = driveObj.value
      fso = new ActiveXObject('Scripting.FileSystemObject')
      if (fso.DriveExists(drive)) {
        var d = fso.GetDrive(drive)
        if (d.IsReady) {
          f = fso.GetFolder(d.RootFolder)
          fc = new Enumerator(f.SubFolders)
          files = new Enumerator(f.Files)
          s = ''
          for (;!fc.atEnd(); fc.moveNext()) {
            s += fc.item()
            s += ','
          }
          for (;!files.atEnd(); files.moveNext()) {
            s += files.item()
            s += ','
          }
          var len = driveObj.children.length
          if (len >= 0) {
            driveObj.children = []
          }
          if (s !== '') {
            var folders = s.split(',')
            var children = []
            for (var j = 0; j < folders.length - 1; j++) {
              var option = {}
              option.value = folders[j]
              option.serialNumber = driveObj.serialNumber
              if (fso.FolderExists(folders[j])) {
                option.text = fso.GetBaseName(folders[j])
                option.leaf = false
              } else if (fso.FileExists(folders[j])) {
                var fileObj = fso.GetFile(folders[j])
                option.text = fileObj.Name // 文件名称
                option.path = fileObj.Path // 文件路径
                option.size = change(fileObj.Size) // 文件大小（单位：字节）
                option.type = fileObj.Type // 文件类型
                option.attributes = fileObj.attributes // 文件属性
                option.dateCreated = fileObj.Datecreated // 创建时间
                option.dateLastAccessed = fileObj.DateLastAccessed // 上次访问时间
                option.dateLastModified = fileObj.DateLastModified // 上次修改时间
                option.parentFolder = fileObj.ParentFolder // 父目录
                option.rootFolder = fileObj.RootFolder // 根目录
                option.leaf = true
              } else {
                option.text = folders[j]
              }
              option.children = []
              children.push(option)
            }
            return children
          } else {
            return []
          }
        } else {
          alert('无法改变当前内容！')
          return []
        }
      } else {
        return []
      }
    },
    folderGetSub(node) {
      var folderObj = node.data
      var fso, f, fc, files, s
      var folderpath = folderObj.value.substring(0, folderObj.value.length)
      fso = new ActiveXObject('Scripting.FileSystemObject')
      if (fso.FolderExists(folderpath)) {
        // 是文件夹
        f = fso.GetFolder(folderpath)
        fc = new Enumerator(f.SubFolders)
        files = new Enumerator(f.Files)
        s = ''
        for (;!fc.atEnd(); fc.moveNext()) {
          s += fc.item()
          s += ','
        }
        for (;!files.atEnd(); files.moveNext()) {
          s += files.item()
          s += ','
        }
        var len = folderObj.children.length
        if (len >= 0) {
          folderObj.children = []
        }
        if (s !== '') {
          var folders = s.split(',')
          var children = []
          for (var j = 0; j < folders.length - 1; j++) {
            var option = {}
            option.value = folders[j]
            option.serialNumber = folderObj.serialNumber
            if (fso.FolderExists(folders[j])) {
              option.text = fso.GetBaseName(folders[j])
              option.leaf = false
            } else if (fso.FileExists(folders[j])) {
              var fileObj = fso.GetFile(folders[j])
              option.text = fileObj.Name // 文件名称
              option.path = fileObj.Path
              option.size = change(fileObj.Size)
              option.fileobj = fileObj
              // option.path = fileObj.Path // 文件路径
              // option.size = change(fileObj.Size) // 文件大小（单位：字节）
              // option.type = fileObj.Type // 文件类型
              // option.attributes = fileObj.attributes // 文件属性
              // option.dateCreated = fileObj.Datecreated // 创建时间
              // option.dateLastAccessed = fileObj.DateLastAccessed // 上次访问时间
              // option.dateLastModified = fileObj.DateLastModified // 上次修改时间
              // option.parentFolder = fileObj.ParentFolder // 父目录
              // option.rootFolder = fileObj.RootFolder // 根目录
              option.leaf = true
            } else {
              option.text = folders[j]
            }
            option.children = []
            children.push(option)
          }
          return children
        } else {
          return []
        }
      } else if (fso.FileExists(folderpath)) {
        // 是文件
        return []
      } else {
        return []
      }
    }
  }
}
function change(limit) {
  var size = ''
  if (limit < 0.1 * 1024) { // 小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) { // 小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else { // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
  var sizeStr = size + '' // 转成字符串
  var index = sizeStr.indexOf('.') // 获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou === '00') { // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}
</script>
<style scoped>
.treeContainer {
  height: 400px;
  overflow-y: scroll;
}
</style>
