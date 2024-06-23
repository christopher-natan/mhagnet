import 'package:get_storage/get_storage.dart';
import 'package:kitakits/plugins/settings/models/settings_model.dart';

class SettingsStorage {
  static final GetStorage _storage = GetStorage();
  static String settings = 'settings';

  static clearPersisted()  async {
    if (_storage.read(settings) == null) await _storage.write(settings, Settings.toInit().toJson());
  }
}
