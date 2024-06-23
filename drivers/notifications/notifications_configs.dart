class NotificationsConfigs {
  Map<String, dynamic> _remote = {};

  NotificationsConfigs({required Map<String, dynamic> remoteConfigs}) {
    _remote = remoteConfigs;
    _setConfigs();
  }

  Future<void> _setConfigs() async {}
}
