var app = angular.module('groupDropper')
app.service('productService', function($http, $q) {
	
	this.getProducts = function(){
		return $http({
			method: 'GET',
			url: '/products',
		}).then(function(res){
			console.log(res.data);
			return res.data;
		})
	}

	this.addProduct = function(product) {
		
		return $http({
			method: 'POST',
			url: '/products',
			data: product
		})
	}

	// gets a product from the db to display
	this.getProduct = function(id) {
	return $http({
		method: 'GET',
		url: '/products/' + id
	})
}

	// this.castVote = function(id, option){
	// 	return $http ({
	// 		method: 'PUT',
	// 		url: '/vote/' + id,
	// 		data: option
	// 	}).then(function(res) {
	// 		console.log(res.data)
	// 		return res.data
	// 	})
	// }

});
