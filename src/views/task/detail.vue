<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="8" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>静帧</span>
          </div>
          <div class="tableWrap">
            <el-table :data="list_freeze" size="small" highlight-current-row height="250" style="width: 100%;">
              <el-table-column label="开始" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.start | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.end | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="持续" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.duration }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="query_freeze.page"
              :page-size="query_freeze.limit"
              :total="query_freeze.total"
              layout="total, prev, pager, next"
              @current-change="getListFreeze"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>彩条</span>
          </div>
          <div class="tableWrap">
            <el-table :data="list_colorbar" size="small" highlight-current-row height="250" style="width: 100%;">
              <el-table-column label="开始" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.start | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.end | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="持续" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.duration }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="query_colorbar.page"
              :page-size="query_colorbar.limit"
              :total="query_colorbar.total"
              layout="total, prev, pager, next"
              @current-change="getListColorbar"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>黑场</span>
          </div>
          <div class="tableWrap">
            <el-table :data="list_black" size="small" highlight-current-row height="250" style="width: 100%;">
              <el-table-column label="开始" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.start | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.end | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="持续" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.duration }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="query_black.page"
              :page-size="query_black.limit"
              :total="query_black.total"
              layout="total, prev, pager, next"
              @current-change="getListBlack"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>静音</span>
          </div>
          <div class="tableWrap">
            <el-table :data="list_silence" size="small" highlight-current-row height="250" style="width: 100%;">
              <el-table-column label="开始" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.start | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.end | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="持续" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.duration }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="query_silence.page"
              :page-size="query_silence.limit"
              :total="query_silence.total"
              layout="total, prev, pager, next"
              @current-change="getListSilence"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>爆音</span>
          </div>
          <div class="tableWrap">
            <el-table :data="list_sonic" size="small" highlight-current-row height="250" style="width: 100%;">
              <el-table-column label="开始" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.start | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.end | formateSeconds }}</span>
                </template>
              </el-table-column>
              <el-table-column label="持续" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.duration }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="query_sonic.page"
              :page-size="query_sonic.limit"
              :total="query_sonic.total"
              layout="total, prev, pager, next"
              @current-change="getListSonic"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  filters: {
    formateSeconds(endTime) {
      let secondTime = parseInt(endTime) // 将传入的秒的值转化为Number
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ''
      if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) // 获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) // 获取秒数，秒数取佘，得到整数秒数
        if (min > 60) { // 如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) // 获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) // 获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      return result
    }
  },
  data() {
    return {
      allResult: {},
      list_black: [], // 黑场
      list_colorbar: [], // 彩条
      list_freeze: [], // 静帧
      list_silence: [], // 静音
      list_sonic: [], // 爆音
      query_black: {
        total: 0,
        page: 1,
        limit: 10
      },
      query_freeze: {
        total: 0,
        page: 1,
        limit: 10
      },
      query_colorbar: {
        total: 0,
        page: 1,
        limit: 10
      },
      query_silence: {
        total: 0,
        page: 1,
        limit: 10
      },
      query_sonic: {
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    if (this.$route.params && this.$route.params.result) {
      this.allResult = JSON.parse(this.$route.params.result)
      this.getListBlack()
      this.getListFreeze()
      this.getListColorbar()
      this.getListSilence()
      this.getListSonic()
    }
  },
  methods: {
    getListBlack() {
      var all = this.allResult.black || []
      this.query_black.total = all.length
      var startIdx = (this.query_black.page - 1) * this.query_black.limit
      this.list_black = all.slice(startIdx, startIdx + this.query_black.limit)
    },
    getListFreeze() {
      var all = this.allResult.freeze || []
      this.query_freeze.total = all.length
      var startIdx = (this.query_freeze.page - 1) * this.query_freeze.limit
      this.list_freeze = all.slice(startIdx, startIdx + this.query_freeze.limit)
    },
    getListColorbar() {
      var all = this.allResult.colorbar || []
      this.query_colorbar.total = all.length
      var startIdx = (this.query_colorbar.page - 1) * this.query_colorbar.limit
      this.list_colorbar = all.slice(startIdx, startIdx + this.query_colorbar.limit)
    },
    getListSilence() {
      var all = this.allResult.silence || []
      this.query_silence.total = all.length
      var startIdx = (this.query_silence.page - 1) * this.query_silence.limit
      this.list_silence = all.slice(startIdx, startIdx + this.query_silence.limit)
    },
    getListSonic() {
      var all = this.allResult.sonic || []
      this.query_sonic.total = all.length
      var startIdx = (this.query_sonic.page - 1) * this.query_sonic.limit
      this.list_sonic = all.slice(startIdx, startIdx + this.query_sonic.limit)
    }
  }
}
</script>
