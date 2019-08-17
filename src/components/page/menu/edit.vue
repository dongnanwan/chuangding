<template>
  <div>

    <div class="custom-tree-container" style="max-width: 300px">

      <div class="block">
        <div class="custom-tree-node" >
          <span>所有权限</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => appendStart(0)">
              添加
            </el-button>
            <!--<el-button-->
              <!--type="text"-->
              <!--size="mini"-->
              <!--@click="() => remove(node, data)">-->
              <!--删除-->
            <!--</el-button>-->
          </span>
        </div>
        <el-tree
          :data="data4"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => {removeId=data.id; dialogVerifyConfirmShown=true}">
                  删除
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => appendStart(data.id)">
                  添加
                </el-button>
              </span>
            </span>
        </el-tree>
      </div>
    </div>

    <el-dialog title="添加子菜单" :visible.sync="dialogBindShown">
      <el-form>
        <el-form-item label="子菜单名称">
          <el-input v-model="menuTitle" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="子菜单路径">
          <el-input v-model="menuPath" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="子菜单图标">
          <el-input v-model="menuIcon" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBindShown = false">取 消</el-button>
        <el-button type="primary" @click="appendConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除确认" :visible.sync="dialogVerifyConfirmShown">
      <el-form>
        <el-form-item label="你确定要删除本菜单吗？"></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVerifyConfirmShown = false">取 消</el-button>
        <el-button type="primary" @click="remove(removeId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  // let id = 1000

  export default {
    data () {
      return {
        data4: [],
        menuTitle: '',
        menuPath: '',
        menuIcon: '',
        menuPid: -1,
        dialogBindShown: false,
        dialogVerifyConfirmShown: false,
        removeId: -1
      }
    },

    methods: {
      refresh () {
        this.$store.dispatch('MENU_ALL').then(res => {
          this.data4 = res.data
        })
      },
      appendStart (id) {
        this.menuPid = id
        this.dialogBindShown = true
      },
      appendConfirm () {
        var params = {
          label: this.menuTitle,
          path: this.menuPath,
          icon: this.menuIcon,
          pid: this.menuPid
        }
        this.$store.dispatch('MENU_INSERT', params).then(res => {
          this.dialogBindShown = false
          this.refresh()
        })
      },
      remove (id) {
        this.$store.dispatch('MENU_DELETE', id).then(res => {
          this.dialogVerifyConfirmShown = false
          this.refresh()
        })
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
