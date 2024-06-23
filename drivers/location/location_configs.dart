class LocationConfigs {
  Map<String, dynamic> _remote = {};

  LocationConfigs({required Map<String, dynamic> remoteConfigs}) {
    _remote = remoteConfigs;
    _setConfigs();
  }

  Future<void> _setConfigs() async {}
}
