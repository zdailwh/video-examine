<template>
  <div class="app-container">
    <div style="width: 600px">
      <el-row v-if="space.avail">
        <el-col :span="24">
          <el-card shadow="always">
            <div class="spaceWrap">
              <p>
                <el-progress :percentage="parseInt(((space.total - space.avail) / space.total) * 100)" :color="customColorMethod" :stroke-width="15" style="margin-bottom: 10px;" />
                {{ (space.avail / 1024).toFixed(3) }} GB 可用 ， 共 {{ (space.total / 1024).toFixed(3) }} GB
              </p>
              <p>
                <el-tag v-if="space.writeable === 1" type="plain" effect="plain">可写</el-tag>
                <el-tag v-else type="warning" effect="plain">不可写</el-tag>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-col :span="24">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>故障报警配置</span>
            </div>
            <el-form ref="form" :model="formdata" :rules="ruleValidate" label-width="160px">
              <el-form-item label="线程数" prop="thread">
                <el-slider v-model="formdata.thread" :min="1" :max="8" show-input />
              </el-form-item>
              <el-form-item label="黑场最小门限(单位s)" prop="black_d">
                <el-slider v-model="formdata.black_d" :min="1" :max="15" show-input />
              </el-form-item>
              <el-form-item label="黑场判断阈值" prop="black_th">
                <el-slider v-model="formdata.black_th" :min="0.99" :max="0.999" :step="0.001" show-input />
              </el-form-item>
              <el-form-item label="静帧最小门限(单位s)" prop="freeze_d">
                <el-slider v-model="formdata.freeze_d" :min="1" :max="15" show-input />
              </el-form-item>
              <el-form-item label="爆音高门限分贝" prop="sonic_hi">
                <el-slider v-model="formdata.sonic_hi" :min="0" :max="5" show-input />
              </el-form-item>
              <el-form-item label="爆音低门限分贝" prop="sonic_low">
                <el-slider v-model="formdata.sonic_low" :min="-10" :max="-1" show-input />
              </el-form-item>
              <el-form-item>
                <el-button v-if="!isVisitor" class="filter-item" @click="reset">
                  恢复默认值
                </el-button>
                <el-button v-if="!isVisitor" class="filter-item" type="primary" @click="commit">
                  提交配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { deviceRead, deviceUpdate, deviceSpace } from '@/api/device'
export default {
  data() {
    return {
      isVisitor: (Cookies.get('Filereview-isVisitor') && JSON.parse(Cookies.get('Filereview-isVisitor'))) || false,
      space: {},
      resetdata: {
        thread: 5,
        black_d: 5,
        black_th: 0.995,
        freeze_d: 5,
        sonic_hi: 0,
        sonic_low: -3
      },
      formdata: {
        thread: null,
        black_d: null,
        black_th: null,
        freeze_d: null,
        sonic_hi: null,
        sonic_low: null
      },
      ruleValidate: {
        thread: [
          { required: true, message: '线程数不能为空', trigger: 'blur' }
        ],
        black_d: [
          { required: true, message: '黑场最小门限不能为空', trigger: 'blur' }
        ],
        black_th: [
          { required: true, message: '黑场判断阈值不能为空', trigger: 'blur' }
        ],
        freeze_d: [
          { required: true, message: '静帧最小门限不能为空', trigger: 'blur' }
        ],
        sonic_hi: [
          { required: true, message: '爆音高门限分贝不能为空', trigger: 'blur' }
        ],
        sonic_low: [
          { required: true, message: '爆音低门限分贝不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDeviceSpace()
    this.getDeviceSetting()
  },
  methods: {
    customColorMethod(percentage) {
      if (percentage < 20) {
        return '#6f7ad3'
      } else if (percentage < 40) {
        return '#1989fa'
      } else if (percentage < 60) {
        return '#5cb87a'
      } else if (percentage < 80) {
        return '#e6a23c'
      } else if (percentage < 100) {
        return '#f56c6c'
      } else {
        return '#f56c6c'
      }
    },
    getDeviceSpace() {
      deviceSpace().then(response => {
        this.space = response || {}
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    getDeviceSetting() {
      deviceRead().then(response => {
        if (response) {
          this.formdata.thread = parseInt(response.thread)
          this.formdata.black_d = parseInt(response.black_d)
          this.formdata.black_th = parseFloat(response.black_th)
          this.formdata.freeze_d = parseInt(response.freeze_d)
          this.formdata.sonic_hi = parseInt(response.sonic_hi)
          this.formdata.sonic_low = parseInt(response.sonic_low)
        }
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    commit() {
      console.log(this.formdata)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.deviceEdit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deviceEdit() {
      deviceUpdate(this.formdata).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.getDeviceSetting()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    reset() {
      this.formdata = JSON.parse(JSON.stringify(this.resetdata))
    }
  }
}
</script>
<style scoped>
.spaceWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
