import 'package:get/get.dart';
import 'package:kitakits/plugins/settings/models/settings_model.dart';
import 'package:kitakits/plugins/settings/settings.dart' as plugin;

class SettingsModelEvent extends plugin.Settings {
  late SettingsModel _model;
  final RxString onSet = ''.obs;
  String name = '::SettingsModelEvent';

  Future<void> setInit(SettingsModel model) async {
    _model = model;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withStorageService();
  }

  Future<void> _withStorageService() async {
    await on(storageService.onCleared, () async {
      pr(name, 'storageService.onCleared');
      await _model.read();
    }, priority: 1);
  }
}
