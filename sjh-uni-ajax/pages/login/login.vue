<template>
	<view class="t-login">
		<view class="t-b">{{title}}</view>
		<form class="cl">
			<view class="cl-con">
				<view class="t-a">
					<image src="@/static/image/login/account.png"></image>
					<input v-model="form.user_name" name="phone" placeholder="请输入账号" />
				</view>
				<view class="t-a">
					<image src="@/static/image/login/password.png"></image>
					<input type="password" v-model="form.password" name="password" placeholder="请输入密码" />
				</view>
				<button form-type="submit" @click="login">立即登录</button>
			</view>
		</form>
	</view>
</template>
<script>
	import LoginApi from "@/api/login.js";
	import md5 from "@/plugins/md5.js"
	export default {
		data() {
			return {
				title: 'sjh-uni-ajax示例',
				form: {
					user_name: "root",
					password: "root-123"
				}
			}
		},
		onLoad() {

		},
		methods: {
			async login() {
				if (this.form.user_name == "" || this.form.password == "") {
					uni.showToast({
						title: "账号密码不正确！",
						icon: "none"
					})
				} else {
					// 请求登录接口
					let params = {
						user_name: this.form.user_name,
						password: md5(this.form.password)
					};
					await LoginApi.login(params).then((res) => {
						console.log(res.data);
						if (res.data) {
							uni.setStorageSync('access_token', res.data.access_token);
						}
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	page {
		background: #FFFFFF;
	}

	.tips {
		width: 100%;
		text-align: center;
		margin-top: 20upx;
		color: #a99c9c;
	}

	.t-login {
		width: 600upx;
		margin: 0 auto;
		font-size: 28upx;
		color: #000
	}

	.t-login button {
		font-size: 28upx;
		background: #000;
		color: #fff;
		height: 90upx;
		line-height: 90upx;
		border-radius: 50upx
	}

	.t-login input {
		padding: 0 20upx 0 120upx;
		height: 90upx;
		line-height: 90upx;
		margin-bottom: 50upx;
		background: #f4f4f4;
		font-size: 28upx;
		border-radius: 50upx
	}

	.t-login .t-a {
		position: relative
	}

	.t-login .t-a image {
		width: 45upx;
		height: 40upx;
		position: absolute;
		left: 40upx;
		top: 28upx;
		border-right: 2upx solid #dedede;
		padding-right: 20upx
	}

	.t-login .t-b {
		text-align: center;
		font-size: 46upx;
		color: #000;
		padding: 200upx 0
	}

	.t-login .t-c {
		position: absolute;
		right: 22upx;
		top: 22upx;
		background: #000;
		color: #fff;
		font-size: 24upx;
		border-radius: 50upx;
		height: 50upx;
		line-height: 50upx;
		padding: 0 25upx
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80upx 0
	}

	.t-login .t-e {
		text-align: center;
		width: 250upx;
		margin: 80upx auto 0
	}

	.t-login .t-g {
		float: left;
		width: 50%
	}

	.t-login .t-e image {
		width: 50upx;
		height: 50upx
	}

	.t-login .t-f {
		text-align: center;
		margin: 80upx 0 0 0;
		color: #666
	}

	.t-login .t-f text {
		margin-left: 8upx;
		color: #999
	}

	.t-login .uni-input-placeholder {
		color: #000
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20'
	}
</style>
