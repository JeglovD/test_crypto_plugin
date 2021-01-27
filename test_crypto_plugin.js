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
	// var _getPlugin = function(plugin) {
		// if (plugin) {
			// return new Deferred().callback(plugin);
		// }
		// return CryptoPlugin.init();
	// };

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
					console.log( method + "() - ok" ); 
					deferred.callback( result );
				} ).
				addErrback( function( error ) { 
					console.log( method + "() - error: " + error );
					deferred.errback( error );
				} );
			return deferred;
		},

		// EncryptLocalFile: function(recipientsData, localFilePath, plugin) {
			// // Плагин нам могли передать уже инициализированный, если нет, то инициализируем новый
			// return _getPlugin(plugin).addCallback(function(pluginInit) {
				// var pluginCallParams = {
					// 'LocalFilePath': localFilePath,
					// 'RecipientsData': recipientsData
				// };
				// return pluginInit.call('EncryptLocalFile', pluginCallParams);
			// });
		// },
		
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
			// module_class.Call( crypto_plugin, "GetParsedCertificates", {} ).
				// addCallback( function( certificates ) { 
					// //certificates.forEach( function( certificate, number, array ) { 
					// //	console.log( certificate._object ); 
					// //} )

					// // test-online.sbis.run
					// // Кров / Кров123
					// // Тестовый файл лежим в Документах / Моих
					// // Ссылку получаем из ReadAttachmentInfo, 
					// //href: "https://test-disk.sbis.ru/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f",
					// //hrefWithSign: "https://test-disk.sbis.ru/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f?with_sign=true",
					// //relativeUrl: "/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f",
					// //relativeUrlWithSign: "/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f?with_sign=true",
					// //urlToOpen: "https://test-online.sbis.ru/shared/disk/061b67db-58c8-4e76-add0-0b7c44eb67f7",
					// module_class.Call( crypto_plugin, "EncryptDataUrl", { SourceDataUrl: "https://test-disk.sbis.ru/disk/api/v1/c18123e9-ab61-4e38-906f-c0321a20e122_22790a22-10dd-4530-a371-fadb322ad02f", Certificates: certificates } ).
						// addCallback( function( record ) {
							// console.log( "addCallback()" );
							// //debugger;
						// } ).
						// addErrback( function( error ) {
							// console.log( "addErrback()" );
							// //debugger;
						// } );
				// } );

			// Конфигурация плагина
			module_class.Call( crypto_plugin, "Configure", { Parameters: { providerClasses: [ "GOST", "GOST_2012" ] } } ).
				addCallback( function() { 
					// ----------
					// Тест: Получение контейнеров из кэша
					// ----------
					// Чистим кэш
					module_class.Call( crypto_plugin, "ClearCache", {} ).
						addCallback( function() {
							// Получение списка контейнеров из пустого кэша
							module_class.Call( crypto_plugin, "GetContainerNamesFromCache", {} ).
								addCallback( function( containers ) { 
									// Получение списка контейнеров от провайдера
									module_class.Call( crypto_plugin, "GetContainerNames", {} ).
										addCallback( function( containers ) {
											// Получение контейнеров из кэша
											module_class.Call( crypto_plugin, "GetContainerNamesFromCache", {} ).
												addCallback( function() {
													
												} )
										} )
								} )
						} )
					// Получение списка контейнеров от провайдеров
					/*module_class.Call( crypto_plugin, "GetContainerNames", {} ).
						addCallback( function( containers ) { 
							// Получение списка контейнеров из кэша
							module_class.Call( crypto_plugin, "GetContainerNamesFromCache", {} ).
								addCallback( function( containers ) { console.log( "ok" ) } ).
								addErrback( function( error ) { console.log( "error" ) } )
						} ).
						addErrback( function( error ) { console.log( "error" ) } )
					*/
					// Получение списка сертификатов
					/*module_class.Call( crypto_plugin, "GetParsedCertificates", {} ).
						addCallback( function( certificates ) { 
							// Извлекаем закрытый ключ с названием контейнера
							module_class.Call( crypto_plugin, "CertificateGetPrivateKey", { Certificate: certificates[ 0 ]._object, ContainerName: certificates[ 0 ].container_name } ).
								addCallback( function() { console.log( "ok" ) } ).
								addErrback( function() { console.log( "error" ) } )
							// Извлекаем закрытый ключ без названия контейнера
							module_class.Call( crypto_plugin, "CertificateGetPrivateKey", { Certificate: certificates[ 0 ]._object } ).
								addCallback( function() { console.log( "ok" ) } ).
								addErrback( function() { console.log( "error" ) } )
						} ).
						addErrback( function( error ) { console.log( "error" ) } )
					*/
					
					// ----------
					// Тест: Получение 1 сертификата кэша
					// ----------
					// Чистим кэш
					/*module_class.Call( crypto_plugin, "ClearCache" ).
						addCallback( function() {
							// Получение списка контейнеров
							module_class.Call( crypto_plugin, "GetContainerNames", {} ).
								addCallback( function( containers ) {
									// Получение сертификата из пустого кэша
									module_class.Call( crypto_plugin, "LoadCertificateParsedObjectFromCache", { ContainerName: containers[ 0 ] } ).
										addCallback( function( certificate ) {
											console.log( "ok, а так не должно быть" )
										} ).
										addErrback( function( error ) {
											// Получение сертификата от криптопровайдера
											module_class.Call( crypto_plugin, "LoadCertificateParsedObjectFromContainer", { ContainerName: containers[ 0 ] } ).
												addCallback( function( certificate ) {
													// Получение сертификата из кэша
													module_class.Call( crypto_plugin, "LoadCertificateParsedObjectFromCache", { ContainerName: containers[ 0 ] } ).
														addCallback( function( certificate ) {
														} )
												} )
										} )
								} )
						} )
					*/
					
					// ----------
					// Тест: Получение списка сертификатов из кэша
					// ----------
					// Чистим кэш
					/*module_class.Call( crypto_plugin, "ClearCache", {} ).
						addCallback( function() {
							// Получаем список сертификатов из пустого кэша
							module_class.Call( crypto_plugin, "GetParsedCertificatesFromCache", {} ).
								addCallback( function( certificates ) {
									// Получаем список сертификатов от провайдера
									module_class.Call( crypto_plugin, "GetParsedCertificates", {} ).
										addCallback( function( certificates ) {
											// Получаем список сертификатов из кэша
											module_class.Call( crypto_plugin, "GetParsedCertificatesFromCache", {} ).
												addCallback( function( certificates ) {
													
												} )
										} )
								} )
						} )
					*/
				} ).
				addErrback( function() { console.log( "error" ) } )
		}
	};

	return module_class;
});