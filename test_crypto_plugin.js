define( [
	'Core/Deferred',
	'Cryptography/CryptoPlugin',
	'i18n!ServerSign',
	'Browser/Transport'
], function(
	Deferred,
	CryptoPlugin,
	rk,
	TransportLib
) {
	var _getPlugin = function(plugin) {
		if (plugin) {
			return new Deferred().callback(plugin);
		}
		return CryptoPlugin.init();
	};

	var moduleClass = {

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
			return _getPlugin(plugin).addCallback(function(pluginInit) {
				pluginInit.call('IsAnyProviderInstalled').addCallback( function( result ) { console.log( "Callback: result = " + result ); } ).addErrback( function() { console.log( "Errback" ) } );
			});
		}
	};

	return moduleClass;
});