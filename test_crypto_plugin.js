define( [
	'Core/Deferred',
	'Cryptography/CryptoPlugin',
	'i18n!ServerSign',
	'Browser/Transport',
	'SBIS3.Plugin/SbisPluginClientFull'
], function(
	Deferred,
	CryptoPlugin,
	rk,
	TransportLib,
	SbisPluginClientFull
) {
	var _getPlugin = function(plugin) {
		if (plugin) {
			return new Deferred().callback(plugin);
		}
		return CryptoPlugin.init();
	};

	var moduleClass = {

		// Функция для вызова метода в плагине
		// Параметры:
		//		Название метода
		//		Параметры
		Call: function( method, params ) {
			let crypto_plugin_params = {
				name: "SbisCryptoPlugin",
				version: "0.0.0.0"
			};
			var crypto_plugin = new SbisPluginClientFull.LocalService( {
				endpoint: {
					address: crypto_plugin_params.name + '-' + crypto_plugin_params.version,
					contract: crypto_plugin_params.name
				},
				options: {
					mode: "runOnce",
					opener: {},
					// Таймаут ответа - 1 мин
					queryTimeout: 60000
				}
			});
			
			crypto_plugin.call( method ).addCallback( function( result ) { console.log( method + "() -> " + result ); } ).addErrback( function( error ) { console.log( method + "() " + error ) } );
		},

		EncryptLocalFile: function(recipientsData, localFilePath, plugin) {
			// Плагин нам могли передать уже инициализированный, если нет, то инициализируем новый
			return _getPlugin(plugin).addCallback(function(pluginInit) {
				var pluginCallParams = {
					'LocalFilePath': localFilePath,
					'RecipientsData': recipientsData
				};
				return pluginInit.call('EncryptLocalFile', pluginCallParams);
			});
		},
		
		All: function( plugin ) {
//			return _getPlugin(plugin).addCallback(function(pluginInit) {
//				pluginInit.call('IsAnyProviderInstalled').addCallback( function( result ) { console.log( "Callback: result = " + result ); } ).addErrback( function() { console.log( "Errback" ) } );
//			});
			this.Call( "IsAnyProviderInstalled" );
		}
	};

	return moduleClass;
});