class SettingsConfigs {
  Map<String, dynamic> _remote = {};
  SettingsConfigs({required Map<String, dynamic> remoteConfigs}) {
    _remote = remoteConfigs;
    _setConfigs();
  }
  Future<void> _setConfigs() async {}
}
