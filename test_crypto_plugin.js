define( [
	'Core/Deferred',
	'Cryptography/CryptoPlugin',
	'i18n!ServerSign',
	'Browser/Transport',
	'SBIS3.Plugin/SbisPluginClientFull',
	"UI/State",
	'Types/entity',
    'Types/collection'
], function(
	Deferred,
	CryptoPlugin,
	rk,
	TransportLib,
	SbisPluginClientFull,
	UiState,
	entity,
	collection
) {
	var module_class = {
		// Функция для вызова метода в плагине
		// Параметры:
		//		Название метода
		//		Параметры
		Call: function( crypto_plugin, method, params ) {
			var deferred = new Deferred();
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
			let crypto_plugin_remote_params = {
				name: "CryptoPluginRemote",
				version: "0.0.0.0"
			};
			var crypto_plugin_remote = new SbisPluginClientFull.LocalService( {
				endpoint: {
					address: crypto_plugin_remote_params.name + '-' + crypto_plugin_remote_params.version,
					contract: crypto_plugin_remote_params.name
				},
				options: {
					mode: "runOnce",
					opener: {},
					// Таймаут ответа - 1 мин
					queryTimeout: 60000
				}
			} );

			// Конфигурация плагина
			module_class.Call( crypto_plugin, "Configure", { Parameters: { providerClasses: [ "GOST", "GOST_2012" ] } } ).
				addCallback( function() { 
				
					{ ////////// Получение контейнеров из кэша
						/*// Чистим кэш
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
						*/
					}
					
					{ ////////// Получение списка контейнеров от провайдеров
						/*module_class.Call( crypto_plugin, "GetContainerNames", {} ).
							addCallback( function( containers ) { 
								// Получение списка контейнеров из кэша
								module_class.Call( crypto_plugin, "GetContainerNamesFromCache", {} ).
									addCallback( function( containers ) { console.log( "ok" ) } ).
									addErrback( function( error ) { console.log( "error" ) } )
							} )
					*/
					}
					
					{ ////////// Получение списка сертификатов, извлечение секретного ключа
						module_class.Call( crypto_plugin, "GetParsedCertificates", {} ).
							addCallback( function( certificates ) {
								if( certificates.length != 0 )
								{
									// Извлекаем закрытый ключ с названием контейнера
									module_class.Call( crypto_plugin, "CertificateGetPrivateKey", { Certificate: certificates[ 0 ]._object, ContainerName: certificates[ 0 ].container_name } ).
										addCallback( function() { console.log( "ok" ) } ).
										addErrback( function() { console.log( "error" ) } )
									// Извлекаем закрытый ключ без названия контейнера
									module_class.Call( crypto_plugin, "CertificateGetPrivateKey", { Certificate: certificates[ 0 ]._object } ).
										addCallback( function() { console.log( "ok" ) } ).
										addErrback( function() { console.log( "error" ) } )
								}
							} )
						
					}
					
					{ ////////// Получение 1 сертификата кэша
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
					}
					
					{ ////////// Получение списка сертификатов из кэша
						/*// Чистим кэш
						module_class.Call( crypto_plugin, "ClearCache", {} ).
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
					}
					
					{ ////////// CryptoPluginRemote.SendContainerInfo
						/*var tokens = new collection.RecordSet( { adapter: 'adapter.sbis' } );
						tokens.add( entity.Record.fromObject( {	Serial: "4C7D9081",	Name: "Новый том", Type: "REMOVABLE_DRIVE",	StorageCapacity: null, StorageFreeSpace: null }, 'adapter.sbis' ) )
						var container = new entity.Record( {
							adapter: 'adapter.sbis',
							format: [
								{ name: "Name", type: "string" },
								{ name: "Thumbprint", type: "string" },
								{ name: "File", type: "rpcfile"}
							]
						} )
						container.set( { 
							Name: "GOST_2012_256_Win_API::FAT12\\46041F31\\00000000.008\\C649",
							Thumbprint: "70239AA5A30C1C7617F811304674215465335603",
							File: { 'Данные': "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" }
						} )
						var send_container_info_param = { 
							Readers: entity.Record.fromObject( 
								{ 
									Tokens: tokens,
									Providers: [ "Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider" ],
									ComputerName: "USD-JEGLOV2",
									ComputerUid: "D45D64D330FD"									
								}, 
								'adapter.sbis' ),
							Container: container
						}
						module_class.Call( crypto_plugin_remote, "SendContainerInfo", { Data: entity.Record.fromObject( send_container_info_param, 'adapter.sbis' ) } ).
							addCallback( function() {
							} )
						*/
					}
				} )
		}
	};

	return module_class;
});