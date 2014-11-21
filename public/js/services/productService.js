var app = angular.module('groupDropper')
app.service('productService', function($http, $q) {
	
	this.getProducts = function(){
		return $http({
			method: 'GET',
			url: '/products',
		}).then(function(res){
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

	this.purchase = function(product){
		return $http ({
			method: 'PUT',
			url: '/products/' + product._id,
			data: product
		}).then(function(res) {
			return res.data
		})
	}

});
