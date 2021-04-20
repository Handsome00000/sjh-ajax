import Vue from 'vue'
import ajax from '@/uni_modules/u-ajax/js_sdk'

// 创建请求实例
const axios = ajax.create({
	// 默认配置
	baseURL: '/api',
	timeout: 10000
})

// 注册请求拦截器
axios.interceptors.request.use(
	config => {
		// 在发送请求前做些什么
		console.log('发送请求前', config)
		return config
	},
	error => {
		// 对请求错误做些什么
		// console.log('发请求错误', error)
		//网络请求超时
		uni.showToast({
			title: "网络超时！",
			icon: "none"
		})
		return error
	}
)

// 注册响应拦截器
axios.interceptors.response.use(
	response => {
		// 对响应数据做点什么
		// console.log('响应成功后', response.data)
		return response
	},
	error => {
		// 对响应错误做点什么 
		console.log('响应错误后', error)
		let code = error.statusCode
		if (error.data.error) {
			let errData = error.data.error
			uni.showToast({
				title: errData.message,
				icon: "none"
			})
		} else {
			switch (code) {
				case 401:
					// uni.showToast({
					// 	title: `授权信息已经失效,请重新登录！`,
					// 	icon: "none",
					// 	duration: 2500
					// })
					uni.showModal({
						title: '提示',
						content: '授权信息已经失效,请重新登录！',
						success: (res) => {
							if (res.confirm) {
								console.log("跳转登录")
								uni.redirectTo({
									url: "/pages/login/login"
								})
							}
						}
					});
					break
				case 500:
					uni.showToast({
						title: `连接失败，请检查网络连接！`,
						icon: "none",
						duration: 2500
					})
					break
			}

		}

		return error
	}
)

//****** 带 Json 的函数 请求头统一是application/json else formData

export const getRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	let token_type = uni.getStorageSync("token_type");
	return axios({
		method: 'get',
		url: `${url}`,
		params: params,
		header: {
			'Authorization': token_type + " " + Authorization
		}
	});
};

export const postRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	let token_type = uni.getStorageSync("token_type");
	return axios({
		method: 'post',
		url: `${url}`,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded', //formdata 格式
			'Authorization': token_type + " " + Authorization
		},
		data: params,
	});
};

export const postJsonRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	let token_type = uni.getStorageSync("token_type");
	return axios({
		method: 'post',
		url: `${url}`,
		data: params,
		header: {
			'Content-Type': 'application/json', //json 格式
			'Authorization': token_type + " " + Authorization
		}
	});
};

//params 是 get  data 是 post
export const deleteJsonRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	let token_type = uni.getStorageSync("token_type");
	return axios({
		method: 'delete',
		url: `${url}`,
		params: params,
		header: {
			'Content-Type': 'application/json',
			'Authorization': token_type + " " + Authorization
		}
	});
};

export const deleteRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	let token_type = uni.getStorageSync("token_type");
	return axios({
		method: 'delete',
		url: `${url}`,
		data: params,
		header: {
			'Content-Type': 'application/json',
			'Authorization': token_type + " " + Authorization
		}
	});
};


export default axios
