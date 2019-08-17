<template>
  <div class="panel-wraper">
    <div class="panel">
      <div class="panel-header">商品属性</div>
      <div class="panel-body">
        <div class="panel-body_list">
          <span :class="{active: property.id === prop.id}" v-for="(prop, index) in baseProperties" :key="prop.id"
           :data-id="prop.id" @click="propertyClick(prop, index)">{{prop.name}}</span>
        </div>
      </div>
      <div class="panel-footer">
        <el-button class="btns" size="small" @click="addProperty">添加</el-button>
        <el-button class="btns" size="small" @click="dialogFormVisible = !dialogFormVisible">编辑</el-button>
        <el-button class="btns" size="small" @click="delProperty">删除</el-button>
      </div>
    </div>
    <div class="panel" v-show="property.id > 0">
      <div class="panel-header">{{property.name}} - 属性值</div>
      <div class="panel-body">
        <div class="panel-body_list">
          <span :class="{active: propertyValue.id === item.id}" v-for="(item, index) in property.values" :key="item.id" @click="propertyValueClick(item, index)"
           :data-id="item.id">{{item.value}}</span>
        </div>
      </div>
      <div class="panel-footer">
        <el-button class="btns" size="small" @click="addPropertyValue">添加</el-button>
        <el-button class="btns" size="small" @click="dialogPropertyValue = !dialogPropertyValue">编辑</el-button>
        <el-button class="btns" size="small" @click="delPropertyValue">删除</el-button>
      </div>
    </div>
    <el-dialog title="添加/编辑属性" :visible.sync="dialogFormVisible">
      <el-form :model="property">
        <el-form-item label="属性名" :label-width="formLabelWidth">
          <el-input v-model="property.name" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="property.remark" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProperty">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加/编辑属性值" :visible.sync="dialogPropertyValue">
      <el-form :model="propertyValue">
        <el-form-item label="属性名" :label-width="formLabelWidth">
          <el-input v-model="propertyValue.value" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPropertyValue = false">取 消</el-button>
        <el-button type="primary" @click="savePropertyValue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogPropertyValue: false,
      formLabelWidth: '120px',
      propertyIndex: -1,
      property: {
        id: 0,
        name: '',
        remark: '',
        values: []
      },
      propertyValue: {
        id: 0,
        propertyId: 0,
        value: ''
      }
    }
  },
  methods: {
    propertyClick (prop, index) {
      this.property = prop
      this.propertyIndex = index
    },
    propertyValueClick (value, index) {
      this.propertyValue = value
    },
    addProperty () {
      this.property = {id: 0, name: '', remark: '', values: []}
      this.dialogFormVisible = true
    },
    delProperty () {
      if (this.propertyIndex >= 0) {
        this.$store.dispatch('deleteProperty', this.propertyIndex).then(res => {})
      }
    },
    saveProperty () {
      if (!this.property.name) {
        this.$message({
          showClose: true,
          message: '属性名不能为空',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('saveBaseProperty', this.property).then(res => {
        this.property = {
          id: 0,
          name: '',
          remark: ''
        }
        this.dialogFormVisible = false
      })
    },
    addPropertyValue () {
      this.propertyValue.propertyId = this.property.id
      this.dialogPropertyValue = true
    },
    delPropertyValue () {
      if (this.propertyValue.id > 0) {
        this.$store.dispatch('deletePropertyValue', this.propertyValue.id).then(res => {
          if (res) {
            let values = []
            this.property.values.forEach(v => {
              if (v.id !== this.propertyValue.id) {
                values.push(v)
              }
            })
            this.propertyValue = {
              id: 0,
              propertyId: 0,
              value: ''
            }
            this.property.values = values
          }
        })
      }
    },
    savePropertyValue () {
      if (!this.propertyValue.value) {
        this.$message({
          showClose: true,
          message: '属性值不能为空',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('saveBasePropertyValue', this.propertyValue).then(json => {
        if (json.code === 200 && this.propertyValue.id === 0) {
          this.propertyValue.id = json.data
          if (this.property.values) {
            this.property.values = this.property.values.concat(this.propertyValue)
          } else {
            this.property.values = [this.propertyValue]
          }
        }
        this.propertyValue = {
          id: 0,
          propertyId: 0,
          value: ''
        }
        this.dialogPropertyValue = false
      })
    }
  },
  computed: {
    baseProperties () {
      return this.$store.getters.baseProperties
    }
  },
  created () {
    this.$store.dispatch('listBaseProperties').then(res => {
    })
  }
}
</script>
<style type="text/css" lang="scss" scoped>
  .panel-wraper {
    text-align: left;
    display: inline-block;
    height: 100%;
    .panel {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      display: inline-block;
      vertical-align: middle;
      width: 200px;
      height: calc(100% - 200px);
      box-sizing: border-box;
      position: relative;
      .panel-header {
        height: 40px;
        line-height: 40px;
        background: #f5f7fa;
        margin: 0;
        padding-left: 15px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
        color: #000;
      }
      .panel-body {
        height: 246px;
        margin-bottom: 40px;
        .panel-body_list {
          margin: 0;
          padding: 6px 0;
          list-style: none;
          height: 246px;
          overflow: auto;
          box-sizing: border-box;
          span {
            color: #606266;
            font-size: 14px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            box-sizing: border-box;
            padding-left: 24px;
            line-height: 30px;
            cursor: pointer;
          }
          span:hover {
            color: #65C9C4;
          }
          span.active {
            color: #65C9C4;
          }
        }
      }
      .panel-footer {
        height: 40px;
        background: #fff;
        margin: 0;
        padding: 0;
        border-top: 1px solid #ebeef5;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: 14px;
        color: #5e6d82;
        line-height: 1.5em;
        z-index: 1;
        .btns {
          margin-left: 15px;
          margin-top: 5px;
          padding: 6px 5px;
        }
      }
    }
  }
</style>
