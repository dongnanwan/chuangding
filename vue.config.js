module.exports = {
	// baseUrl: './',
	publicPath: './',
	productionSourceMap: false,
	devServer: {
		proxy: {
			'/api': {
				// target:'http://192.168.1.112:8888',
				// target: 'http://192.168.1.105:8888',
				target:'http://192.168.1.138:8888',
				// target: 'http://project.chuangdingshop.com:8080',
				changeOrigin: true,
				pathRewrite: {
					'/api': '/api'
				}
			},
			'/ms': {
				target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
				changeOrigin: true
			},
			'/file/': {
				target: 'https://test.chuangdingshop.com',
				changeOrigin: true,
				pathRewrite: {
					'/file': '/file'
				}
			}
		}
	}
}