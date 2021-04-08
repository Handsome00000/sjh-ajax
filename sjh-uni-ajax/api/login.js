// 统一请求路径前缀在libs/axios.js中修改
import {
	postRequest,
	postJsonRequest,
} from '@/libs/ajax.js';
let LoginApi = {}
/**
 * @desc 登录接口
 * @param {*} 参数 
 */
LoginApi.login = (params) => {
	//此为示例接口 需换成你的真实接口 测试
	return postJsonRequest('/v1/pub/login', params)
}

export default LoginApi;
