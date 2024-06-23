import 'package:kitakits/plugins/settings/pages/settings_page_event.dart';

class SettingsPageController extends SettingsPageEvent {
  final String idSettings = 'idSettings';

  SettingsPageController() {
    setInit(this);
  }

  Future<void> rebuild() async => update([idSettings]);
}
