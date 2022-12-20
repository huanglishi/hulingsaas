<template>
  <div class="header-nav">
    <i class="iconfont icon-jiantou-zuo"></i>
    <p>会员注册</p>
  </div>
  <p class="tips">您目前处于网站管理状态，请先退出再注册</p>
  <div class="img">
    <div class="icon"></div>
  </div>
  <div class="input">
    <p>账号</p>
    <input placeholder="请输入账号" type="text" />
  </div>
  <div class="input">
    <p>密码</p>
    <input placeholder="请输入密码" type="text" />
  </div>
  <div class="login-btn">注册</div>
</template>

<script>
import _ from "lodash-es";
import { siteData } from "../store";
export default {
  name: "regstry",
  setup() {
    const store = siteData();
    const jump = () => {
      const regstry = _.find(store.systemPage.list, ["name", "会员注册"]);
      store.systemPage.activeId = regstry.id;
      const locationOrigin = location.href.split("?")[0];
      history.pushState(
        {},
        "",
        `${locationOrigin}?type=page&compName=${regstry.component}&systemPageId=${regstry.id}`
      );
    };
    return {
      jump,
    };
  },
};
</script>

<style lang="less" scoped>
.header-nav {
  position: relative;
  display: flex;
  padding: 0 15px;
  line-height: 50px;
  border-bottom: 1px solid rgb(234, 234, 234);
  box-sizing: border-box;
  p {
    width: 100%;
    font-size: 18px;
    text-align: center;
  }
  i {
    position: absolute;
    left: 15px;
    top: 50%;
    font-size: 18px;
    transform: translateY(-50%);
  }
}
.tips {
  text-align: center;
  line-height: 30px;
  color: #eb6a40;
  background-color: #fef5d8;
  margin: 20px 20px;
}

.input {
  display: flex;
  align-items: center;
  padding: 15px 0;
  margin: 0 40px;
  border-bottom: 1px solid rgb(234, 234, 234);
  > p {
    margin-right: 15px;
  }
}
.login-btn {
  padding: 15px;
  text-align: center;
  color: #fff;
  margin: 20px 40px;
  background-color: #ff7214;
  border-radius: 4px;
}
</style>
