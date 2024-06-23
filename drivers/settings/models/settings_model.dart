import 'package:kitakits/configs.dart';
import 'package:kitakits/plugins/settings/models/settings_model_event.dart';
import 'package:kitakits/plugins/settings/settings_storage.dart';

class Settings {
  static String tableName = 'settings';
  bool isEnableDarkMode;
  bool isEnableSounds;
  bool isEnableNotifications;
  bool isDriveMode;
  bool isFollow;
  bool isPolyline;
  bool isCreditsRunOutAlert;
  bool isNormalMap;
  int mapTheme;

  Settings(
      {required this.isEnableDarkMode,
      required this.isEnableSounds,
      required this.isEnableNotifications,
      required this.isDriveMode,
      required this.isFollow,
      required this.isPolyline,
      required this.isCreditsRunOutAlert,
      required this.isNormalMap,
      required this.mapTheme});

  Settings.fromJson(dynamic json)
      : isEnableDarkMode = json['isEnableDarkMode'],
        isEnableSounds = json['isEnableSounds'],
        isEnableNotifications = json['isEnableNotifications'],
        isDriveMode = json['isDriveMode'],
        isFollow = json['isFollow'],
        isPolyline = json['isPolyline'],
        isCreditsRunOutAlert = json['isCreditsRunOutAlert'],
        isNormalMap = json['isNormalMap'],
        mapTheme = json['mapTheme'];

  dynamic toJson() => {
        'isEnableDarkMode': isEnableDarkMode,
        'isEnableSounds': isEnableSounds,
        'isEnableNotifications': isEnableNotifications,
        'isDriveMode': isDriveMode,
        'isCreditsRunOutAlert': isCreditsRunOutAlert,
        'isPolyline': isPolyline,
        'isNormalMap': isNormalMap,
        'mapTheme': mapTheme,
      };

  static Settings toInit() => Settings(
        isEnableDarkMode: false,
        isEnableSounds: true,
        isEnableNotifications: true,
        isDriveMode: true,
        isFollow: true,
        isPolyline: false,
        isCreditsRunOutAlert: false,
        isNormalMap: true,
        mapTheme: Configs.mapDefaultTheme,
      );
}

class SettingsModel extends SettingsModelEvent {
  static String mapTheme = 'mapTheme';
  static String isFollow = 'isFollow';
  static String isPolyline = 'isPolyline';
  static String isCreditsRunOutAlert = 'isCreditsRunOutAlert';
  static String isNormalMap = 'isNormalMap';
  static String isDriveMode = 'isDriveMode';
  Settings data = Settings.toInit();

  SettingsModel() {
    setInit(this);
  }

  Future<void> read() async {
    Map settings = storage.read(SettingsStorage.settings);
    await _setToData(settings);
    await _setDisabledOnStart();
  }

  Future<void> save(String field, dynamic value) async {
    Map settings = settingsModel.data.toJson();
    settings[field] = value;
    await _setToData(settings);
    await storage.write(SettingsStorage.settings, data.toJson());
    await set(settingsModel.onSet);
  }

  Future<void> _setDisabledOnStart() async {
    data.isPolyline = false;
  }

  Future<void> _setToData(Map settings) async {
    data = Settings(
      isEnableDarkMode: settings['isEnableDarkMode'],
      isEnableSounds: settings['isEnableSounds'] ?? true,
      isEnableNotifications: settings['isEnableNotifications'] ?? true,
      isDriveMode: settings['isDriveMode'] ?? true,
      isFollow: settings['isFollow'] ?? true,
      isPolyline: settings['isPolyline'] ?? false,
      isCreditsRunOutAlert: settings['isCreditsRunOutAlert'] ?? false,
      isNormalMap: settings['isNormalMap'] ?? false,
      mapTheme: settings['mapTheme'] ?? Configs.mapDefaultTheme,
    );
  }

  bool isDarkMode() => data.isEnableDarkMode;
}
