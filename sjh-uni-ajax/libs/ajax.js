import Vue from 'vue'
import ajax from '@/uni_modules/u-ajax/js_sdk'

// 创建请求实例
const axios = ajax.create({
	// 默认配置  api 为 h5的反向代理 参考 vue axios 需在 manifest.json 配置  （app，小程序没有跨域）
	baseURL: '/api', //如不需要解决跨域 直接换成你的http：//*** 地址
	timeout: 10000
})

// 注册请求拦截器
axios.interceptors.request.use(
	config => {
		// 在发送请求前做些什么
		// console.log('发送请求前', config)
		return config
	},
	error => {
		// 对请求错误做些什么
		console.log('发请求错误', error)
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
		console.log('响应成功后', response)
		return response
	},
	error => {
		// 对响应错误做点什么
		console.log('响应错误后', error)
		return error
	}
)

//****** 带 Json 的函数 请求头统一是application/json else formData

export const getRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	return axios({
		method: 'get',
		url: `${url}`,
		params: params,
		header: {
			'Authorization': Authorization
		}
	});
};

export const postRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	return axios({
		method: 'post',
		url: `${url}`,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded', //formdata 格式
			'Authorization': Authorization
		},
		data: params,
	});
};

export const postJsonRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	return axios({
		method: 'post',
		url: `${url}`,
		data: params,
		headers: {
			'Content-Type': 'application/json', //json 格式
			'Authorization': Authorization
		}
	});
};
export const deleteRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	return axios({
		method: 'delete',
		url: `${base}${url}`,
		params: params,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': Authorization
		}
	});
};

export const deleteJsonRequest = (url, params) => {
	let Authorization = uni.getStorageSync("access_token");
	return axios({
		method: 'delete',
		url: `${base}${url}`,
		data: params,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': Authorization
		}
	});
};


export default axios
