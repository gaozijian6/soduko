export function getData(url,data={}) {
	url = 'https://tea.qingnian8.com/api/bizhi' + url
	return uni.request({
		url,
		header: {
			'access-key': 'gzj666666'
		},
		data
	})
}

