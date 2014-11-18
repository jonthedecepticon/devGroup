var app = angular.module('groupDropper')
app.service('productService', function($http, $q, $upload) {
	
	this.getProducts = function(){
		return $http({
			method: 'GET',
			url: '/products',
		}).then(function(res){
			// console.log(res.data);
			return res.data;
		})
	}

	// this.addProduct = function(files, product) {
	// 	console.log(product)
	// 	for(var i = 0; i < files.length; i++){
	// 		var file = files[i];
	// 		$upload.upload({
	// 			method: 'POST',
	// 			url: '/products',
	// 			data: product,
	// 			file: file,
	// 		}).progress(function(evt) {
 //        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
 //      }).success(function(data, status, headers, config) {
 //        // file is uploaded successfully
 //        console.log(data);
 //      });
	// 	}
	// }

	this.addProduct = function(product, file) {
		console.log(product)
		return $http({
			method: 'POST',
			url: '/products',
			data: product,
			file: file
		})
	}

	// gets a product from the db to display
	this.getProduct = function(id) {
	return $http({
		method: 'GET',
		url: '/products/' + id
	})
}

	this.purchase = function(product){
		return $http ({
			method: 'PUT',
			url: '/products/' + product._id,
			data: product
		}).then(function(res) {
			console.log(res.data)
			return res.data
		})
	}

});
