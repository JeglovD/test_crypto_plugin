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

	var module_class = {

		// Функция для вызова метода в плагине
		// Параметры:
		//		Название метода
		//		Параметры
		Call: function( crypto_plugin, method, params ) {
			var deferred = new Deferred();
			
			//let crypto_plugin_params = {
			//	name: "SbisCryptoPlugin",
			//	version: "0.0.0.0"
			//};
			//var crypto_plugin = new SbisPluginClientFull.LocalService( {
			//	endpoint: {
			//		address: crypto_plugin_params.name + '-' + crypto_plugin_params.version,
			//		contract: crypto_plugin_params.name
			//	},
			//	options: {
			//		mode: "runOnce",
			//		opener: {},
			//		// Таймаут ответа - 1 мин
			//		queryTimeout: 60000
			//	}
			//});
			
			crypto_plugin.call( method, params ).
				addCallback( function( result ) { 
					console.log( method + "() " ); 
					deferred.callback( result );
				} ).
				addErrback( function( error ) { 
					console.log( method + "() " + error );
					deferred.errback( error );
				} );
			return deferred;
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
		
		All: function() {
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

//			return _getPlugin(plugin).addCallback(function(pluginInit) {
//				pluginInit.call('IsAnyProviderInstalled').addCallback( function( result ) { console.log( "Callback: result = " + result ); } ).addErrback( function() { console.log( "Errback" ) } );
//			});

			// Получение списка сертификатов на устройстве
			module_class.Call( crypto_plugin, "GetParsedCertificates", {} ).
				addCallback( function( certificates ) { 
					//certificates.forEach( function( certificate, number, array ) { 
					//	console.log( certificate._object ); 
					//} )

					// test-online.sbis.run
					// Кров / Кров123
					// Тестовый файл лежим в Документах / Моих
					// Ссылку получаем из ReadAttachmentInfo, 
					//href: "https://test-disk.sbis.ru/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f",
					//hrefWithSign: "https://test-disk.sbis.ru/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f?with_sign=true",
					//relativeUrl: "/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f",
					//relativeUrlWithSign: "/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f?with_sign=true",
					//urlToOpen: "https://test-online.sbis.ru/shared/disk/061b67db-58c8-4e76-add0-0b7c44eb67f7",
					module_class.Call( crypto_plugin, "EncryptDataUrl", { SourceDataUrl: "https://test-disk.sbis.ru/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f", Certificates: certificates } ).
						addCallback( function( record ) {
							//debugger;
						} ).
						addErrback( function( error ) {
							//debugger;
						} );
				} );
		}
	};

	return module_class;
});