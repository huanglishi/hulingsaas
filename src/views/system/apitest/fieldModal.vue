<template>
  <BasicModal
    @register="fieldregister"
    title="显示接口对应数据字段说明"
    :showOkBtn="false"
    :showCancelBtn="false"
    width="820px"
    :bodyStyle="{ background: '#ededed'}"
  >
  <div class="tablecontent">
          <table style="table-layout: fixed;">
              <thead>
                <tr>
                  <th class="hcenter">字段说明</th>
                  <th class="hcenter" style="width:120px;">字段名称</th>
                  <th class="hcenter" style="width:130px;">字段长度</th>
                  <th class="hcenter" style="width:120px;">字段类型</th>
                </tr>
              </thead>
              <tbody class="table-tbody">
                <template v-for="item in fieldList">
                  <tr :class="{colorline:item['COLUMN_NAME']=='id'}">
                    <td class="table-cell " >
                      <div class="textbox">
                        {{item["COLUMN_NAME"]!='id'?item["COLUMN_COMMENT"]:"ID-表名"+item["tablename"] }}
                      </div>
                    </td>
                    <td class="table-cell">
                      <div class="textbox">
                        {{item["COLUMN_NAME"]}}
                      </div>
                    </td>
                    <td class="table-cell ">
                      <div class="textbox">
                        {{item["CHARACTER_MAXIMUM_LENGTH"]?item["CHARACTER_MAXIMUM_LENGTH"]:item["NUMERIC_PRECISION"]}}
                      </div>
                    </td>
                    <td class="table-cell ">
                      <div class="textbox">
                        {{item["DATA_TYPE"]}}
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
          </table>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent ,ref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: { BasicModal },
    setup() {
      const fieldList=ref([])
      const [fieldregister, { setModalProps, closeModal }] = useModalInner(async (data) => {
         if(data){
          fieldList.value=data
         }
      });
      return {
        fieldregister,
        fieldList,
        closeModal,
        setModalProps: () => {
          setModalProps({ title: 'Modal New Title' });
        },
      };
    },
  });
</script>
<style lang="less" scoped>
.tablecontent{
    padding: 20px;
    background-color: #ffffff;
      table{
        width: 100%;
        text-align: left;
        border-radius: 2px 2px 0 0;
        border-collapse: separate;
        border-spacing: 0;
        border-top: 1px solid #f0f0f0;
        tr>th {
            position: relative;
            color: #000000d9;
            font-weight: 500;
            text-align: left;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
            height: 50px;

        }
        .hcenter{
          text-align: left;
          padding: 0px 5px;
        }
        .operat{
          a{
            margin-right: 10px;
            user-select: none;
            cursor: pointer;
          }
        }
        tr:hover{
          background-color: #fafafa;
        }
      }
      table>thead>tr:first-child th:first-child {
          border-top-left-radius: 2px;
      }
    .table-tbody{
      .table-cell{
        .editbox{
          height: 35px;
          .inputbox{
            margin-top: 3px;
          }
          .text{
            margin-top: 3px;
            padding: 4px 11px;
          }
          .destext{
            color: #999;
          }
        }
        .textbox{
          text-align: left;
          padding: 10px 5px;
          border-bottom: 1px solid #f0f0f0;
        }
      }
      .colorline{
        background-color: #e6f7ff;
      }
      .alleft{
        text-align: left;
        padding-left: 25px;
      }
    }
}
</style>
