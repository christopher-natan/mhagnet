class PermissionConfigs {
  Map<String, dynamic> _remote = {};
  PermissionConfigs({required Map<String, dynamic> remoteConfigs}) {
    _remote = remoteConfigs;
    _setConfigs();
  }
  Future<void> _setConfigs() async {}
}
