<template>
  <div class="p-2">
    <div class="p-4 mb-2 bg-white" v-if="props.seachFome">
      <BasicForm @register="registerForm" />
    </div>
    <div class="p-2 bg-white">
      <List
        :grid="{ gutter: 5, xs: 1, sm: 2, md: 4, lg: 4, xl: grid, xxl: grid }"
        :data-source="data"
        :pagination="paginationProp"
        :loading="loading"
      >
        <template #header>
          <div class="flex justify-end space-x-2"
            ><slot name="header"></slot>
            <Tooltip>
              <template #title>
                <div class="w-50">每行显示数量</div
                ><Slider
                  id="slider"
                  v-bind="sliderProp"
                  v-model:value="grid"
                  @change="sliderChange"
              /></template>
              <Button><TableOutlined /></Button>
            </Tooltip>
            <Tooltip @click="fetch">
              <template #title>刷新</template>
              <Button><RedoOutlined /></Button>
            </Tooltip>
          </div>
        </template>
        <template #renderItem="{ item }">
          <ListItem>
            <Card>
              <template #title></template>
              <template #cover>
                <div class="imgHeight" style="padding:3px;">
                  <Image :src="item.imgs" :preview="item.mimetype.indexOf('image/')>-1?true:false"/>
                  <div class="imhbtn" >{{item.title}}</div>
                </div>
              </template>
              <template #actions>
                <div v-if="props.select" style="user-select: none;" @click="handleSelect(item)">使用</div>
                <EditOutlined v-if="props.edit" key="edit" />
                 <Popconfirm
                    v-if="props.del"
                    title="是否确认删除?"
                    ok-text="删除"
                    cancel-text="取消"
                    @confirm="handleDelete(item.id)"
                  >
                    <a >删除</a>
                  </Popconfirm>
              </template>

              <CardMeta v-if="item.name">
                <template #title >
                  <TypographyText :content="item.name" :ellipsis="{ tooltip: item.address }" />
                </template>
                <template #avatar v-if="item.avatar">
                  <Avatar  :src="item.avatar" />
                </template>
                <template v-if="item.time" #description>{{ item.time }}</template>
              </CardMeta>
            </Card>
          </ListItem>
        </template>
      </List>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import {
    EditOutlined,
    RedoOutlined,
    TableOutlined,
  } from '@ant-design/icons-vue';
  import { List, Card, Image, Typography, Tooltip, Slider, Avatar,Popconfirm} from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { propTypes } from '/@/utils/propTypes';
  import { Button } from '/@/components/Button';
  import { isFunction } from '/@/utils/is';
  import { useSlider,grid } from './data';
  // 每行个数
  const ListItem = List.Item;
  const CardMeta = Card.Meta;
  const TypographyText = Typography.Text;
  // 获取slider属性
  const sliderProp = computed(() => useSlider(4));
  // 组件接收参数
  const props = defineProps({
    seachFome:propTypes.bool,
    // 请求API的参数
    params: propTypes.object.def({}),
    //api
    api: propTypes.func,
    del:propTypes.bool,
    edit:propTypes.bool,
    select:propTypes.bool,
    setgrid:propTypes.number,
  });
  //暴露内部方法
  const emit = defineEmits(['getMethod', 'delete','select']);
  //数据
  const data = ref([]);
  const loading = ref(true);
  // 切换每行个数
  // cover图片自适应高度
  //修改pageSize并重新请求数据

  // const height = computed(() => {
  //   return `h-${120 - grid.value * 6}`;
  // });
  //表单
  const [registerForm, { validate }] = useForm({
    schemas: [{ field: 'type', component: 'Input', label: '类型' }],
    labelWidth: 80,
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
  });
  //表单提交
  async function handleSubmit() {
    const data = await validate();
    await fetch(data);
  }
  function sliderChange(n) {
    pageSize.value = n * 4;
    fetch();
  }

  // 自动请求并暴露内部方法
  onMounted(() => {
    fetch();
    emit('getMethod', fetch);
  });

  async function fetch(p = {}) {
    loading.value=true;
    const { api, params } = props;
    if (api && isFunction(api)) {
      const res = await api({ ...params, page: page.value, pageSize: pageSize.value, ...p });
      data.value = res.items?res.items:[];
      total.value = res.total;
      loading.value=false;
    }
  }
  //分页相关
  const page = ref(1);
  const pageSize = ref((grid.value*3));
  const total = ref(0);
  const paginationProp = ref({
    showSizeChanger: false,
    showQuickJumper: true,
    pageSize,
    current: page,
    total,
    showTotal: (total) => `总 ${total} 条`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetch();
  }
  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetch();
  }

  async function handleDelete(id) {
    emit('delete', id);
  }
  //选择数据
  async function handleSelect(item) {
    emit('select', item);
  }
</script>
<style lang="less" >
.imgHeight{
  height: 100px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  img{
    max-width: 100%;
    max-height: 100%;
  }
  .imhbtn{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    line-height: 20px;
  }
}
</style>
