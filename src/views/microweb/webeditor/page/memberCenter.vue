<template>
  <div class="wrapper">
    <div class="header-nav">
      <i class="iconfont icon-jiantou-zuo"></i>
      <p>会员登录</p>
    </div>
    <p class="tips">您目前处于网站管理状态，请先退出再登录</p>
    <div class="img">
      <div class="icon"></div>
      <p>123456789</p>
    </div>

    <div class="controll">
      <div class="item">
        <div>
          <i class="iconfont icon-gerenziliao"></i>
          <p>个人资料</p>
        </div>
        <i class="iconfont icon-jiantou-you"></i>
      </div>
      <div class="item">
        <div>
          <i class="iconfont icon-mima"></i>
          <p>修改密码</p>
        </div>
        <i class="iconfont icon-jiantou-you"></i>
      </div>
    </div>

    <div class="out-btn">退出当前登录</div>
  </div>
</template>

<script>
import _ from "lodash-es";
import { siteData } from "../store";
export default {
  name: "memberCenter",
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
.wrapper{
    height: 100%;
    background-color: rgb(247,247,247);
}
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
  margin: 20px;
}
.img {
  padding: 40px 0;
  background-color: #ff7214;
  .icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin: 0 auto;
    border: 2px solid hsla(0, 0%, 100%, 0.5);
  }
  p {
    width: 100%;
    text-align: center;
    color: #fff;
    margin-top: 10px;
    font-size: 18px;
    font-weight: 700;
  }
}
.controll {
  padding: 0 15px;
  background-color: #fff;
  margin: 10px 0;
  .item {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    &:not(:first-of-type) {
      border-top: 1px solid rgb(234, 234, 234);
    }
    > div {
      display: flex;
      i {
        margin-right: 15px;
      }
    }
  }
}
.out-btn {
  padding: 15px;
  text-align: center;
  margin: 20px 0;
  font-size: 15px;
  color: #666;
  background-color: #fff;
  border-radius: 4px;
  border-bottom: 1px solid rgb(234, 234, 234);
  border-top: 1px solid rgb(234, 234, 234);
}
</style>
