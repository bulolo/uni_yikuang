import http from './interface'


// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	...require("./home"),
	...require("./me"),
	...require("./shop"),
	...require("./hospital"),
	...require("./guide"),
	...require("./auth"),
	...require("./article")
}